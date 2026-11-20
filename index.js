require('dotenv').config();
const { App } = require('@slack/bolt');
const cron = require('node-cron');
const axios = require('axios');

const teachingRole = require('./roles/teaching');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

// Function to check Google Sheet and send review reminders
async function checkAndSendReminders() {
  console.log('Checking Google Sheet for due teacher reviews...');
  try {
    const response = await axios.get(APPS_SCRIPT_URL);
    const dueReviews = response.data.data;

    if (!Array.isArray(dueReviews) || dueReviews.length === 0) {
      console.log('No reviews due right now.');
      return;
    }

    for (const item of dueReviews) {
      const { teacherName, teacherId, teamLeadId, milestone, rowNumber } = item;

      if (!teamLeadId || !teamLeadId.startsWith('U')) {
        console.log(`Skipping ${teacherName}: Invalid Team Lead Slack ID (${teamLeadId})`);
        continue;
      }

      await app.client.chat.postMessage({
        channel: teamLeadId,
        text: `Action Required: ${milestone} Formal Review for ${teacherName}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*ACTION REQUIRED: ${milestone} Formal Review*\n\nDear Team Lead,\n\nThe evaluation for teacher *${teacherName}* is due today. Please click the button below to submit your feedback.`
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
                value: JSON.stringify({ teacherName, teacherId, reviewType: milestone, rowIndex: rowNumber })
              }
            ]
          }
        ]
      });

      console.log(`Reminder sent to ${teamLeadId} for teacher ${teacherName}`);
    }
  } catch (error) {
    console.error('Error fetching due reviews:', error.message);
  }
}

// Listen for Button Click and Open Modal Form using teaching.js
app.action('open_review_modal', async ({ ack, body, client }) => {
  await ack();

  const { teacherName, teacherId, reviewType, rowIndex } = JSON.parse(body.actions[0].value);
  const milestoneData = teachingRole.milestones[reviewType];

  let milestoneBlocks = [];

  if (milestoneData) {
    milestoneBlocks.push(
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*🎯 Review Focus:* ${milestoneData.focus}`
        }
      },
      { type: 'divider' }
    );

    milestoneData.questions.forEach((q, index) => {
      const qNum = index + 1;
      milestoneBlocks.push({
        type: 'input',
        block_id: `q${qNum}_block`,
        label: { type: 'plain_text', text: q.label },
        element: {
          type: 'static_select',
          action_id: `q${qNum}_input`,
          placeholder: { type: 'plain_text', text: q.placeholder },
          options: q.options.map((opt) => ({
            text: { type: 'plain_text', text: opt },
            value: opt
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
      private_metadata: JSON.stringify({ teacherName, teacherId, reviewType, rowIndex }),
      title: {
        type: 'plain_text',
        text: `${reviewType} Review`
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
            text: `*Teacher Name:* ${teacherName}\n*Milestone Stage:* ${reviewType}`
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
            options: [
              { text: { type: 'plain_text', text: '5 - Exceeds Expectations' }, value: '5 - Exceeds Expectations' },
              { text: { type: 'plain_text', text: '4 - Meets Expectations' }, value: '4 - Meets Expectations' },
              { text: { type: 'plain_text', text: '3 - Satisfactory' }, value: '3 - Satisfactory' },
              { text: { type: 'plain_text', text: '2 - Needs Improvement' }, value: '2 - Needs Improvement' },
              { text: { type: 'plain_text', text: '1 - Unsatisfactory' }, value: '1 - Unsatisfactory' }
            ]
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

  const { teacherName, teacherId, reviewType, rowIndex } = JSON.parse(view.private_metadata);
  const values = view.state.values;
  const reviewerId = body.user.id;

  const milestoneData = teachingRole.milestones[reviewType];
  const questions = milestoneData ? milestoneData.questions : [];

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
    // 1. Save to Google Sheet (Teachers_Tracking tab)
    await axios.post(APPS_SCRIPT_URL, {
      teacherName,
      sheetTab: teachingRole.sheetTab,
      milestone: reviewType,
      rating,
      notes,
      reviewerId,
      rowIndex
    });

    // 2. Confirm to Team Lead
    await client.chat.postMessage({
      channel: reviewerId,
      text: `Thank you! The ${reviewType} evaluation for *${teacherName}* has been successfully recorded in the ${teachingRole.sheetTab} sheet and sent to the teacher.`
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
              text: `*${reviewType} Formal Review Feedback*\n\nDear ${teacherName},\n\nYour *${reviewType}* performance evaluation has been completed by <@${reviewerId}>. Please find your detailed feedback below:`
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
      console.log(`Feedback report sent to employee ${teacherName} (${teacherId})`);
    } else {
      console.log(`Could not DM teacher ${teacherName}: Invalid or missing teacherId (${teacherId})`);
    }
  } catch (error) {
    console.error('Error submitting review:', error.message);
  }
});

// Cron Job: Runs every 5 hours
cron.schedule('0 */5 * * *', () => {
  checkAndSendReminders();
});

(async () => {
  await app.start();
  console.log('⚡️ Feedback Bot is running successfully with teaching.js!');
})();