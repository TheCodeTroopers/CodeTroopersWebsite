export const clubInfo = {
  name: 'CODE TROOPERS',
  tagline: 'Learn. Build. Lead.',
  secondaryTagline: 'Transforming Students into Industry-Ready Developers.',
  establishedYear: '2020',
  functionalYear: '2022',
  restructuredYear: '2024',
  introduction: 'Established in 2020 and fully functional since 2022, Code Troopers is a student-driven technical community that underwent a major organizational restructuring in 2024. The club fosters innovation, technical excellence, leadership, collaboration, and project-based learning, serving as a platform where members learn industry-relevant skills, build real-world projects, organize impactful events, and prepare themselves for professional careers in technology and entrepreneurship.',
  history: [
    {
      year: '2020',
      tag: 'Inception',
      title: 'Club Established',
      description: 'Founded with a bold vision to bridge the gap between academic theory and real-world software engineering through a peer-driven community.'
    },
    {
      year: '2022',
      tag: 'Launch',
      title: 'Fully Functional Operations',
      description: 'Scaled active operations across campus, launching structured bootcamps, workshops, hackathon delegations, and hands-on project sprints.'
    },
    {
      year: '2024',
      tag: 'Evolution',
      title: 'Strategic Restructuring',
      description: 'Underwent an organizational overhaul—formalizing leadership hierarchies, SOPs, specialized event tracks, and the flagship Workbench technical wing.'
    }
  ],
  vision: 'To build one of the strongest student developer communities that empowers students to become skilled engineers, innovators, founders and technology leaders.',
  mission: [
    'Promote practical learning beyond academics.',
    'Encourage collaborative software development.',
    'Organize workshops, hackathons and technical events.',
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
      'Deployment, bug fixing and feature implementation',
      'Maintain platform stability and user engagement'
    ],
    kpis: ['Release frequency', 'Platform stability', 'User engagement metrics']
  },
  {
    id: 'pd-team-1',
    title: 'Project Development Team 1',
    name: 'Project Team 1 — Ayurvedic Diagnostic System',
    type: 'project',
    objective: 'Develop an intelligent system that collects patient responses through a questionnaire and generates a preliminary diagnostic report, helping doctors with faster and more structured analysis.',
    responsibilities: [
      'Software development and testing',
      'Documentation, research and deployment',
      'Sprint planning and milestone delivery'
    ],
    kpis: ['Sprint completion rate', 'GitHub contributions', 'Project milestones achieved']
  },
  {
    id: 'pd-team-2',
    title: 'Project Development Team 2',
    name: 'Project Team 2 — Smart Canteen System',
    type: 'project',
    objective: 'Refine and enhance the existing Smart Canteen system to create a seamless, digital-first canteen experience that improves efficiency for both users and management.',
    responsibilities: [
      'Software development and testing',
      'Documentation, research and deployment',
      'Sprint planning and milestone delivery'
    ],
    kpis: ['Sprint completion rate', 'GitHub contributions', 'Project milestones achieved']
  },
  {
    id: 'pd-team-3',
    title: 'Project Development Team 3',
    name: 'Project Team 3 — Code Troopers Official Website',
    type: 'project',
    objective: 'Design and develop a responsive, user-friendly website that highlights achievements, team members and essential information, while ensuring smooth navigation and a professional look.',
    responsibilities: [
      'Software development and testing',
      'Documentation, research and deployment',
      'Sprint planning and milestone delivery'
    ],
    kpis: ['Sprint completion rate', 'GitHub contributions', 'Project milestones achieved']
  }
];

export const workbenchContent = {
  overview: 'Workbench is Code Troopers\' internal learning ecosystem — a platform where members access structured roadmaps, track skill progress, manage projects and collaborate on technical initiatives. It serves as the backbone of our sustainable learning culture.',
  tagline: 'Build. Collaborate. Ship.',
  howItWorks: {
    title: 'How It Works',
    subtitle: 'A structured 6-step path taking members from foundational skills to shipping production software.',
    steps: [
      { step: 1, title: 'Choose Track', desc: 'Select a domain matching your goals: Full Stack, DSA, Cloud/DevOps, or AI/ML.' },
      { step: 2, title: 'Learn & Practice', desc: 'Work through hands-on resources, practical tasks and domain benchmarks.' },
      { step: 3, title: 'Build', desc: 'Apply skills by engineering features for active client and college projects.' },
      { step: 4, title: 'Code Review', desc: 'Submit Pull Requests for peer and lead code reviews to ensure production quality.' },
      { step: 5, title: 'Contribute', desc: 'Earn contribution points by shipping code, resolving issues and helping teammates.' },
      { step: 6, title: 'Grow', desc: 'Unlock senior contributor roles, team lead opportunities and industry endorsements.' }
    ]
  },
  learningTracks: {
    title: 'Learning Tracks',
    subtitle: 'Specialized domain roadmaps designed for step-by-step technical progression.',
    tracks: [
      { track: 'Full Stack', levels: ['HTML/CSS/JS Basics', 'React & Node.js', 'Full Stack Projects', 'Production Deployment'] },
      { track: 'DSA', levels: ['Data Structures', 'Algorithms', 'Advanced CP', 'Contest Preparation'] },
      { track: 'Cloud/DevOps', levels: ['Linux & Networking', 'Docker & Kubernetes', 'AWS/GCP Fundamentals', 'CI/CD Pipelines'] },
      { track: 'AI/ML', levels: ['Python & NumPy', 'Machine Learning Basics', 'Deep Learning', 'LLM Applications'] }
    ]
  },
  workingProjects: {
    title: 'Build with CodeTroopers',
    subtitle: 'Official project teams and member-driven software initiatives.',
    teams: [
      {
        id: 'team-1',
        teamName: 'Project Team 1',
        title: 'Ayurvedic Diagnostic System',
        badge: 'SDM College Project',
        objective: 'Develop an intelligent system that collects patient responses through a questionnaire and generates a preliminary diagnostic report, helping doctors with faster and more structured analysis.'
      },
      {
        id: 'team-2',
        teamName: 'Project Team 2',
        title: 'Smart Canteen System',
        badge: 'Karmic Solutions – Stipend Project',
        objective: 'Refine and enhance the existing Smart Canteen system to create a seamless, digital-first canteen experience that improves efficiency for both users and management.'
      },
      {
        id: 'team-3',
        teamName: 'Project Team 3',
        title: 'Code Troopers Official Website',
        badge: 'Official Website',
        objective: 'Design and develop a responsive, user-friendly website that highlights achievements, team members and essential information, while ensuring smooth navigation and a professional look.'
      }
    ],
    memberProjects: {
      title: 'Other Member Initiatives',
      subtitle: 'Projects developed collaboratively by members of the club.',
      projects: [
        {
          id: 'aasare',
          title: 'AASARE Counselling Cell Management Portal',
          badge: 'SWO Joint Project (Ignite × CodeTroopers × Aikya)',
          objective: 'The AASARE Counselling Cell Management Portal is a secure web-based platform designed to manage counselling appointments and provide counsellors with a private, isolated case-study management system.'
        },
        {
          id: 'city-surveillance',
          title: 'City Surveillance Cell',
          badge: 'Member Initiative',
          objective: 'An intelligent monitoring and surveillance management platform built by club members to streamline campus and city security operations.'
        }
      ]
    }
  },
  howToJoin: {
    title: 'How to Join',
    subtitle: 'Your step-by-step onboarding journey to becoming an active contributor.',
    steps: [
      { step: 1, title: 'Join', desc: 'Become an official member of the Code Troopers developer community.' },
      { step: 2, title: 'Choose Track', desc: 'Select your track: Full Stack, DSA, Cloud/DevOps, or AI/ML.' },
      { step: 3, title: 'Onboarding Task', desc: 'Complete a practical track assessment to prove foundational readiness.' },
      { step: 4, title: 'Join Project', desc: 'Get assigned to Project Team 1, 2, or 3 based on your skills.' },
      { step: 5, title: 'Start Building', desc: 'Collaborate with team leads, write code, submit PRs and ship features.' }
    ]
  }
};

export const eventProtocol = {
  goldenPrinciple: 'If an activity is not documented, it is considered not conducted. Every event, workshop, hackathon, competition, or initiative must leave behind complete documentation for future teams.',
  workshopPhases: [
    { phase: 'Phase 1: Planning', steps: ['Conduct internal planning meeting', 'Finalize topic, duration, target audience', 'Identify faculty coordinator and resource requirements', 'Determine venue preference and expected participants'] },
    { phase: 'Phase 2: Syllabus Preparation', steps: ['Prepare detailed syllabus for multi-day workshops', 'Document day-wise topics, activities and deliverables', 'Get syllabus reviewed by Learning & Platform Development Team'] },
    { phase: 'Phase 3: Venue Verification', steps: ['Verify venue availability and seating capacity', 'Check projector, internet and power backup', 'Coordinate with Department HOD, Mr. Deepak Rao and Faculty Coordinators'] },
    { phase: 'Phase 4: Event Documentation', steps: ['Prepare Event Proposal Document with all mandatory information', 'Include event name, date, venue, description, objectives, schedule and resources'] },
    { phase: 'Phase 5: Activity Request Approval', steps: ['Prepare Activity Request Form', 'Submit to HOD only through faculty member (Faculty Coordinator or supporting faculty)'] },
    { phase: 'Phase 6: HOD Approval', steps: ['Obtain verbal approval from HOD before any preparations', 'Only after approval: create posters, begin registrations, release announcements'] },
    { phase: 'Phase 7: Poster Approval', steps: ['Get all promotional posters approved by E.O officer', 'Verify date, venue, time, college frame, club logo and registration link/QR'] },
    { phase: 'Phase 8: Registration', steps: ['Create Google Form with Name, USN, Branch, Semester, Contact, Email', 'Use response-limiting extension for participant cap control'] },
    { phase: 'Phase 9: Attendance', steps: ['Prepare official attendance sheet with college logo', 'Collect participant signatures on hardcopy during event'] },
    { phase: 'Phase 10: Attendance Submission', steps: ['Submit hard copy to Faculty Coordinator at end of each day', 'Share scanned sheets with faculty members for attendance benefits'] },
    { phase: 'Phase 11: Event Documentation', steps: ['Document in official Google Drive with structured folder hierarchy', 'Include proposals, posters, registrations, attendance, PPTs, photos, videos, certificates, feedback'] },
    { phase: 'Phase 12: Certificates', steps: ['Generate certificates using official Code Troopers E-Certificate Generator', 'Store certificate records in event folder'] },
    { phase: 'Phase 13: Post Event', steps: ['Within 48 hours: upload documents, submit report, upload attendance', 'Publish photos, share feedback analysis', 'Publish professional LinkedIn post summarizing the event'] }
  ],
  hackathonPhases: [
    { phase: 'Phase 1: Concept Development', steps: ['Define hackathon type (intra/inter), themes and duration', 'Determine participation model, team size and expected registrations'] },
    { phase: 'Phase 2: Proposal Preparation', steps: ['Prepare comprehensive proposal with event overview, budget and organizational structure', 'Include sponsorship planning, event flow, objectives and expected outcomes'] },
    { phase: 'Phase 3: Dean Research Approval', steps: ['Submit proposal to Dean Research', 'No promotions, sponsorship, or registrations until approval received'] },
    { phase: 'Phase 4: Promotion & Sponsorship', steps: ['Begin sponsorship outreach and social media campaign', 'Release posters, launch registration and college outreach'] },
    { phase: 'Phase 5: Event Execution', steps: ['Maintain registration, attendance, mentor allocation records', 'Track judging rubrics, financial records and resource availability'] },
    { phase: 'Phase 6: Closure Report', steps: ['Within 7 days: prepare closure report with statistics, financial summary and winner details', 'Archive in official Drive and submit to Dean Research and involved faculty'] }
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
    'Proposal, posters and registration forms archived',
    'Attendance sheets, PPTs and resources uploaded',
    'Photos, videos, certificates and feedback stored'
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
  { label: 'Active Members', value: '36+' },
  { label: 'Events Conducted', value: '6+' },
  { label: 'Projects Built', value: '5+' },
  { label: 'Workshop Hours', value: '32+' }
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
