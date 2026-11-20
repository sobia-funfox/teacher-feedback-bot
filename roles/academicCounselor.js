// roles/academicCounselor.js

const OVERALL_RATING_OPTIONS = [
  'Exceeds Expectations',
  'Meets Expectations',
  'Needs Improvement',
  'Below Expectations',
];

const MILESTONE_FORMS = {
  '14-Day': {
    title: '14-Day Academic Counselor Feedback',
    subtitle: 'Onboarding & Product Knowledge',
    questions: [
      {
        id: 'q1_program_knowledge',
        label: 'Q1: Program & Curriculum Knowledge',
        question:
          'How clearly does the employee understand FunFox’s courses, class structure, pricing, and how our program helps 9-year-old students?',
        options: [
          'Explains our courses, pricing, and benefits clearly and accurately.',
          'Understands the basics, still needs help answering detailed parent questions.',
          'Not clear about our program details or pricing yet.',
        ],
      },
      {
        id: 'q2_tools_setup',
        label: 'Q2: CRM, Calling & Booking Tools Setup',
        question:
          'Is the employee comfortable using our calling system, CRM software, WhatsApp/email templates, and demo booking calendar?',
        options: [
          'Uses all calling, CRM, and booking tools smoothly.',
          'Mostly comfortable, needs minor help with CRM or calendar steps.',
          'Having trouble using basic calling or booking tools.',
        ],
      },
      {
        id: 'q3_communication_tone',
        label: 'Q3: Communication Tone & Confidence',
        question:
          'How polite, confident, and clear is the employee during practice calls or initial parent inquiries?',
        options: [
          'Sounds warm, confident, and very clear while talking to parents.',
          'Polite and friendly, though still building confidence on calls.',
          'Sounds hesitant, nervous, or unclear during parent interactions.',
        ],
      },
      {
        id: 'q4_attendance_punctuality',
        label: 'Q4: Attendance & Punctuality',
        question:
          'Does the employee join daily check-ins on time and stay available during their scheduled shift hours?',
        options: [
          'Always on time and available throughout shift hours.',
          'Usually on time, with only rare, minor delays.',
          'Often late to meetings or misses scheduled shift hours.',
        ],
      },
    ],
  },

  '30-Day': {
    title: '30-Day Academic Counselor Feedback',
    subtitle: 'Parent Calls, Follow-ups & CRM',
    questions: [
      {
        id: 'q1_needs_pitching',
        label: 'Q1: Understanding Parent Needs & Pitching',
        question:
          'How well does the employee listen to parents’ concerns about their child’s English skills and recommend the right FunFox program?',
        options: [
          'Listens carefully and connects our program directly to the child’s needs.',
          'Gives a standard explanation, sometimes misses specific parent concerns.',
          'Struggles to understand parent needs or explain how we can help.',
        ],
      },
      {
        id: 'q2_consistent_followups',
        label: 'Q2: Consistent Follow-Ups',
        question:
          'Does the employee follow up on time with parents who showed interest, missed a call, or attended a demo class?',
        options: [
          'Follows up promptly and consistently with every lead.',
          'Does regular follow-ups, occasionally misses a timely reminder.',
          'Slow to follow up or lets warm leads go cold.',
        ],
      },
      {
        id: 'q3_crm_accuracy',
        label: 'Q3: CRM Logging & Lead Accuracy',
        question:
          'Does the employee update call notes, lead statuses, and demo bookings accurately in the CRM after every call?',
        options: [
          'Updates all call notes and lead details accurately right after calls.',
          'Updates the CRM regularly, with occasional missing notes.',
          'Frequently forgets to update lead statuses or enters wrong details.',
        ],
      },
      {
        id: 'q4_attendance_discipline',
        label: 'Q4: Attendance & Shift Discipline',
        question:
          'How reliable is the employee in their daily attendance and quick responsiveness during peak parent calling hours?',
        options: [
          'Very regular attendance and active throughout peak calling hours.',
          'Mostly regular, with rare unplanned leaves or slow responses.',
          'Irregular attendance or unavailable during key calling hours.',
        ],
      },
    ],
  },

  '60-Day': {
    title: '60-Day Academic Counselor Feedback',
    subtitle: 'Conversions, Objections & Teamwork',
    questions: [
      {
        id: 'q1_objection_handling',
        label: 'Q1: Handling Parent Doubts & Objections',
        question:
          'How effectively does the employee handle common parent hesitations (such as fees, class timings, or online learning doubts)?',
        options: [
          'Handles parent doubts calmly and turns hesitations into enrollments.',
          'Answers basic questions well, needs help with tough objections.',
          'Struggles to convince hesitant parents or loses interest quickly.',
        ],
      },
      {
        id: 'q2_call_review_feedback',
        label: 'Q2: Applying Call Review Feedback',
        question:
          'Has the employee improved their call pitch and counseling style based on previous manager feedback?',
        options: [
          'Clearly improved their calls and actively applies manager tips.',
          'Shows gradual improvement, occasionally falls back into old habits.',
          'Repeats the same mistakes on calls despite feedback.',
        ],
      },
      {
        id: 'q3_team_coordination',
        label: 'Q3: Coordination with Teachers & Operations',
        question:
          'How smoothly does the employee coordinate with the academic/operations team regarding demo schedules, trial feedback, and student onboarding?',
        options: [
          'Coordinates smoothly and shares accurate student details for demos.',
          'Cooperates well during routine bookings when reminded.',
          'Causes booking confusion or delays in sharing student info.',
        ],
      },
      {
        id: 'q4_punctuality_deadlines',
        label: 'Q4: Punctuality & Meeting Deadlines',
        question:
          'Does the employee maintain strict punctuality for meetings and submit daily call/enrollment reports on time?',
        options: [
          'Always punctual and submits all daily reports on time.',
          'Usually punctual, with rare delays in end-of-day reporting.',
          'Frequent punctuality issues or late daily reports.',
        ],
      },
    ],
  },

  '90-Day': {
    title: '90-Day Academic Counselor Feedback',
    subtitle: 'Targets, Ownership & Long-Term Fit',
    questions: [
      {
        id: 'q1_enrollment_targets',
        label: 'Q1: Meeting Enrollment & Demo Targets',
        question:
          'Is the employee consistently converting leads into demo classes and paid enrollments at the expected pace?',
        options: [
          'Consistently meets or exceeds demo and enrollment targets.',
          'Close to meeting targets, showing steady monthly progress.',
          'Consistently falling short of expected conversion targets.',
        ],
      },
      {
        id: 'q2_pipeline_management',
        label: 'Q2: Independent Pipeline Management',
        question:
          'Can the employee manage their daily calling schedule, prioritize hot leads, and close enrollments independently without constant reminders?',
        options: [
          'Manages their entire lead pipeline independently and effectively.',
          'Handles daily calling well, needs minor guidance on prioritizing leads.',
          'Still needs constant supervision to manage leads and daily calls.',
        ],
      },
      {
        id: 'q3_trust_building',
        label: 'Q3: Parent Relationship & Trust Building',
        question:
          'Does the employee build genuine trust with parents so that enrolled families feel confident and supported joining FunFox?',
        options: [
          'Builds strong trust and leaves a great impression on parents.',
          'Polite and professional, maintains good standard communication.',
          'Interactions feel rushed or overly transactional.',
        ],
      },
      {
        id: 'q4_overall_fit',
        label: 'Q4: Overall Discipline & Long-Term Fit',
        question:
          'Looking at their attendance, punctuality, counseling skills, and target achievement, is the employee ready for a permanent role?',
        options: [
          'Fully ready, dependable, and a strong asset to the admissions team.',
          'Performing adequately, needs minor ongoing coaching.',
          'Not yet meeting the performance or discipline standards required.',
        ],
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
        text: `${q.label} — ${q.question}`.slice(0, 2000),
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
          text: 'Add any context, call examples, or action items for the employee...',
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
  milestoneForms: MILESTONE_FORMS,
  buildFeedbackModal,
  parseFeedbackSubmission,
};