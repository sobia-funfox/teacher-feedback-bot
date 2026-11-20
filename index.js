require('dotenv').config();
const { App } = require('@slack/bolt');
const cron = require('node-cron');
const axios = require('axios');

const teachingRole = require('./roles/teaching');
const academicCounselorRole = require('./roles/academicCounselor');

const ROLES = {
  Teaching: {
    module: teachingRole,
    sheetTab: teachingRole.sheetTab || 'Teachers_Tracking',
    roleLabel: 'Teaching',
    employeeTitle: 'teacher',
  },
  'Academic Counselor': {
    module: academicCounselorRole,
    sheetTab: academicCounselorRole.sheetTab || 'AcademicCounselor_Tracking',
    roleLabel: 'Academic Counselor',
    employeeTitle: 'employee',
  },
};

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

function getRoleConfig(roleName) {
  return ROLES[roleName] || ROLES.Teaching;
}

function getMilestoneQuestions(roleConfig, reviewType) {
  const milestoneData = roleConfig.module?.milestones?.[reviewType];
  if (milestoneData?.questions) {
    return {
      focus: milestoneData.focus || '',
      questions: milestoneData.questions,
    };
  }

  const formConfig = roleConfig.module?.milestoneForms?.[reviewType];
  if (formConfig?.questions) {
    return {
      focus: formConfig.subtitle || '',
      questions: formConfig.questions.map((q) => ({
        label: `${q.label}: ${q.question}`,
        placeholder: 'Select an option',
        options: q.options,
      })),
    };
  }

  return { focus: '', questions: [] };
}

function getRatingOptions(roleConfig) {
  if (Array.isArray(roleConfig.module?.overallRatingOptions) && roleConfig.module.overallRatingOptions.length > 0) {
    return roleConfig.module.overallRatingOptions.map((rating) => ({
      text: { type: 'plain_text', text: rating.slice(0, 75) },
      value: rating.slice(0, 75),
    }));
  }

  return [
    { text: { type: 'plain_text', text: '5 - Exceeds Expectations' }, value: '5 - Exceeds Expectations' },
    { text: { type: 'plain_text', text: '4 - Meets Expectations' }, value: '4 - Meets Expectations' },
    { text: { type: 'plain_text', text: '3 - Satisfactory' }, value: '3 - Satisfactory' },
    { text: { type: 'plain_text', text: '2 - Needs Improvement' }, value: '2 - Needs Improvement' },
    { text: { type: 'plain_text', text: '1 - Unsatisfactory' }, value: '1 - Unsatisfactory' },
  ];
}

// Function to check Google Sheet and send review reminders
async function checkAndSendReminders() {
  console.log('Checking Google Sheet for due reviews...');
  try {
    const response = await axios.get(APPS_SCRIPT_URL);
    const dueReviews = response.data.data;

    if (!Array.isArray(dueReviews) || dueReviews.length === 0) {
      console.log('No reviews due right now.');
      return;
    }

    for (const item of dueReviews) {
      const employeeName = item.teacherName || item.employeeName || item.name;
      const employeeId = item.teacherId || item.employeeId || item.employeeSlackId;
      const teamLeadId = item.teamLeadId || item.teamLeadSlackId;
      const milestone = item.milestone;
      const rowNumber = item.rowNumber;
      const role =
        item.role ||
        (item.sheetTab === 'AcademicCounselor_Tracking' ? 'Academic Counselor' : 'Teaching');
      const roleConfig = getRoleConfig(role);
      const sheetTab = item.sheetTab || roleConfig.sheetTab;

      if (!teamLeadId || !teamLeadId.startsWith('U')) {
        console.log(`Skipping ${employeeName}: Invalid Team Lead Slack ID (${teamLeadId})`);
        continue;
      }

      await app.client.chat.postMessage({
        channel: teamLeadId,
        text: `Action Required: ${milestone} Formal Review for ${employeeName} (${roleConfig.roleLabel})`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*ACTION REQUIRED: ${milestone} Formal Review*\n\nDear Team Lead,\n\nThe evaluation for ${roleConfig.employeeTitle} *${employeeName}* (*${roleConfig.roleLabel}*) is due today. Please click the button below to submit your feedback.`
            }
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: `Open ${milestone} Form`
                },
                style: 'primary',
                action_id: 'open_review_modal',
                value: JSON.stringify({
                  teacherName: employeeName,
                  teacherId: employeeId,
                  reviewType: milestone,
                  rowIndex: rowNumber,
                  role: roleConfig.roleLabel,
                  sheetTab,
                })
              }
            ]
          }
        ]
      });

      console.log(`Reminder sent to ${teamLeadId} for ${roleConfig.roleLabel} ${employeeName}`);
    }
  } catch (error) {
    console.error('Error fetching due reviews:', error.message);
  }
}

// Listen for Button Click and Open Modal Form
app.action('open_review_modal', async ({ ack, body, client }) => {
  await ack();

  const {
    teacherName,
    teacherId,
    reviewType,
    rowIndex,
    role = 'Teaching',
    sheetTab,
  } = JSON.parse(body.actions[0].value);

  const roleConfig = getRoleConfig(role);
  const resolvedSheetTab = sheetTab || roleConfig.sheetTab;
  const { focus, questions } = getMilestoneQuestions(roleConfig, reviewType);
  const ratingOptions = getRatingOptions(roleConfig);

  let milestoneBlocks = [];

  if (questions.length > 0) {
    if (focus) {
      milestoneBlocks.push(
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Review Focus:* ${focus}`
          }
        },
        { type: 'divider' }
      );
    }

    questions.forEach((q, index) => {
      const qNum = index + 1;
      milestoneBlocks.push({
        type: 'input',
        block_id: `q${qNum}_block`,
        label: { type: 'plain_text', text: q.label.slice(0, 2000) },
        element: {
          type: 'static_select',
          action_id: `q${qNum}_input`,
          placeholder: { type: 'plain_text', text: (q.placeholder || 'Select an option').slice(0, 150) },
          options: q.options.map((opt) => ({
            text: { type: 'plain_text', text: opt.slice(0, 75) },
            value: opt.slice(0, 75)
          }))
        }
      });
    });
  }

  await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'submit_teacher_review',
      private_metadata: JSON.stringify({
        teacherName,
        teacherId,
        reviewType,
        rowIndex,
        role: roleConfig.roleLabel,
        sheetTab: resolvedSheetTab,
      }),
      title: {
        type: 'plain_text',
        text: `${reviewType} Review`.slice(0, 24)
      },
      submit: {
        type: 'plain_text',
        text: 'Submit'
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Name:* ${teacherName}\n*Role:* ${roleConfig.roleLabel}\n*Milestone Stage:* ${reviewType}`
          }
        },
        { type: 'divider' },
        ...milestoneBlocks,
        { type: 'divider' },
        {
          type: 'input',
          block_id: 'rating_block',
          label: {
            type: 'plain_text',
            text: 'Overall Performance Rating'
          },
          element: {
            type: 'static_select',
            action_id: 'rating_select',
            placeholder: {
              type: 'plain_text',
              text: 'Select overall rating'
            },
            options: ratingOptions
          }
        },
        {
          type: 'input',
          optional: true,
          block_id: 'comments_block',
          label: {
            type: 'plain_text',
            text: 'Additional Notes (Optional)'
          },
          element: {
            type: 'plain_text_input',
            action_id: 'comments_input',
            multiline: true,
            placeholder: {
              type: 'plain_text',
              text: 'Enter any additional feedback or comments here...'
            }
          }
        }
      ]
    }
  });
});

// Handle Modal Form Submission
app.view('submit_teacher_review', async ({ ack, body, view, client }) => {
  await ack();

  const {
    teacherName,
    teacherId,
    reviewType,
    rowIndex,
    role = 'Teaching',
    sheetTab,
  } = JSON.parse(view.private_metadata);

  const roleConfig = getRoleConfig(role);
  const resolvedSheetTab = sheetTab || roleConfig.sheetTab;
  const values = view.state.values;
  const reviewerId = body.user.id;

  const { questions } = getMilestoneQuestions(roleConfig, reviewType);

  let notesParts = [];
  let employeeReportLines = [];

  questions.forEach((q, index) => {
    const qNum = index + 1;
    const blockId = `q${qNum}_block`;
    const actionId = `q${qNum}_input`;
    if (values[blockId] && values[blockId][actionId] && values[blockId][actionId].selected_option) {
      const answer = values[blockId][actionId].selected_option.value;
      const cleanLabel = q.label.replace(/^\d+\.\s*/, '');
      notesParts.push(`Q${qNum}: ${answer}`);
      employeeReportLines.push(`*${qNum}. ${cleanLabel}:*\n${answer}`);
    }
  });

  const rating = values.rating_block.rating_select.selected_option.value;
  const optionalComments =
    values.comments_block && values.comments_block.comments_input
      ? values.comments_block.comments_input.value
      : '';

  if (optionalComments) {
    notesParts.push(`Comments: ${optionalComments}`);
    employeeReportLines.push(`*Additional Notes:*\n${optionalComments}`);
  }

  const notes = notesParts.join(' | ');

  try {
    // 1. Save to Google Sheet (Teachers_Tracking or AcademicCounselor_Tracking)
    await axios.post(APPS_SCRIPT_URL, {
      teacherName,
      role: roleConfig.roleLabel,
      sheetTab: resolvedSheetTab,
      milestone: reviewType,
      rating,
      notes,
      reviewerId,
      rowIndex
    });

    // 2. Confirm to Team Lead
    await client.chat.postMessage({
      channel: reviewerId,
      text: `Thank you! The ${reviewType} evaluation for *${teacherName}* (${roleConfig.roleLabel}) has been successfully recorded in the ${resolvedSheetTab} sheet and sent to the ${roleConfig.employeeTitle}.`
    });

    // 3. Send Formal Feedback Report directly to the Employee
    if (teacherId && teacherId.startsWith('U')) {
      await client.chat.postMessage({
        channel: teacherId,
        text: `Your ${reviewType} Performance Review Feedback`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*${reviewType} Formal Review Feedback*\n\nDear ${teacherName},\n\nYour *${reviewType}* performance evaluation (${roleConfig.roleLabel}) has been completed by <@${reviewerId}>. Please find your detailed feedback below:`
            }
          },
          { type: 'divider' },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: employeeReportLines.join('\n\n')
            }
          },
          { type: 'divider' },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Overall Performance Rating:* ${rating}`
            }
          }
        ]
      });
      console.log(`Feedback report sent to ${roleConfig.employeeTitle} ${teacherName} (${teacherId})`);
    } else {
      console.log(`Could not DM ${roleConfig.employeeTitle} ${teacherName}: Invalid or missing employeeId (${teacherId})`);
    }
  } catch (error) {
    console.error('Error submitting review:', error.message);
  }
});

// Cron Job: Runs every minute
cron.schedule('* * * * *', () => {
  checkAndSendReminders();
});

(async () => {
  await app.start();
  console.log('Feedback Bot is running successfully with teaching.js and academicCounselor.js!');
})();