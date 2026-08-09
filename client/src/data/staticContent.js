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
  overview: 'Workbench is Code Troopers\' internal learning ecosystem — a platform where members access structured roadmaps, track skill progress, manage real-world projects, and receive peer mentorship. It serves as the backbone of our sustainable learning culture.',
  whatIsWorkbench: {
    title: 'What is Workbench?',
    subtitle: 'The Core Platform for Student Developers',
    description: 'Workbench is designed to bridge the gap between academic theory and practical software engineering. Through structured tracks, collaborative project teams, and expert peer mentorship, members build production-ready applications, master modern tech stacks, and prepare for high-impact careers in technology.',
    features: [
      {
        title: 'Structured Progression',
        description: 'Step-by-step learning tracks tailored to take members from fundamental concepts to advanced architecture.'
      },
      {
        title: 'Hands-on Building',
        description: 'Shift focus from passive tutorial consumption to active building of real-world products.'
      },
      {
        title: 'Mentorship Ecosystem',
        description: 'Direct guidance from senior student leads, alumni, and industry professionals.'
      }
    ]
  },
  learningRoadmap: {
    title: 'Learning Tracks',
    subtitle: 'Choose your path and master industry-relevant skills',
    tracks: [
      {
        track: 'Full-Stack Web Development',
        description: 'Master modern frontend & backend technologies to build scalable web applications.',
        levels: ['HTML/CSS/JS & Web Fundamentals', 'React, Next.js & UI Engineering', 'Node.js, Express & Database Design', 'Production Deployment & DevOps']
      },
      {
        track: 'Competitive Programming & DSA',
        description: 'Strengthen problem-solving abilities, algorithmic thinking, and coding interview skills.',
        levels: ['Basic Data Structures & C++', 'Algorithms & Time Complexity', 'Advanced Graph & Dynamic Programming', 'Contest Strategies & Mock Interviews']
      },
      {
        track: 'Cloud & DevOps Engineering',
        description: 'Learn infrastructure, containerization, CI/CD pipelines, and cloud services.',
        levels: ['Linux CLI & Shell Scripting', 'Docker Containerization & Networking', 'Cloud Architecture (AWS/GCP)', 'CI/CD Pipelines & Kubernetes']
      },
      {
        track: 'AI & Machine Learning',
        description: 'Explore data science, machine learning models, and cutting-edge AI integrations.',
        levels: ['Python, NumPy & Data Analysis', 'Machine Learning Algorithms', 'Deep Learning & Neural Networks', 'LLM Integration & AI Applications']
      }
    ]
  },
  projectBasedLearning: {
    title: 'Project Based Learning',
    subtitle: 'Learn by creating real software used by real people',
    description: 'We believe true engineering competency comes from building, failing, debugging, and shipping code. Every Workbench member works on real projects in a collaborative software development setup.',
    highlights: [
      {
        title: 'Real-World Products',
        description: 'Work on actual web apps, mobile tools, and community software with real active users.',
        icon: 'code'
      },
      {
        title: 'Agile Team Collaboration',
        description: 'Experience industry-standard workflows with sprint planning, peer reviews, and issue tracking.',
        icon: 'users'
      },
      {
        title: 'Git & Version Control',
        description: 'Master pull requests, code reviews, branch strategies, and GitHub best practices.',
        icon: 'git'
      },
      {
        title: 'Production Deployment',
        description: 'Learn to deploy, monitor, and maintain live applications on modern cloud platforms.',
        icon: 'rocket'
      }
    ]
  },
  mentorship: {
    title: 'Mentorship & Community',
    subtitle: 'Accelerate your growth with guidance at every step',
    description: 'You never learn alone at Code Troopers. Our mentorship framework ensures every member receives guidance, code feedback, and personal support from experienced leads.',
    pillars: [
      {
        title: '1-on-1 Guidance',
        description: 'Get paired with senior members who help guide your learning journey and troubleshoot blockers.'
      },
      {
        title: 'Code Reviews & Audits',
        description: 'Receive constructve code feedback to write clean, maintainable, and efficient code.'
      },
      {
        title: 'Tech Workshops & Demos',
        description: 'Participate in regular technical deep dives, live coding sessions, and architecture reviews.'
      },
      {
        title: 'Career & Resume Reviews',
        description: 'Prepare for internships and full-time roles with mock interviews, resume polishing, and portfolio advice.'
      }
    ]
  },
  whyJoin: {
    title: 'Why Join CodeTroopers?',
    subtitle: 'Unlock your potential as a developer and technology leader',
    reasons: [
      {
        title: 'Industry-Ready Skills',
        description: 'Gain practical experience with technologies and tools actively used in modern tech companies.'
      },
      {
        title: 'Vibrant Community',
        description: 'Surround yourself with passionate peers, builders, and aspiring tech leaders.'
      },
      {
        title: 'Hackathons & Events',
        description: 'Represent CodeTroopers in top-tier hackathons, competitions, and technical conferences.'
      },
      {
        title: 'Portfolio Differentiation',
        description: 'Stand out to recruiters with verified project contributions and real-world software releases.'
      },
      {
        title: 'Leadership Opportunities',
        description: 'Grow from a contributor into project leads, workshop speakers, and core club executives.'
      },
      {
        title: 'Alumni Network',
        description: 'Connect with club alumni working at top tech firms, startups, and research institutions.'
      }
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
