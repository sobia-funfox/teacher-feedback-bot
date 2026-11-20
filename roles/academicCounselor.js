// roles/academicCounselor.js

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

const MILESTONE_FORMS = {
  '14-Day': {
    title: '14-Day Counselor Review',
    subtitle: 'Onboarding & Basics',
    questions: [
      {
        id: 'q1_program_knowledge',
        question: 'Does the employee understand courses, pricing, and student benefits?',
        options: [
          'Clear and accurate',
          'Basic understanding only',
          'Needs more clarity',
        ],
      },
      {
        id: 'q2_tools_setup',
        question: 'Is the employee comfortable with calling, CRM, and booking tools?',
        options: [
          'Uses tools smoothly',
          'Needs minor help',
          'Struggling with tools',
        ],
      },
      {
        id: 'q3_communication_tone',
        question: 'How confident and polite is the employee on calls?',
        options: [
          'Confident and clear',
          'Polite, building confidence',
          'Hesitant or unclear',
        ],
      },
      {
        id: 'q4_attendance',
        question: 'Session Attendance %:',
        options: ATTENDANCE_OPTIONS,
      },
      {
        id: 'q5_punctuality',
        question: 'Punctuality:',
        options: PUNCTUALITY_OPTIONS,
      },
    ],
  },

  '30-Day': {
    title: '30-Day Counselor Review',
    subtitle: 'Calls, Follow-Ups & CRM',
    questions: [
      {
        id: 'q1_needs_pitching',
        question: 'Does the employee match the program to parent needs?',
        options: [
          'Tailors pitch well',
          'Mostly standard pitch',
          'Misses parent needs',
        ],
      },
      {
        id: 'q2_consistent_followups',
        question: 'Does the employee follow up consistently with leads and demos?',
        options: [
          'Always prompt',
          'Occasionally late',
          'Often delayed or missed',
        ],
      },
      {
        id: 'q3_crm_accuracy',
        question: 'Are call notes, statuses, and bookings updated accurately?',
        options: [
          'Accurate and timely',
          'Occasional missing notes',
          'Frequent errors or gaps',
        ],
      },
      {
        id: 'q4_attendance',
        question: 'Session Attendance %:',
        options: ATTENDANCE_OPTIONS,
      },
      {
        id: 'q5_punctuality',
        question: 'Punctuality:',
        options: PUNCTUALITY_OPTIONS,
      },
    ],
  },

  '60-Day': {
    title: '60-Day Counselor Review',
    subtitle: 'Conversions & Teamwork',
    questions: [
      {
        id: 'q1_objection_handling',
        question: 'How well does the employee handle parent doubts and objections?',
        options: [
          'Handles calmly and converts',
          'Needs help on tough doubts',
          'Struggles with objections',
        ],
      },
      {
        id: 'q2_call_review_feedback',
        question: 'Does the employee apply manager feedback on calls?',
        options: [
          'Clear improvement',
          'Gradual improvement',
          'Repeats same mistakes',
        ],
      },
      {
        id: 'q3_team_coordination',
        question: 'How smoothly does the employee coordinate for demos and trials?',
        options: [
          'Smooth and accurate',
          'Good with reminders',
          'Causes delays or confusion',
        ],
      },
      {
        id: 'q4_attendance',
        question: 'Session Attendance %:',
        options: ATTENDANCE_OPTIONS,
      },
      {
        id: 'q5_punctuality',
        question: 'Punctuality:',
        options: PUNCTUALITY_OPTIONS,
      },
    ],
  },

  '90-Day': {
    title: '90-Day Counselor Review',
    subtitle: 'Targets & Role Fit',
    questions: [
      {
        id: 'q1_enrollment_targets',
        question: 'Is the employee meeting expected conversion targets?',
        options: [
          'Meets or exceeds targets',
          'Close to targets',
          'Below expected targets',
        ],
      },
      {
        id: 'q2_pipeline_management',
        question: 'Does the employee manage leads and calls independently?',
        options: [
          'Fully independent',
          'Minor guidance needed',
          'Needs close supervision',
        ],
      },
      {
        id: 'q3_trust_building',
        question: 'Does the employee build trust with parents?',
        options: [
          'Strong parent trust',
          'Polite and standard',
          'Rushed or transactional',
        ],
      },
      {
        id: 'q4_attendance',
        question: 'Session Attendance %:',
        options: ATTENDANCE_OPTIONS,
      },
      {
        id: 'q5_punctuality',
        question: 'Punctuality:',
        options: PUNCTUALITY_OPTIONS,
      },
    ],
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
    throw new Error(`Unsupported Academic Counselor milestone: ${milestone}`);
  }

  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `*Employee:* ${employeeName} (<@${employeeSlackId}>)\n*Role:* Academic Counselor\n*Milestone:* ${milestone} — ${formConfig.subtitle}`,
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
    callback_id: 'academic_counselor_feedback_submit',
    private_metadata: JSON.stringify({
      role: 'Academic Counselor',
      sheetTab: 'AcademicCounselor_Tracking',
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
  roleName: 'Academic Counselor',
  sheetTab: 'AcademicCounselor_Tracking',
  milestones: Object.keys(MILESTONE_FORMS),
  overallRatingOptions: OVERALL_RATING_OPTIONS,
  attendanceOptions: ATTENDANCE_OPTIONS,
  punctualityOptions: PUNCTUALITY_OPTIONS,
  milestoneForms: MILESTONE_FORMS,
  buildFeedbackModal,
  parseFeedbackSubmission,
};