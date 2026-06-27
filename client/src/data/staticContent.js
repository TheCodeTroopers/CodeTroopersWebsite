export const clubInfo = {
  name: 'CODE TROOPERS',
  tagline: 'Learn. Build. Lead.',
  secondaryTagline: 'Transforming Students into Industry-Ready Developers.',
  introduction: 'The Code Troopers Club is a student-driven technical community established to foster innovation, technical excellence, leadership, collaboration, and project-based learning among students. The club serves as a platform where members learn industry-relevant skills, build real-world projects, organize impactful events, and prepare themselves for professional careers in technology and entrepreneurship.',
  vision: 'To build one of the strongest student developer communities that empowers students to become skilled engineers, innovators, founders, and technology leaders.',
  mission: [
    'Promote practical learning beyond academics.',
    'Encourage collaborative software development.',
    'Organize workshops, hackathons, and technical events.',
    'Develop impactful products and solutions.',
    'Create a strong culture of mentorship and leadership.',
    'Build a sustainable learning ecosystem through Workbench.'
  ],
  motto: ['Learn. Build. Lead.', 'Transforming Students into Industry-Ready Developers.'],
  goldenRules: [
    'Learn Continuously.',
    'Build Consistently.',
    'Document Everything.',
    'Respect Deadlines.',
    'Help Your Team.',
    'Own Your Work.',
    'Leave the Club Better Than You Found It.'
  ]
};

export const coreValues = [
  { title: 'Learning', description: 'Continuous improvement through structured learning.', icon: 'learning' },
  { title: 'Ownership', description: 'Members take responsibility for assigned work.', icon: 'ownership' },
  { title: 'Collaboration', description: 'Success is achieved through teamwork.', icon: 'collaboration' },
  { title: 'Innovation', description: 'Encouraging creative problem-solving.', icon: 'innovation' },
  { title: 'Professionalism', description: 'Maintaining discipline and accountability.', icon: 'professionalism' },
  { title: 'Leadership', description: 'Developing future technical leaders.', icon: 'leadership' }
];

export const organizationStructure = [
  {
    id: 'executive-leadership',
    title: 'Executive Leadership',
    type: 'leadership',
    teams: [
      {
        name: 'Club Head',
        role: 'Highest administrative authority',
        objective: 'Lead strategic growth and ensure overall club excellence.',
        responsibilities: [
          'Approve club activities and budgets',
          'Lead strategic planning and appoint team leads',
          'Conduct reviews and resolve operational issues',
          'Represent the club externally',
          'Ensure SOP compliance across all teams',
          'Maintain communication with faculty coordinators'
        ],
        kpis: ['Annual roadmap delivery', 'Semester activity calendar', 'Monthly performance reviews', 'Strategic growth plan execution']
      },
      {
        name: 'Workbench Head',
        role: 'Highest technical authority',
        objective: 'Drive technical excellence and oversee all development initiatives.',
        responsibilities: [
          'Approve technical projects and define standards',
          'Review architectures and oversee development teams',
          'Mentor technical teams and maintain code quality',
          'Organize technical learning initiatives',
          'Review GitHub repositories and manage Workbench roadmap'
        ],
        kpis: ['Technical roadmap delivery', 'Project review completion', 'Technical audit scores', 'Platform development milestones']
      }
    ]
  },
  {
    id: 'events-operations',
    title: 'Events & Operations Team',
    type: 'functional',
    objective: 'Execute all club events professionally.',
    responsibilities: [
      'Event planning and logistics management',
      'Registration handling and volunteer management',
      'Documentation and post-event reporting',
      'Poster creation and promotional activities'
    ],
    kpis: ['Event success rate', 'Documentation quality', 'Attendance growth']
  },
  {
    id: 'learning-platform',
    title: 'Learning & Platform Development Team',
    type: 'functional',
    objective: 'Build structured learning pathways.',
    responsibilities: [
      'Conduct workshops and skill development programs',
      'Create learning roadmaps and resources',
      'Develop educational content and manage assessments',
      'Review workshop syllabi before approval'
    ],
    kpis: ['Workshop attendance', 'Member skill growth', 'Learning completion rate']
  },
  {
    id: 'workbench-team',
    title: 'Workbench Team',
    type: 'functional',
    objective: 'Build and maintain the Workbench ecosystem.',
    responsibilities: [
      'Platform development and UI/UX improvements',
      'Deployment, bug fixing, and feature implementation',
      'Maintain platform stability and user engagement'
    ],
    kpis: ['Release frequency', 'Platform stability', 'User engagement metrics']
  },
  {
    id: 'pd-team-1',
    title: 'Project Development Team 1',
    type: 'project',
    objective: 'Develop real-world products as an independent development unit.',
    responsibilities: [
      'Software development and testing',
      'Documentation, research, and deployment',
      'Sprint planning and milestone delivery'
    ],
    kpis: ['Sprint completion rate', 'GitHub contributions', 'Project milestones achieved']
  },
  {
    id: 'pd-team-2',
    title: 'Project Development Team 2',
    type: 'project',
    objective: 'Develop real-world products as an independent development unit.',
    responsibilities: [
      'Software development and testing',
      'Documentation, research, and deployment',
      'Sprint planning and milestone delivery'
    ],
    kpis: ['Sprint completion rate', 'GitHub contributions', 'Project milestones achieved']
  },
  {
    id: 'pd-team-3',
    title: 'Project Development Team 3',
    type: 'project',
    objective: 'Develop real-world products as an independent development unit.',
    responsibilities: [
      'Software development and testing',
      'Documentation, research, and deployment',
      'Sprint planning and milestone delivery'
    ],
    kpis: ['Sprint completion rate', 'GitHub contributions', 'Project milestones achieved']
  }
];

export const workbenchContent = {
  overview: 'Workbench is Code Troopers\' internal learning ecosystem — a platform where members access structured roadmaps, track skill progress, manage projects, and collaborate on technical initiatives. It serves as the backbone of our sustainable learning culture.',
  technicalRoadmap: {
    title: 'Technical Roadmap',
    phases: [
      { phase: 'Phase 1 — Foundation', items: ['Platform architecture setup', 'User authentication & profiles', 'Basic roadmap viewer', 'GitHub integration'] },
      { phase: 'Phase 2 — Learning Engine', items: ['Structured learning paths', 'Assessment modules', 'Progress tracking dashboard', 'Certificate generation'] },
      { phase: 'Phase 3 — Collaboration', items: ['Project management tools', 'Team workspaces', 'Code review integration', 'Contribution point tracking'] },
      { phase: 'Phase 4 — Scale', items: ['Analytics & reporting', 'Mobile responsiveness', 'API for external integrations', 'Alumni mentorship portal'] }
    ]
  },
  learningRoadmap: {
    title: 'Learning Roadmap',
    tracks: [
      { track: 'Web Development', levels: ['HTML/CSS/JS Basics', 'React & Node.js', 'Full Stack Projects', 'Production Deployment'] },
      { track: 'Competitive Programming', levels: ['Data Structures', 'Algorithms', 'Advanced CP', 'Contest Preparation'] },
      { track: 'Cloud & DevOps', levels: ['Linux & Networking', 'Docker & Kubernetes', 'AWS/GCP Fundamentals', 'CI/CD Pipelines'] },
      { track: 'AI/ML', levels: ['Python & NumPy', 'Machine Learning Basics', 'Deep Learning', 'LLM Applications'] }
    ]
  },
  githubPolicy: {
    title: 'GitHub Policy',
    rules: [
      'All technical teams must use GitHub for version control.',
      'Follow the branch strategy: main → develop → feature/*',
      'Create Pull Requests for all code changes.',
      'Maintain README and documentation in every repository.',
      'Conduct peer reviews before merging.',
      'Direct pushes to the main branch are prohibited.'
    ],
    branchStructure: ['main — Production-ready code', 'develop — Integration branch', 'feature/* — Individual feature branches']
  },
  projectGovernance: {
    title: 'Project Governance',
    proposalRequirements: ['Problem Statement', 'Objective & Scope', 'Team Members', 'Timeline', 'Deliverables'],
    lifecycle: ['Idea Submission', 'Approval', 'Team Formation', 'Development', 'Testing', 'Review', 'Deployment', 'Maintenance']
  },
  contributionPoints: {
    title: 'Contribution Point System',
    activities: [
      { activity: 'Event Participation', points: '+10' },
      { activity: 'Event Organizer', points: '+20' },
      { activity: 'Workshop Speaker', points: '+25' },
      { activity: 'Project Contribution', points: '+10 to +50' },
      { activity: 'Open Source Contribution', points: '+15' },
      { activity: 'Winning Competitions', points: '+30' },
      { activity: 'Mentoring Members', points: '+20' }
    ]
  },
  promotionPolicy: {
    title: 'Promotion Policy',
    criteria: ['Consistency in performance', 'Contribution Points earned', 'Leadership ability demonstrated', 'Technical growth trajectory', 'Positive team feedback'],
    path: ['Contributor', 'Senior Contributor', 'Co-Lead', 'Lead', 'Workbench Head / Club Head']
  },
  communicationPolicy: {
    title: 'Communication Policy',
    platforms: ['WhatsApp', 'Discord', 'GitHub', 'Google Drive', 'Workbench Portal'],
    rule: 'Important decisions must be documented and communicated through official channels only.'
  },
  meetingPolicy: {
    title: 'Meeting Policy',
    meetings: [
      { type: 'Leadership Meeting', frequency: 'Weekly', attendees: 'Club Head, Workbench Head, Team Leads' },
      { type: 'Team Meeting', frequency: 'Weekly', attendees: 'Lead, Co-Lead, Contributors' },
      { type: 'General Body Meeting', frequency: 'Monthly', attendees: 'All Club Members' }
    ]
  }
};

export const eventProtocol = {
  goldenPrinciple: 'If an activity is not documented, it is considered not conducted. Every event, workshop, hackathon, competition, or initiative must leave behind complete documentation for future teams.',
  workshopPhases: [
    { phase: 'Phase 1: Planning', steps: ['Conduct internal planning meeting', 'Finalize topic, duration, target audience', 'Identify faculty coordinator and resource requirements', 'Determine venue preference and expected participants'] },
    { phase: 'Phase 2: Syllabus Preparation', steps: ['Prepare detailed syllabus for multi-day workshops', 'Document day-wise topics, activities, and deliverables', 'Get syllabus reviewed by Learning & Platform Development Team'] },
    { phase: 'Phase 3: Venue Verification', steps: ['Verify venue availability and seating capacity', 'Check projector, internet, and power backup', 'Coordinate with Department HOD, Mr. Deepak Rao, and Faculty Coordinators'] },
    { phase: 'Phase 4: Event Documentation', steps: ['Prepare Event Proposal Document with all mandatory information', 'Include event name, date, venue, description, objectives, schedule, and resources'] },
    { phase: 'Phase 5: Activity Request Approval', steps: ['Prepare Activity Request Form', 'Submit to HOD only through faculty member (Faculty Coordinator or supporting faculty)'] },
    { phase: 'Phase 6: HOD Approval', steps: ['Obtain verbal approval from HOD before any preparations', 'Only after approval: create posters, begin registrations, release announcements'] },
    { phase: 'Phase 7: Poster Approval', steps: ['Get all promotional posters approved by E.O officer', 'Verify date, venue, time, college frame, club logo, and registration link/QR'] },
    { phase: 'Phase 8: Registration', steps: ['Create Google Form with Name, USN, Branch, Semester, Contact, Email', 'Use response-limiting extension for participant cap control'] },
    { phase: 'Phase 9: Attendance', steps: ['Prepare official attendance sheet with college logo', 'Collect participant signatures on hardcopy during event'] },
    { phase: 'Phase 10: Attendance Submission', steps: ['Submit hard copy to Faculty Coordinator at end of each day', 'Share scanned sheets with faculty members for attendance benefits'] },
    { phase: 'Phase 11: Event Documentation', steps: ['Document in official Google Drive with structured folder hierarchy', 'Include proposals, posters, registrations, attendance, PPTs, photos, videos, certificates, feedback'] },
    { phase: 'Phase 12: Certificates', steps: ['Generate certificates using official Code Troopers E-Certificate Generator', 'Store certificate records in event folder'] },
    { phase: 'Phase 13: Post Event', steps: ['Within 48 hours: upload documents, submit report, upload attendance', 'Publish photos, share feedback analysis', 'Publish professional LinkedIn post summarizing the event'] }
  ],
  hackathonPhases: [
    { phase: 'Phase 1: Concept Development', steps: ['Define hackathon type (intra/inter), themes, and duration', 'Determine participation model, team size, and expected registrations'] },
    { phase: 'Phase 2: Proposal Preparation', steps: ['Prepare comprehensive proposal with event overview, budget, and organizational structure', 'Include sponsorship planning, event flow, objectives, and expected outcomes'] },
    { phase: 'Phase 3: Dean Research Approval', steps: ['Submit proposal to Dean Research', 'No promotions, sponsorship, or registrations until approval received'] },
    { phase: 'Phase 4: Promotion & Sponsorship', steps: ['Begin sponsorship outreach and social media campaign', 'Release posters, launch registration, and college outreach'] },
    { phase: 'Phase 5: Event Execution', steps: ['Maintain registration, attendance, mentor allocation records', 'Track judging rubrics, financial records, and resource availability'] },
    { phase: 'Phase 6: Closure Report', steps: ['Within 7 days: prepare closure report with statistics, financial summary, and winner details', 'Archive in official Drive and submit to Dean Research and involved faculty'] }
  ],
  approvalProcess: [
    'Internal planning meeting',
    'Prepare Event Proposal Document',
    'Submit Activity Request Form via Faculty Coordinator',
    'Obtain HOD verbal approval',
    'Poster approval from E.O officer',
    'Begin registration and promotions'
  ],
  venueVerification: [
    'Venue availability confirmed',
    'Seating capacity adequate',
    'Projector availability verified',
    'Internet connectivity tested',
    'Power backup confirmed',
    'HOD / Mr. Deepak Rao / Faculty Coordinators consulted'
  ],
  registration: [
    'Google Form created with required fields',
    'Response-limiting extension configured',
    'Participant cap enforced automatically',
    'Registration link included on approved posters'
  ],
  attendance: [
    'Official attendance sheet prepared with college logo',
    'Participant signatures collected on hardcopy',
    'Hard copy submitted to Faculty Coordinator daily',
    'Scanned copies shared with faculty for attendance benefits'
  ],
  documentation: [
    'Event folder created in Google Drive',
    'Proposal, posters, and registration forms archived',
    'Attendance sheets, PPTs, and resources uploaded',
    'Photos, videos, certificates, and feedback stored'
  ],
  certificates: [
    'Generated via official E-Certificate Generator',
    'Certificate records stored in event folder',
    'Distributed to eligible participants post-verification'
  ],
  closureReport: [
    'Submitted within 48 hours (workshops) or 7 days (hackathons)',
    'Includes participant statistics and feedback analysis',
    'Financial summary and sponsor details (for hackathons)',
    'Verified by Events & Operations Team'
  ]
};

export const stats = [
  { label: 'Active Members', value: '50+' },
  { label: 'Events Conducted', value: '25+' },
  { label: 'Projects Built', value: '15+' },
  { label: 'Workshop Hours', value: '500+' }
];

export const eventTypes = [
  { slug: 'workshops', label: 'Workshops', icon: 'workshop' },
  { slug: 'hackathons', label: 'Hackathons', icon: 'hackathon' },
  { slug: 'competitions', label: 'Competitions', icon: 'competition' },
  { slug: 'technical-talks', label: 'Technical Talks', icon: 'talk' },
  { slug: 'guest-lectures', label: 'Guest Lectures', icon: 'lecture' }
];

export const achievementCategories = [
  { slug: 'hackathon-wins', label: 'Hackathon Wins' },
  { slug: 'projects', label: 'Projects' },
  { slug: 'certifications', label: 'Certifications' },
  { slug: 'community-impact', label: 'Community Impact' },
  { slug: 'awards', label: 'Awards' }
];

export const teamCategories = [
  { slug: 'all', label: 'All Members' },
  { slug: 'club-head', label: 'Club Head' },
  { slug: 'workbench-head', label: 'Workbench Head' },
  { slug: 'faculty-coordinator', label: 'Faculty Coordinators' },
  { slug: 'team-lead', label: 'Team Leads' },
  { slug: 'co-lead', label: 'Co-Leads' },
  { slug: 'member', label: 'Members' }
];
