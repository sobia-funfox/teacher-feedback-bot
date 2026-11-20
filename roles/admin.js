// roles/admin.js

const OVERALL_RATING_OPTIONS = [
  '5 - Exceeds Expectations',
  '4 - Meets Expectations',
  '3 - Satisfactory',
  '2 - Needs Improvement',
  '1 - Unsatisfactory',
];

const ATTENDANCE_OPTIONS = [
  '95% - 100% (Excellent Attendance)',
  '85% - 94% (Good Attendance)',
  '75% - 84% (Fair Attendance)',
  'Below 75% (Poor Attendance)',
];

const PUNCTUALITY_OPTIONS = [
  'Always Punctual (On Time Every Shift)',
  'Mostly Punctual (1-2 Minor Delays)',
  'Occasionally Late (3-4 Delays)',
  'Frequently Late (5+ Delays)',
];

function createMilestoneQuestions(roleSpecificQuestions) {
  return [
    {
      id: 'q1_attendance',
      question: "1. How consistent is the employee's attendance?",
      options: ATTENDANCE_OPTIONS,
    },
    {
      id: 'q2_punctuality',
      question: '2. How punctual is the employee for shifts, calls, and check-ins?',
      options: PUNCTUALITY_OPTIONS,
    },
    ...roleSpecificQuestions,
  ];
}

const MILESTONE_FORMS = {
  '14-Day': {
    title: '14-Day Admin Review',
    subtitle: 'Foundations',
    questions: createMilestoneQuestions([
      {
        id: 'q3_access_navigation',
        question: '3. How well does the employee navigate Admin/Student Portals, Parent App, Zoom, Slack, and Google Workspace?',
        options: [
          'Navigates platforms and finds info independently',
          'Uses tools well with minor guidance',
          'Needs regular help locating information',
          'Struggles with platform access and navigation',
        ],
      },
      {
        id: 'q4_program_knowledge',
        question: '4. How well does the employee understand clubs, terms, class structures, and High School two-session design?',
        options: [
          'Clear grasp of clubs, terms, and two-session design',
          'Understands most basics with minor questions',
          'Grasps basic overview, needs detail clarity',
          'Unclear on clubs, terms, or session design',
        ],
      },
      {
        id: 'q5_roster_basics',
        question: '5. How accurately does the employee read enrolment lists, weekly schedules, and roster basics?',
        options: [
          'Reads schedules and rosters accurately',
          'Handles roster basics with light checks',
          'Needs help interpreting schedules or lists',
          'Frequent errors with rosters and schedules',
        ],
      },
      {
        id: 'q6_slack_channel_awareness',
        question: '6. How well does the employee use Slack channels for queries, updates, and announcements?',
        options: [
          'Uses right Slack channels and tracks updates',
          'Follows channel norms with minor reminders',
          'Occasionally posts or checks in wrong place',
          'Unsure of Slack channels and announcements',
        ],
      },
      {
        id: 'q7_attitude_adaptability',
        question: '7. How adaptable is the employee with check-ins, tasks, questions, and applying feedback?',
        options: [
          'Applies feedback fast with thoughtful questions',
          'Open to feedback and steady on check-ins',
          'Needs reminders on tasks or applying feedback',
          'Defensive, slow to adapt, or unclear questions',
        ],
      },
      {
        id: 'q8_parent_communication_approach',
        question: '8. How warm, natural, and empathetic is the employee in parent communication?',
        options: [
          'Warm, empathetic, and asks clarifying questions',
          'Polite, supportive, and mostly natural',
          'Developing warmth instead of generic replies',
          'Too robotic, brief, or assumes too much',
        ],
      },
    ]),
  },

  '30-Day': {
    title: '30-Day Admin Review',
    subtitle: 'Guided Independence',
    questions: createMilestoneQuestions([
      {
        id: 'q3_roster_handling',
        question: '3. How accurately and promptly does the employee handle incoming messages, reminders, and roster follow-ups?',
        options: [
          'Accurate, timely, and follows process smoothly',
          'Handles messages and reminders with minor delays',
          'Needs reminders on turnaround or follow-up steps',
          'Frequent gaps in roster messages or reminders',
        ],
      },
      {
        id: 'q4_parent_communication',
        question: '4. How well does the employee tailor parent messages across channels with empathy and clarity?',
        options: [
          'Personalizes tone, channel choice, and guidance well',
          'Uses guidelines well with mostly tailored replies',
          'Relies too heavily on templates or needs tone checks',
          'Unclear wording, wrong channel, or low empathy',
        ],
      },
      {
        id: 'q5_follow_through_task_ownership',
        question: '5. How reliably does the employee follow through on assigned queries and keep parents updated?',
        options: [
          'Owns tasks end-to-end and updates parents proactively',
          'Completes actions on time with light check-ins',
          'Occasionally leaves parents waiting for updates',
          'Drops follow-ups or misses promised timelines',
        ],
      },
      {
        id: 'q6_absentee_follow_ups',
        question: '6. How effectively does the employee make absentee calls, state the purpose clearly, and log outcomes?',
        options: [
          'Clear calls, accurate logging, and timely follow-up',
          'Handles absentee calls well with minor note gaps',
          'Needs guidance on call clarity or outcome notes',
          'Inconsistent absentee calls or missing records',
        ],
      },
      {
        id: 'q7_documentation_hubspot',
        question: "7. How clear, complete, and reliable is the employee's HubSpot and tracker documentation?",
        options: [
          'Clear, complete notes and up-to-date trackers',
          'Records key details well with minor omissions',
          'Needs reminders to log pending actions or updates',
          'Incomplete notes or outdated tracking records',
        ],
      },
      {
        id: 'q8_escalation_judgement',
        question: "8. How sound is the employee's escalation judgement and follow-up on escalated items?",
        options: [
          'Escalates wisely and tracks cases through resolution',
          'Recognizes escalations well with light guidance',
          'Assumes escalated items are done without checking',
          'Poor escalation judgment or drops escalated queries',
        ],
      },
      {
        id: 'q9_task_management',
        question: '9. How well does the employee prioritize tasks and keep pending items on track?',
        options: [
          'Prioritizes smoothly with no overlooked tasks',
          'Manages workload well during normal shifts',
          'Needs help prioritizing when tasks pile up',
          'Frequent overdue or forgotten tasks',
        ],
      },
      {
        id: 'q10_call_performance',
        question: '10. How warm, natural, and reassuring is the employee during parent calls?',
        options: [
          'Warm, attentive, and natural rather than scripted',
          'Polite, clear, and reassuring on most calls',
          'Sounds slightly scripted or misses subtle cues',
          'Rushed, robotic, or unclear on parent calls',
        ],
      },
    ]),
  },

  '60-Day': {
    title: '60-Day Admin Review',
    subtitle: 'End-to-End Ownership',
    questions: createMilestoneQuestions([
      {
        id: 'q3_parent_calls',
        question: '3. How effectively does the employee apply the call 1, 2, and 3 sequence while listening empathetically?',
        options: [
          'Confident call sequence with deep listening',
          'Follows call flow well with empathetic tone',
          'Needs support balancing call steps and listening',
          'Rushed calls or jumps to solutions too early',
        ],
      },
      {
        id: 'q4_program_information_accuracy',
        question: '4. How accurately and confidently does the employee share program, class, schedule, and policy info?',
        options: [
          'Accurate, consistent, and confident guidance',
          'Shares clear details with occasional checks',
          'Needs help on specific policies or schedules',
          'Gives inconsistent or unclear program info',
        ],
      },
      {
        id: 'q5_preparing_parent_feedback',
        question: '5. How well does the employee turn portal feedback into structured, meaningful parent updates?',
        options: [
          'Clear strengths, growth areas, level, and close',
          'Covers key feedback points in a helpful structure',
          'Needs polish on structure or closing parent updates',
          'Generic or incomplete parent feedback updates',
        ],
      },
      {
        id: 'q6_handling_parent_concerns',
        question: '6. How effectively does the employee uncover root concerns and resolve cancellation or switch risks?',
        options: [
          'Spots root issues and resolves concerns calmly',
          'Handles concerns and switches well with guidance',
          'Addresses surface query, needs deeper follow-up',
          'Struggles with cancellations, switches, or struggles',
        ],
      },
      {
        id: 'q7_case_ownership_resolution',
        question: '7. How strongly does the employee own cases through resolution, handovers, and clear next steps?',
        options: [
          'Full ownership, clean handovers, clear closure',
          'Follows through reliably with light reminders',
          'Occasionally needs nudges on pending handovers',
          'Drops cases or closes without clear next steps',
        ],
      },
      {
        id: 'q8_self_critique_improvement',
        question: '8. How well does the employee review their own calls and adjust scripted or generic habits?',
        options: [
          'Strong self-review and noticeable call growth',
          'Applies call review feedback with steady progress',
          'Needs prompts to spot scripted or generic phrasing',
          'Little self-reflection or repeated call habits',
        ],
      },
    ]),
  },

  '90-Day': {
    title: '90-Day Admin Review',
    subtitle: 'Reliability and Role Fit',
    questions: createMilestoneQuestions([
      {
        id: 'q3_consistency_independence',
        question: '3. How consistently and independently does the employee deliver quality work even during busy periods?',
        options: [
          'Highly independent, accurate, and dependable',
          'Consistent output with minimal corrections needed',
          'Needs periodic direction during busy periods',
          'Inconsistent quality or heavy oversight needed',
        ],
      },
      {
        id: 'q4_retention_contribution',
        question: '4. How empathetically and effectively does the employee handle at-risk parents and retention?',
        options: [
          'Empathetic, calm, and focused on real needs',
          'Handles retention well and involves team early',
          'Needs support on complex or sensitive retention',
          'Too transactional or misses retention signals',
        ],
      },
      {
        id: 'q5_teamwork_collaboration',
        question: '5. How smoothly does the employee collaborate and follow through across teams?',
        options: [
          'Seamless handoffs and strong cross-team follow-up',
          'Cooperative and clear across teams most times',
          'Needs reminders to chase cross-team updates',
          'Unclear handoffs or weak cross-team follow-through',
        ],
      },
      {
        id: 'q6_initiative_process_improvement',
        question: '6. How proactively does the employee spot process gaps and suggest practical improvements?',
        options: [
          'Spots gaps early and proposes practical fixes',
          'Takes initiative on familiar workflows and trackers',
          'Offers ideas when prompted, waits on routine',
          'Rarely takes initiative or spots process gaps',
        ],
      },
      {
        id: 'q7_parent_support_accountability',
        question: '7. How deeply accountable is the employee for human, resolved parent support from start to finish?',
        options: [
          'Unwavering accountability and warm human care',
          'Proactive follow-ups and dependable resolution',
          'Treats replies as done before full resolution',
          'Leaves concerns pending or unfollowed-up',
        ],
      },
    ]),
  },
};

function buildSelectOption(text, value = text) {
  return {
    text: {
      type: 'plain_text',
      text: text.slice(0, 75),
    },
    value: String(value).slice(0, 75),
  };
}

function buildFeedbackModal({ milestone, employeeName, employeeSlackId, rowNumber }) {
  const formConfig = MILESTONE_FORMS[milestone];
  if (!formConfig) {
    throw new Error(`Unsupported Admin milestone: ${milestone}`);
  }

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Employee:* ${employeeName} (<@${employeeSlackId}>)\n*Role:* Admin\n*Milestone:* ${milestone} — ${formConfig.subtitle}`,
      },
    },
    { type: 'divider' },
  ];

  for (const q of formConfig.questions) {
    blocks.push({
      type: 'input',
      block_id: q.id,
      label: {
        type: 'plain_text',
        text: q.question.slice(0, 2000),
      },
      element: {
        type: 'static_select',
        action_id: 'answer',
        placeholder: {
          type: 'plain_text',
          text: 'Select an option',
        },
        options: q.options.map((opt) => buildSelectOption(opt)),
      },
    });
  }

  blocks.push(
    { type: 'divider' },
    {
      type: 'input',
      block_id: 'overall_performance_rating',
      label: {
        type: 'plain_text',
        text: 'Overall Performance Rating',
      },
      element: {
        type: 'static_select',
        action_id: 'answer',
        placeholder: {
          type: 'plain_text',
          text: 'Select overall performance rating',
        },
        options: OVERALL_RATING_OPTIONS.map((rating) => buildSelectOption(rating)),
      },
    },
    {
      type: 'input',
      block_id: 'additional_notes',
      optional: true,
      label: {
        type: 'plain_text',
        text: 'Additional Notes',
      },
      element: {
        type: 'plain_text_input',
        action_id: 'answer',
        multiline: true,
        placeholder: {
          type: 'plain_text',
          text: 'Add any additional notes (optional)...',
        },
      },
    }
  );

  return {
    type: 'modal',
    callback_id: 'admin_feedback_submit',
    private_metadata: JSON.stringify({
      role: 'Admin',
      sheetTab: 'Admin_Tracking',
      milestone,
      employeeName,
      employeeSlackId,
      rowNumber,
    }),
    title: {
      type: 'plain_text',
      text: formConfig.title.slice(0, 24),
    },
    submit: {
      type: 'plain_text',
      text: 'Submit',
    },
    close: {
      type: 'plain_text',
      text: 'Cancel',
    },
    blocks,
  };
}

function parseFeedbackSubmission(viewStateValues, milestone) {
  const formConfig = MILESTONE_FORMS[milestone];
  const answers = {};

  for (const q of formConfig.questions) {
    answers[q.id] = viewStateValues[q.id]?.answer?.selected_option?.value || '';
  }

  answers.overall_performance_rating =
    viewStateValues.overall_performance_rating?.answer?.selected_option?.value || '';
  answers.additional_notes = viewStateValues.additional_notes?.answer?.value?.trim() || '';

  return answers;
}

module.exports = {
  roleName: 'Admin',
  sheetTab: 'Admin_Tracking',
  milestones: Object.keys(MILESTONE_FORMS),
  overallRatingOptions: OVERALL_RATING_OPTIONS,
  attendanceOptions: ATTENDANCE_OPTIONS,
  punctualityOptions: PUNCTUALITY_OPTIONS,
  milestoneForms: MILESTONE_FORMS,
  buildFeedbackModal,
  parseFeedbackSubmission,
};