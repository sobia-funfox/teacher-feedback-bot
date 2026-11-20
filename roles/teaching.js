// roles/teaching.js

module.exports = {
  roleName: 'Teaching',
  sheetTab: 'Teachers_Tracking',
  milestones: {
    '14-Day': {
      focus: 'Orientation and engagement (observing primary teachers)',
      questions: [
        {
          label: '1. Session Attendance %',
          placeholder: 'Select attendance %',
          options: [
            '95% - 100% (Full / Near-Full Attendance)',
            '85% - 94% (Good Attendance)',
            '75% - 84% (Below Target)',
            'Below 75% (Critical / Unsatisfactory)'
          ]
        },
        {
          label: '2. Punctuality',
          placeholder: 'Select punctuality level',
          options: [
            'Always on Time (100% Punctual)',
            'Mostly Punctual (1-2 Minor Delays)',
            'Frequently Late (Needs Improvement)',
            'Consistently Late (Unsatisfactory)'
          ]
        },
        {
          label: '3. Reflective Journal Quality',
          placeholder: 'Select journal quality',
          options: [
            'Detailed, Insightful & Submitted on Time',
            'Good Quality & Complete',
            'Superficial / Incomplete Entries',
            'Missing or Not Submitted'
          ]
        },
        {
          label: '4. Content Review Participation',
          placeholder: 'Select participation level',
          options: [
            'Highly Active & Engaged in Discussions',
            'Regular & Constructive Participation',
            'Passive / Minimal Engagement',
            'Absent or Non-Participatory'
          ]
        },
        {
          label: '5. Receptiveness to Peer/Mentor Feedback',
          placeholder: 'Select receptiveness level',
          options: [
            'Highly Receptive & Quickly Applies Feedback',
            'Open & Receptive to Suggestions',
            'Somewhat Defensive / Slow to Apply',
            'Resistant to Feedback'
          ]
        }
      ]
    },
    '60-Day': {
      focus: 'Early classroom practice',
      questions: [
        {
          label: '1. Lesson Plan Quality',
          placeholder: 'Select quality level',
          options: [
            'Well-Structured, Detailed & Aligned',
            'Good & Meets Standards',
            'Basic / Needs Better Preparation',
            'Incomplete or Poorly Planned'
          ]
        },
        {
          label: '2. First Formal Observation Score',
          placeholder: 'Select observation outcome',
          options: [
            'Exceeds Expectations (90% - 100%)',
            'Meets Expectations (75% - 89%)',
            'Developing / Needs Improvement (60% - 74%)',
            'Unsatisfactory (Below 60%)'
          ]
        },
        {
          label: '3. Classroom Management',
          placeholder: 'Select management level',
          options: [
            'Strong Control & Positive Environment',
            'Effective Management with Minor Gaps',
            'Struggles with Pacing / Behavior',
            'Poor Classroom Control'
          ]
        },
        {
          label: '4. Student Engagement',
          placeholder: 'Select engagement level',
          options: [
            'High Participation & Active Learning',
            'Good Engagement Across Most Students',
            'Low / Uneven Student Participation',
            'Students Disengaged'
          ]
        },
        {
          label: '5. Marking & Feedback Turnaround',
          placeholder: 'Select turnaround speed',
          options: [
            'Always On Time with Constructive Feedback',
            'Mostly On Time',
            'Frequently Delayed',
            'Incomplete or Missing Feedback'
          ]
        },
        {
          label: '6. Uptake of 14-Day Action Points',
          placeholder: 'Select progress level',
          options: [
            'Fully Implemented All Action Points',
            'Good Progress on Most Points',
            'Partial / Slow Implementation',
            'No Visible Improvement'
          ]
        },
        {
          label: '7. Attendance & Punctuality (Days 15–60)',
          placeholder: 'Select attendance status',
          options: [
            '95% - 100% (Excellent)',
            '85% - 94% (Good)',
            '75% - 84% (Needs Improvement)',
            'Below 75% (Unsatisfactory)'
          ]
        },
        {
          label: '8. Disables Chat? (Classroom Control)',
          placeholder: 'Select chat management status',
          options: [
            'Yes, Consistently Disables Chat When Needed',
            'Mostly Disables Chat (Occasional Reminders)',
            'Rarely Disables Chat (Causes Distractions)',
            'No, Does Not Manage Chat Settings'
          ]
        },
        {
          label: '9. Builds on Homework Progress?',
          placeholder: 'Select homework follow-up level',
          options: [
            'Consistently Reviews & Integrates Homework',
            'Regularly Checks & Builds on Homework',
            'Occasionally References Homework',
            'Does Not Review or Build on Homework'
          ]
        }
      ]
    },
    '6-Month': {
      focus: 'Sustained impact and fit',
      questions: [
        {
          label: '1. Observation Score Trend (2+ Obs)',
          placeholder: 'Select score trend',
          options: [
            'Consistent Upward Trend / High Scores',
            'Stable & Meets Standards',
            'Inconsistent / Fluctuating Scores',
            'Declining Performance Trend'
          ]
        },
        {
          label: '2. Student Progress Data',
          placeholder: 'Select progress outcome',
          options: [
            'Exceeding Learning Targets',
            'On Track / Steady Progress',
            'Below Expected Progress',
            'Significant Learning Gaps'
          ]
        },
        {
          label: '3. Parent / Midterm Check-in Feedback',
          placeholder: 'Select parent feedback',
          options: [
            'Overwhelmingly Positive Feedback',
            'Generally Satisfied / Positive',
            'Mixed Feedback / Minor Concerns',
            'Negative Feedback / Complaints'
          ]
        },
        {
          label: '4. Contribution to Team & Content',
          placeholder: 'Select contribution level',
          options: [
            'Actively Shares Resources & Supports Peers',
            'Reliable & Collaborative Team Member',
            'Minimal Contribution Beyond Own Classes',
            'Isolated / Lacks Collaboration'
          ]
        },
        {
          label: '5. Quality & Policy Compliance',
          placeholder: 'Select compliance status',
          options: [
            '100% Compliant with All Policies & SOPs',
            'Consistent Compliance (Minor Reminders)',
            'Frequent Policy / Deadline Lapses',
            'Non-Compliant'
          ]
        },
        {
          label: '6. Professional Development (CPD) Completed',
          placeholder: 'Select CPD status',
          options: [
            'Completed All Required + Extra CPD',
            'Completed All Required CPD on Time',
            'Partially Completed / In Progress',
            'Not Completed'
          ]
        },
        {
          label: '7. Initiative & Ownership',
          placeholder: 'Select initiative level',
          options: [
            'Proactive Problem-Solver & Self-Starter',
            'Takes Ownership When Assigned',
            'Requires Frequent Follow-up',
            'Passive / Lacks Initiative'
          ]
        }
      ]
    }
  }
};