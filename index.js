require('dotenv').config();
const { App } = require('@slack/bolt');
const cron = require('node-cron');
const axios = require('axios');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL;

// Function to check Google Sheet and send review reminders (Runs every hour: 0 * * * *)
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

// Listen for Button Click and Open Modal Form with Dropdown Questions
app.action('open_review_modal', async ({ ack, body, client }) => {
  await ack();

  const { teacherName, teacherId, reviewType, rowIndex } = JSON.parse(body.actions[0].value);

  let milestoneBlocks = [];

  if (reviewType === "14-Day") {
    milestoneBlocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*🎯 Review Focus:* Orientation and engagement (observing primary teachers)'
        }
      },
      { type: 'divider' },
      {
        type: 'input',
        block_id: 'q1_block',
        label: { type: 'plain_text', text: '1. Session Attendance %' },
        element: {
          type: 'static_select',
          action_id: 'q1_input',
          placeholder: { type: 'plain_text', text: 'Select attendance %' },
          options: [
            { text: { type: 'plain_text', text: '95% - 100% (Full / Near-Full Attendance)' }, value: '95% - 100% (Full / Near-Full Attendance)' },
            { text: { type: 'plain_text', text: '85% - 94% (Good Attendance)' }, value: '85% - 94% (Good Attendance)' },
            { text: { type: 'plain_text', text: '75% - 84% (Below Target)' }, value: '75% - 84% (Below Target)' },
            { text: { type: 'plain_text', text: 'Below 75% (Critical / Unsatisfactory)' }, value: 'Below 75% (Critical / Unsatisfactory)' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q2_block',
        label: { type: 'plain_text', text: '2. Punctuality' },
        element: {
          type: 'static_select',
          action_id: 'q2_input',
          placeholder: { type: 'plain_text', text: 'Select punctuality level' },
          options: [
            { text: { type: 'plain_text', text: 'Always on Time (100% Punctual)' }, value: 'Always on Time (100% Punctual)' },
            { text: { type: 'plain_text', text: 'Mostly Punctual (1-2 Minor Delays)' }, value: 'Mostly Punctual (1-2 Minor Delays)' },
            { text: { type: 'plain_text', text: 'Frequently Late (Needs Improvement)' }, value: 'Frequently Late (Needs Improvement)' },
            { text: { type: 'plain_text', text: 'Consistently Late (Unsatisfactory)' }, value: 'Consistently Late (Unsatisfactory)' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q3_block',
        label: { type: 'plain_text', text: '3. Reflective Journal Quality' },
        element: {
          type: 'static_select',
          action_id: 'q3_input',
          placeholder: { type: 'plain_text', text: 'Select journal quality' },
          options: [
            { text: { type: 'plain_text', text: 'Detailed, Insightful & Submitted on Time' }, value: 'Detailed, Insightful & Submitted on Time' },
            { text: { type: 'plain_text', text: 'Good Quality & Complete' }, value: 'Good Quality & Complete' },
            { text: { type: 'plain_text', text: 'Superficial / Incomplete Entries' }, value: 'Superficial / Incomplete Entries' },
            { text: { type: 'plain_text', text: 'Missing or Not Submitted' }, value: 'Missing or Not Submitted' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q4_block',
        label: { type: 'plain_text', text: '4. Content Review Participation' },
        element: {
          type: 'static_select',
          action_id: 'q4_input',
          placeholder: { type: 'plain_text', text: 'Select participation level' },
          options: [
            { text: { type: 'plain_text', text: 'Highly Active & Engaged in Discussions' }, value: 'Highly Active & Engaged in Discussions' },
            { text: { type: 'plain_text', text: 'Regular & Constructive Participation' }, value: 'Regular & Constructive Participation' },
            { text: { type: 'plain_text', text: 'Passive / Minimal Engagement' }, value: 'Passive / Minimal Engagement' },
            { text: { type: 'plain_text', text: 'Absent or Non-Participatory' }, value: 'Absent or Non-Participatory' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q5_block',
        label: { type: 'plain_text', text: '5. Receptiveness to Peer/Mentor Feedback' },
        element: {
          type: 'static_select',
          action_id: 'q5_input',
          placeholder: { type: 'plain_text', text: 'Select receptiveness level' },
          options: [
            { text: { type: 'plain_text', text: 'Highly Receptive & Quickly Applies Feedback' }, value: 'Highly Receptive & Quickly Applies Feedback' },
            { text: { type: 'plain_text', text: 'Open & Receptive to Suggestions' }, value: 'Open & Receptive to Suggestions' },
            { text: { type: 'plain_text', text: 'Somewhat Defensive / Slow to Apply' }, value: 'Somewhat Defensive / Slow to Apply' },
            { text: { type: 'plain_text', text: 'Resistant to Feedback' }, value: 'Resistant to Feedback' }
          ]
        }
      }
    ];
  } else if (reviewType === "60-Day") {
    milestoneBlocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*🎯 Review Focus:* Early classroom practice'
        }
      },
      { type: 'divider' },
      {
        type: 'input',
        block_id: 'q1_block',
        label: { type: 'plain_text', text: '1. Lesson Plan Quality' },
        element: {
          type: 'static_select',
          action_id: 'q1_input',
          placeholder: { type: 'plain_text', text: 'Select quality level' },
          options: [
            { text: { type: 'plain_text', text: 'Well-Structured, Detailed & Aligned' }, value: 'Well-Structured, Detailed & Aligned' },
            { text: { type: 'plain_text', text: 'Good & Meets Standards' }, value: 'Good & Meets Standards' },
            { text: { type: 'plain_text', text: 'Basic / Needs Better Preparation' }, value: 'Basic / Needs Better Preparation' },
            { text: { type: 'plain_text', text: 'Incomplete or Poorly Planned' }, value: 'Incomplete or Poorly Planned' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q2_block',
        label: { type: 'plain_text', text: '2. First Formal Observation Score' },
        element: {
          type: 'static_select',
          action_id: 'q2_input',
          placeholder: { type: 'plain_text', text: 'Select observation outcome' },
          options: [
            { text: { type: 'plain_text', text: 'Exceeds Expectations (90% - 100%)' }, value: 'Exceeds Expectations (90% - 100%)' },
            { text: { type: 'plain_text', text: 'Meets Expectations (75% - 89%)' }, value: 'Meets Expectations (75% - 89%)' },
            { text: { type: 'plain_text', text: 'Developing / Needs Improvement (60% - 74%)' }, value: 'Developing / Needs Improvement (60% - 74%)' },
            { text: { type: 'plain_text', text: 'Unsatisfactory (Below 60%)' }, value: 'Unsatisfactory (Below 60%)' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q3_block',
        label: { type: 'plain_text', text: '3. Classroom Management' },
        element: {
          type: 'static_select',
          action_id: 'q3_input',
          placeholder: { type: 'plain_text', text: 'Select management level' },
          options: [
            { text: { type: 'plain_text', text: 'Strong Control & Positive Environment' }, value: 'Strong Control & Positive Environment' },
            { text: { type: 'plain_text', text: 'Effective Management with Minor Gaps' }, value: 'Effective Management with Minor Gaps' },
            { text: { type: 'plain_text', text: 'Struggles with Pacing / Behavior' }, value: 'Struggles with Pacing / Behavior' },
            { text: { type: 'plain_text', text: 'Poor Classroom Control' }, value: 'Poor Classroom Control' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q4_block',
        label: { type: 'plain_text', text: '4. Student Engagement' },
        element: {
          type: 'static_select',
          action_id: 'q4_input',
          placeholder: { type: 'plain_text', text: 'Select engagement level' },
          options: [
            { text: { type: 'plain_text', text: 'High Participation & Active Learning' }, value: 'High Participation & Active Learning' },
            { text: { type: 'plain_text', text: 'Good Engagement Across Most Students' }, value: 'Good Engagement Across Most Students' },
            { text: { type: 'plain_text', text: 'Low / Uneven Student Participation' }, value: 'Low / Uneven Student Participation' },
            { text: { type: 'plain_text', text: 'Students Disengaged' }, value: 'Students Disengaged' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q5_block',
        label: { type: 'plain_text', text: '5. Marking & Feedback Turnaround' },
        element: {
          type: 'static_select',
          action_id: 'q5_input',
          placeholder: { type: 'plain_text', text: 'Select turnaround speed' },
          options: [
            { text: { type: 'plain_text', text: 'Always On Time with Constructive Feedback' }, value: 'Always On Time with Constructive Feedback' },
            { text: { type: 'plain_text', text: 'Mostly On Time' }, value: 'Mostly On Time' },
            { text: { type: 'plain_text', text: 'Frequently Delayed' }, value: 'Frequently Delayed' },
            { text: { type: 'plain_text', text: 'Incomplete or Missing Feedback' }, value: 'Incomplete or Missing Feedback' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q6_block',
        label: { type: 'plain_text', text: '6. Uptake of 14-Day Action Points' },
        element: {
          type: 'static_select',
          action_id: 'q6_input',
          placeholder: { type: 'plain_text', text: 'Select progress level' },
          options: [
            { text: { type: 'plain_text', text: 'Fully Implemented All Action Points' }, value: 'Fully Implemented All Action Points' },
            { text: { type: 'plain_text', text: 'Good Progress on Most Points' }, value: 'Good Progress on Most Points' },
            { text: { type: 'plain_text', text: 'Partial / Slow Implementation' }, value: 'Partial / Slow Implementation' },
            { text: { type: 'plain_text', text: 'No Visible Improvement' }, value: 'No Visible Improvement' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q7_block',
        label: { type: 'plain_text', text: '7. Attendance & Punctuality (Days 15–60)' },
        element: {
          type: 'static_select',
          action_id: 'q7_input',
          placeholder: { type: 'plain_text', text: 'Select attendance status' },
          options: [
            { text: { type: 'plain_text', text: '95% - 100% (Excellent)' }, value: '95% - 100% (Excellent)' },
            { text: { type: 'plain_text', text: '85% - 94% (Good)' }, value: '85% - 94% (Good)' },
            { text: { type: 'plain_text', text: '75% - 84% (Needs Improvement)' }, value: '75% - 84% (Needs Improvement)' },
            { text: { type: 'plain_text', text: 'Below 75% (Unsatisfactory)' }, value: 'Below 75% (Unsatisfactory)' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q8_block',
        label: { type: 'plain_text', text: '8. Disables Chat? (Classroom Control)' },
        element: {
          type: 'static_select',
          action_id: 'q8_input',
          placeholder: { type: 'plain_text', text: 'Select chat management status' },
          options: [
            { text: { type: 'plain_text', text: 'Yes, Consistently Disables Chat When Needed' }, value: 'Yes, Consistently Disables Chat When Needed' },
            { text: { type: 'plain_text', text: 'Mostly Disables Chat (Occasional Reminders)' }, value: 'Mostly Disables Chat (Occasional Reminders)' },
            { text: { type: 'plain_text', text: 'Rarely Disables Chat (Causes Distractions)' }, value: 'Rarely Disables Chat (Causes Distractions)' },
            { text: { type: 'plain_text', text: 'No, Does Not Manage Chat Settings' }, value: 'No, Does Not Manage Chat Settings' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q9_block',
        label: { type: 'plain_text', text: '9. Builds on Homework Progress?' },
        element: {
          type: 'static_select',
          action_id: 'q9_input',
          placeholder: { type: 'plain_text', text: 'Select homework follow-up level' },
          options: [
            { text: { type: 'plain_text', text: 'Consistently Reviews & Integrates Homework' }, value: 'Consistently Reviews & Integrates Homework' },
            { text: { type: 'plain_text', text: 'Regularly Checks & Builds on Homework' }, value: 'Regularly Checks & Builds on Homework' },
            { text: { type: 'plain_text', text: 'Occasionally References Homework' }, value: 'Occasionally References Homework' },
            { text: { type: 'plain_text', text: 'Does Not Review or Build on Homework' }, value: 'Does Not Review or Build on Homework' }
          ]
        }
      }
    ];
  } else if (reviewType === "6-Month") {
    milestoneBlocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*🎯 Review Focus:* Sustained impact and fit'
        }
      },
      { type: 'divider' },
      {
        type: 'input',
        block_id: 'q1_block',
        label: { type: 'plain_text', text: '1. Observation Score Trend (2+ Obs)' },
        element: {
          type: 'static_select',
          action_id: 'q1_input',
          placeholder: { type: 'plain_text', text: 'Select score trend' },
          options: [
            { text: { type: 'plain_text', text: 'Consistent Upward Trend / High Scores' }, value: 'Consistent Upward Trend / High Scores' },
            { text: { type: 'plain_text', text: 'Stable & Meets Standards' }, value: 'Stable & Meets Standards' },
            { text: { type: 'plain_text', text: 'Inconsistent / Fluctuating Scores' }, value: 'Inconsistent / Fluctuating Scores' },
            { text: { type: 'plain_text', text: 'Declining Performance Trend' }, value: 'Declining Performance Trend' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q2_block',
        label: { type: 'plain_text', text: '2. Student Progress Data' },
        element: {
          type: 'static_select',
          action_id: 'q2_input',
          placeholder: { type: 'plain_text', text: 'Select progress outcome' },
          options: [
            { text: { type: 'plain_text', text: 'Exceeding Learning Targets' }, value: 'Exceeding Learning Targets' },
            { text: { type: 'plain_text', text: 'On Track / Steady Progress' }, value: 'On Track / Steady Progress' },
            { text: { type: 'plain_text', text: 'Below Expected Progress' }, value: 'Below Expected Progress' },
            { text: { type: 'plain_text', text: 'Significant Learning Gaps' }, value: 'Significant Learning Gaps' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q3_block',
        label: { type: 'plain_text', text: '3. Parent / Midterm Check-in Feedback' },
        element: {
          type: 'static_select',
          action_id: 'q3_input',
          placeholder: { type: 'plain_text', text: 'Select parent feedback' },
          options: [
            { text: { type: 'plain_text', text: 'Overwhelmingly Positive Feedback' }, value: 'Overwhelmingly Positive Feedback' },
            { text: { type: 'plain_text', text: 'Generally Satisfied / Positive' }, value: 'Generally Satisfied / Positive' },
            { text: { type: 'plain_text', text: 'Mixed Feedback / Minor Concerns' }, value: 'Mixed Feedback / Minor Concerns' },
            { text: { type: 'plain_text', text: 'Negative Feedback / Complaints' }, value: 'Negative Feedback / Complaints' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q4_block',
        label: { type: 'plain_text', text: '4. Contribution to Team & Content' },
        element: {
          type: 'static_select',
          action_id: 'q4_input',
          placeholder: { type: 'plain_text', text: 'Select contribution level' },
          options: [
            { text: { type: 'plain_text', text: 'Actively Shares Resources & Supports Peers' }, value: 'Actively Shares Resources & Supports Peers' },
            { text: { type: 'plain_text', text: 'Reliable & Collaborative Team Member' }, value: 'Reliable & Collaborative Team Member' },
            { text: { type: 'plain_text', text: 'Minimal Contribution Beyond Own Classes' }, value: 'Minimal Contribution Beyond Own Classes' },
            { text: { type: 'plain_text', text: 'Isolated / Lacks Collaboration' }, value: 'Isolated / Lacks Collaboration' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q5_block',
        label: { type: 'plain_text', text: '5. Quality & Policy Compliance' },
        element: {
          type: 'static_select',
          action_id: 'q5_input',
          placeholder: { type: 'plain_text', text: 'Select compliance status' },
          options: [
            { text: { type: 'plain_text', text: '100% Compliant with All Policies & SOPs' }, value: '100% Compliant with All Policies & SOPs' },
            { text: { type: 'plain_text', text: 'Consistent Compliance (Minor Reminders)' }, value: 'Consistent Compliance (Minor Reminders)' },
            { text: { type: 'plain_text', text: 'Frequent Policy / Deadline Lapses' }, value: 'Frequent Policy / Deadline Lapses' },
            { text: { type: 'plain_text', text: 'Non-Compliant' }, value: 'Non-Compliant' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q6_block',
        label: { type: 'plain_text', text: '6. Professional Development (CPD) Completed' },
        element: {
          type: 'static_select',
          action_id: 'q6_input',
          placeholder: { type: 'plain_text', text: 'Select CPD status' },
          options: [
            { text: { type: 'plain_text', text: 'Completed All Required + Extra CPD' }, value: 'Completed All Required + Extra CPD' },
            { text: { type: 'plain_text', text: 'Completed All Required CPD on Time' }, value: 'Completed All Required CPD on Time' },
            { text: { type: 'plain_text', text: 'Partially Completed / In Progress' }, value: 'Partially Completed / In Progress' },
            { text: { type: 'plain_text', text: 'Not Completed' }, value: 'Not Completed' }
          ]
        }
      },
      {
        type: 'input',
        block_id: 'q7_block',
        label: { type: 'plain_text', text: '7. Initiative & Ownership' },
        element: {
          type: 'static_select',
          action_id: 'q7_input',
          placeholder: { type: 'plain_text', text: 'Select initiative level' },
          options: [
            { text: { type: 'plain_text', text: 'Proactive Problem-Solver & Self-Starter' }, value: 'Proactive Problem-Solver & Self-Starter' },
            { text: { type: 'plain_text', text: 'Takes Ownership When Assigned' }, value: 'Takes Ownership When Assigned' },
            { text: { type: 'plain_text', text: 'Requires Frequent Follow-up' }, value: 'Requires Frequent Follow-up' },
            { text: { type: 'plain_text', text: 'Passive / Lacks Initiative' }, value: 'Passive / Lacks Initiative' }
          ]
        }
      }
    ];
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

  // Question labels mapped for clean report formatting sent to the employee
  const questionLabels = {
    "14-Day": [
      "Session Attendance %",
      "Punctuality",
      "Reflective Journal Quality",
      "Content Review Participation",
      "Receptiveness to Peer/Mentor Feedback"
    ],
    "60-Day": [
      "Lesson Plan Quality",
      "First Formal Observation Score",
      "Classroom Management",
      "Student Engagement",
      "Marking & Feedback Turnaround",
      "Uptake of 14-Day Action Points",
      "Attendance & Punctuality (Days 15–60)",
      "Disables Chat? (Classroom Control)",
      "Builds on Homework Progress?"
    ],
    "6-Month": [
      "Observation Score Trend (2+ Obs)",
      "Student Progress Data",
      "Parent / Midterm Check-in Feedback",
      "Contribution to Team & Content",
      "Quality & Policy Compliance",
      "Professional Development (CPD) Completed",
      "Initiative & Ownership"
    ]
  };

  let notesParts = [];
  let employeeReportLines = [];
  const labels = questionLabels[reviewType] || [];
  const qCount = labels.length;

  for (let i = 1; i <= qCount; i++) {
    const blockId = `q${i}_block`;
    const actionId = `q${i}_input`;
    if (values[blockId] && values[blockId][actionId] && values[blockId][actionId].selected_option) {
      const answer = values[blockId][actionId].selected_option.value;
      notesParts.push(`Q${i}: ${answer}`);
      employeeReportLines.push(`*${i}. ${labels[i - 1]}:*\n${answer}`);
    }
  }

  const rating = values.rating_block.rating_select.selected_option.value;
  const optionalComments = values.comments_block && values.comments_block.comments_input ? values.comments_block.comments_input.value : '';

  if (optionalComments) {
    notesParts.push(`Comments: ${optionalComments}`);
    employeeReportLines.push(`*Additional Notes:*\n${optionalComments}`);
  }

  const notes = notesParts.join(' | ');

  try {
    // 1. Save to Google Sheet
    await axios.post(APPS_SCRIPT_URL, {
      teacherName,
      milestone: reviewType,
      rating,
      notes,
      reviewerId,
      rowIndex
    });

    // 2. Confirm to Team Lead
    await client.chat.postMessage({
      channel: reviewerId,
      text: `Thank you! The ${reviewType} evaluation for *${teacherName}* has been successfully recorded in the sheet and sent to the teacher.`
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

// Cron Job: Runs every 1 hour (0 * * * *)
cron.schedule('0 */5 * * *', () => {
  checkAndSendReminders();
});

(async () => {
  await app.start();
  console.log('⚡️ Feedback Bot is running successfully with Updated 60-Day Form & Hourly Checks!');
})();