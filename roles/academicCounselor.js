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

function createMilestoneQuestions(roleSpecificQuestions) {
  return [
    {
      id: 'q1_attendance',
      question: 'Session Attendance %:',
      options: ATTENDANCE_OPTIONS,
    },
    {
      id: 'q2_punctuality',
      question: 'Punctuality:',
      options: PUNCTUALITY_OPTIONS,
    },
    ...roleSpecificQuestions,
  ];
}

const MILESTONE_FORMS = {
  '14-Day': {
    title: '14-Day Counselor Review',
    subtitle: 'Onboarding & Basics',
    questions: createMilestoneQuestions([
      {
        id: 'q3_program_knowledge',
        question: 'Does the employee understand courses, pricing, and student benefits?',
        options: [
          'Clear and accurate',
          'Mostly clear, minor gaps',
          'Basic understanding only',
          'Needs more clarity',
        ],
      },
      {
        id: 'q4_tools_setup',
        question: 'Is the employee comfortable with calling, CRM, and booking tools?',
        options: [
          'Uses tools smoothly',
          'Confident with minor help',
          'Needs regular guidance',
          'Struggling with tools',
        ],
      },
      {
        id: 'q5_communication_tone',
        question: 'How confident and polite is the employee on calls?',
        options: [
          'Confident and clear',
          'Polite and steady',
          'Developing confidence',
          'Hesitant or unclear',
        ],
      },
    ]),
  },

  '30-Day': {
    title: '30-Day Counselor Review',
    subtitle: 'Calls, Follow-Ups & CRM',
    questions: createMilestoneQuestions([
      {
        id: 'q3_needs_pitching',
        question: 'Does the employee match the program to parent needs?',
        options: [
          'Tailors pitch effectively',
          'Mostly matches parent needs',
          'Standard pitch with minor gaps',
          'Misses parent needs',
        ],
      },
      {
        id: 'q4_consistent_followups',
        question: 'Does the employee follow up consistently with leads and demos?',
        options: [
          'Always timely and consistent',
          'Mostly timely follow-ups',
          'Occasionally delayed',
          'Often delayed or missed',
        ],
      },
      {
        id: 'q5_crm_accuracy',
        question: 'Are call notes, statuses, and bookings updated accurately?',
        options: [
          'Accurate and up to date',
          'Mostly accurate',
          'Occasional missing notes',
          'Frequent errors or gaps',
        ],
      },
    ]),
  },

  '60-Day': {
    title: '60-Day Counselor Review',
    subtitle: 'Conversions & Teamwork',
    questions: createMilestoneQuestions([
      {
        id: 'q3_objection_handling',
        question: 'How well does the employee handle parent doubts and objections?',
        options: [
          'Handles calmly and converts',
          'Handles most doubts well',
          'Needs help on tough doubts',
          'Struggles with objections',
        ],
      },
      {
        id: 'q4_call_review_feedback',
        question: 'Does the employee apply manager feedback on calls?',
        options: [
          'Applies feedback consistently',
          'Clear positive improvement',
          'Gradual improvement',
          'Repeats same mistakes',
        ],
      },
      {
        id: 'q5_team_coordination',
        question: 'How smoothly does the employee coordinate for demos and trials?',
        options: [
          'Smooth and accurate',
          'Reliable coordination',
          'Good with reminders',
          'Causes delays or confusion',
        ],
      },
    ]),
  },

  '90-Day': {
    title: '90-Day Counselor Review',
    subtitle: 'Targets & Role Fit',
    questions: createMilestoneQuestions([
      {
        id: 'q3_enrollment_targets',
        question: 'Is the employee meeting expected conversion targets?',
        options: [
          'Meets or exceeds targets',
          'On track toward targets',
          'Close to targets',
          'Below expected targets',
        ],
      },
      {
        id: 'q4_pipeline_management',
        question: 'Does the employee manage leads and calls independently?',
        options: [
          'Fully independent',
          'Independent with light check-ins',
          'Minor guidance needed',
          'Needs close supervision',
        ],
      },
      {
        id: 'q5_trust_building',
        question: 'Does the employee build trust with parents?',
        options: [
          'Builds strong parent trust',
          'Warm and reliable',
          'Polite and standard',
          'Rushed or transactional',
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