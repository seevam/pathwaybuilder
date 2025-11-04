// src/lib/data/careers-data.ts

export interface Career {
  id: string
  title: string
  cluster: string
  category: string
  description: string
  salaryRange: string
  education: string
  workEnvironment: string
  jobOutlook: string
  typicalTasks: string[]
  requiredSkills: string[]
  dayInLife: string
  resources: {
    onet: string
    bls: string
    youtube: string
    linkedin: string
  }
}

export const CAREERS: Career[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    cluster: 'Information Technology',
    category: 'Technical',
    description: 'Design, develop, and maintain software applications and systems',
    salaryRange: '$70,000 - $150,000',
    education: "Bachelor's degree in Computer Science or related field",
    workEnvironment: 'Office or Remote',
    jobOutlook: 'Excellent (22% growth)',
    typicalTasks: [
      'Write and test code for new applications',
      'Debug and fix software issues',
      'Collaborate with team members on projects',
      'Review code and provide feedback',
      'Stay updated on new technologies'
    ],
    requiredSkills: [
      'Programming languages (Python, JavaScript, Java)',
      'Problem-solving',
      'Attention to detail',
      'Teamwork',
      'Continuous learning'
    ],
    dayInLife: 'Start day with team standup meeting, work on coding tasks, review pull requests, collaborate with designers, test new features, learn new frameworks',
    resources: {
      onet: 'https://www.onetonline.org/link/summary/15-1252.00',
      bls: 'https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm',
      youtube: 'https://www.youtube.com/results?search_query=day+in+the+life+software+engineer',
      linkedin: 'https://www.linkedin.com/jobs/software-engineer-jobs'
    }
  },
  {
    id: 'graphic-designer',
    title: 'Graphic Designer',
    cluster: 'Arts & Communications',
    category: 'Creative',
    description: 'Create visual concepts to communicate ideas that inspire and inform consumers',
    salaryRange: '$40,000 - $85,000',
    education: "Bachelor's degree in Graphic Design or related field",
    workEnvironment: 'Office, Remote, or Freelance',
    jobOutlook: 'Moderate (3% growth)',
    typicalTasks: [
      'Meet with clients to understand project requirements',
      'Create design concepts and mockups',
      'Select colors, fonts, and images',
      'Present designs and incorporate feedback',
      'Prepare files for print or digital use'
    ],
    requiredSkills: [
      'Adobe Creative Suite (Photoshop, Illustrator)',
      'Creativity and artistic ability',
      'Communication skills',
      'Time management',
      'Attention to detail'
    ],
    dayInLife: 'Review project briefs, sketch initial concepts, create digital designs, present to clients, revise based on feedback, manage multiple projects',
    resources: {
      onet: 'https://www.onetonline.org/link/summary/27-1024.00',
      bls: 'https://www.bls.gov/ooh/arts-and-design/graphic-designers.htm',
      youtube: 'https://www.youtube.com/results?search_query=day+in+the+life+graphic+designer',
      linkedin: 'https://www.linkedin.com/jobs/graphic-designer-jobs'
    }
  },
  {
    id: 'nurse',
    title: 'Registered Nurse',
    cluster: 'Health Science',
    category: 'Healthcare',
    description: 'Provide and coordinate patient care, educate patients about health conditions',
    salaryRange: '$60,000 - $95,000',
    education: "Bachelor's of Science in Nursing (BSN) and state license",
    workEnvironment: 'Hospitals, Clinics, or Home Healthcare',
    jobOutlook: 'Excellent (6% growth)',
    typicalTasks: [
      'Assess patient conditions',
      'Administer medications and treatments',
      'Monitor patient vital signs',
      'Coordinate with doctors and healthcare team',
      'Educate patients and families'
    ],
    requiredSkills: [
      'Clinical skills and medical knowledge',
      'Compassion and empathy',
      'Critical thinking',
      'Communication',
      'Physical stamina'
    ],
    dayInLife: 'Check in patients, administer medications, update medical records, coordinate care plans, respond to emergencies, provide patient education',
    resources: {
      onet: 'https://www.onetonline.org/link/summary/29-1141.00',
      bls: 'https://www.bls.gov/ooh/healthcare/registered-nurses.htm',
      youtube: 'https://www.youtube.com/results?search_query=day+in+the+life+registered+nurse',
      linkedin: 'https://www.linkedin.com/jobs/registered-nurse-jobs'
    }
  },
  {
    id: 'marketing-manager',
    title: 'Marketing Manager',
    cluster: 'Business & Marketing',
    category: 'Business',
    description: 'Plan and execute marketing strategies to promote products or services',
    salaryRange: '$75,000 - $140,000',
    education: "Bachelor's degree in Marketing, Business, or related field",
    workEnvironment: 'Office or Hybrid',
    jobOutlook: 'Good (8% growth)',
    typicalTasks: [
      'Develop marketing campaigns',
      'Analyze market trends and customer data',
      'Manage marketing budget',
      'Coordinate with creative teams',
      'Track campaign performance'
    ],
    requiredSkills: [
      'Strategic thinking',
      'Data analysis',
      'Leadership',
      'Communication',
      'Digital marketing tools'
    ],
    dayInLife: 'Review campaign metrics, brainstorm new ideas, meet with teams, approve creative assets, analyze competitor strategies, present to stakeholders',
    resources: {
      onet: 'https://www.onetonline.org/link/summary/11-2021.00',
      bls: 'https://www.bls.gov/ooh/management/advertising-promotions-and-marketing-managers.htm',
      youtube: 'https://www.youtube.com/results?search_query=day+in+the+life+marketing+manager',
      linkedin: 'https://www.linkedin.com/jobs/marketing-manager-jobs'
    }
  },
  {
    id: 'environmental-scientist',
    title: 'Environmental Scientist',
    cluster: 'STEM',
    category: 'Science',
    description: 'Use knowledge of natural sciences to protect the environment and human health',
    salaryRange: '$55,000 - $95,000',
    education: "Bachelor's degree in Environmental Science or related field",
    workEnvironment: 'Field work, Laboratory, or Office',
    jobOutlook: 'Good (6% growth)',
    typicalTasks: [
      'Conduct field research and collect samples',
      'Analyze environmental data',
      'Write reports and recommendations',
      'Ensure compliance with regulations',
      'Develop environmental protection plans'
    ],
    requiredSkills: [
      'Scientific knowledge',
      'Data analysis',
      'Problem-solving',
      'Technical writing',
      'Field research methods'
    ],
    dayInLife: 'Collect environmental samples, run laboratory tests, analyze data, write reports, meet with stakeholders, visit project sites',
    resources: {
      onet: 'https://www.onetonline.org/link/summary/19-2041.00',
      bls: 'https://www.bls.gov/ooh/life-physical-and-social-science/environmental-scientists-and-specialists.htm',
      youtube: 'https://www.youtube.com/results?search_query=day+in+the+life+environmental+scientist',
      linkedin: 'https://www.linkedin.com/jobs/environmental-scientist-jobs'
    }
  },
  {
    id: 'teacher',
    title: 'High School Teacher',
    cluster: 'Education',
    category: 'Education',
    description: 'Educate students in specific subjects and help them develop critical thinking skills',
    salaryRange: '$45,000 - $75,000',
    education: "Bachelor's degree and teaching credential/license",
    workEnvironment: 'Schools',
    jobOutlook: 'Moderate (1% growth)',
    typicalTasks: [
      'Plan and deliver lessons',
      'Grade assignments and tests',
      'Manage classroom behavior',
      'Communicate with parents',
      'Participate in professional development'
    ],
    requiredSkills: [
      'Subject matter expertise',
      'Communication',
      'Patience',
      'Organization',
      'Classroom management'
    ],
    dayInLife: 'Prepare lesson plans, teach classes, grade work, meet with students, collaborate with other teachers, attend meetings, provide extra help',
    resources: {
      onet: 'https://www.onetonline.org/link/summary/25-2031.00',
      bls: 'https://www.bls.gov/ooh/education-training-and-library/high-school-teachers.htm',
      youtube: 'https://www.youtube.com/results?search_query=day+in+the+life+high+school+teacher',
      linkedin: 'https://www.linkedin.com/jobs/high-school-teacher-jobs'
    }
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    cluster: 'Information Technology',
    category: 'Technical',
    description: 'Collect, process, and analyze data to help organizations make informed decisions',
    salaryRange: '$55,000 - $95,000',
    education: "Bachelor's degree in Statistics, Mathematics, Computer Science, or related field",
    workEnvironment: 'Office or Remote',
    jobOutlook: 'Excellent (25% growth)',
    typicalTasks: [
      'Collect and clean data from various sources',
      'Analyze data to identify trends and patterns',
      'Create visualizations and reports',
      'Present findings to stakeholders',
      'Develop and maintain databases'
    ],
    requiredSkills: [
      'SQL and database management',
      'Statistical analysis',
      'Data visualization (Tableau, Power BI)',
      'Python or R programming',
      'Critical thinking'
    ],
    dayInLife: 'Extract data from databases, clean and prepare datasets, run statistical analyses, create dashboards, present insights to teams',
    resources: {
      onet: 'https://www.onetonline.org/link/summary/15-2051.00',
      bls: 'https://www.bls.gov/ooh/math/data-scientists.htm',
      youtube: 'https://www.youtube.com/results?search_query=day+in+the+life+data+analyst',
      linkedin: 'https://www.linkedin.com/jobs/data-analyst-jobs'
    }
  },
  {
    id: 'social-worker',
    title: 'Social Worker',
    cluster: 'Human Services',
    category: 'Social Services',
    description: 'Help individuals, families, and groups cope with problems in their everyday lives',
    salaryRange: '$45,000 - $70,000',
    education: "Bachelor's or Master's degree in Social Work (BSW/MSW) and state license",
    workEnvironment: 'Community centers, Schools, Hospitals, or Government agencies',
    jobOutlook: 'Good (9% growth)',
    typicalTasks: [
      'Assess client needs and situations',
      'Connect clients with resources and services',
      'Provide counseling and support',
      'Advocate for clients\' rights',
      'Maintain case records and documentation'
    ],
    requiredSkills: [
      'Empathy and compassion',
      'Active listening',
      'Problem-solving',
      'Cultural sensitivity',
      'Communication'
    ],
    dayInLife: 'Meet with clients, assess their situations, coordinate services, write case notes, attend team meetings, follow up on referrals',
    resources: {
      onet: 'https://www.onetonline.org/link/summary/21-1021.00',
      bls: 'https://www.bls.gov/ooh/community-and-social-service/social-workers.htm',
      youtube: 'https://www.youtube.com/results?search_query=day+in+the+life+social+worker',
      linkedin: 'https://www.linkedin.com/jobs/social-worker-jobs'
    }
  },
  {
    id: 'ux-designer',
    title: 'UX/UI Designer',
    cluster: 'Arts & Communications',
    category: 'Creative',
    description: 'Design user interfaces and experiences for digital products and services',
    salaryRange: '$60,000 - $120,000',
    education: "Bachelor's degree in Design, HCI, or related field",
    workEnvironment: 'Office, Remote, or Hybrid',
    jobOutlook: 'Excellent (13% growth)',
    typicalTasks: [
      'Conduct user research and testing',
      'Create wireframes and prototypes',
      'Design user interfaces and interactions',
      'Collaborate with developers and product managers',
      'Iterate designs based on feedback'
    ],
    requiredSkills: [
      'Design tools (Figma, Sketch, Adobe XD)',
      'User research methods',
      'Information architecture',
      'Prototyping',
      'Empathy and user-centered thinking'
    ],
    dayInLife: 'Review user feedback, sketch interface ideas, create high-fidelity designs, conduct usability tests, present designs to stakeholders',
    resources: {
      onet: 'https://www.onetonline.org/link/summary/15-1255.00',
      bls: 'https://www.bls.gov/ooh/arts-and-design/graphic-designers.htm',
      youtube: 'https://www.youtube.com/results?search_query=day+in+the+life+ux+designer',
      linkedin: 'https://www.linkedin.com/jobs/ux-designer-jobs'
    }
  },
  {
    id: 'physical-therapist',
    title: 'Physical Therapist',
    cluster: 'Health Science',
    category: 'Healthcare',
    description: 'Help patients recover mobility and manage pain through physical methods',
    salaryRange: '$70,000 - $100,000',
    education: "Doctoral degree in Physical Therapy (DPT) and state license",
    workEnvironment: 'Hospitals, Clinics, or Private practice',
    jobOutlook: 'Excellent (17% growth)',
    typicalTasks: [
      'Evaluate patients\' conditions and needs',
      'Develop treatment plans',
      'Demonstrate exercises and techniques',
      'Monitor patient progress',
      'Educate patients and families'
    ],
    requiredSkills: [
      'Anatomy and physiology knowledge',
      'Manual therapy techniques',
      'Patient assessment',
      'Communication and teaching',
      'Physical stamina'
    ],
    dayInLife: 'Assess new patients, guide therapeutic exercises, use manual therapy, track patient progress, adjust treatment plans, document sessions',
    resources: {
      onet: 'https://www.onetonline.org/link/summary/29-1123.00',
      bls: 'https://www.bls.gov/ooh/healthcare/physical-therapists.htm',
      youtube: 'https://www.youtube.com/results?search_query=day+in+the+life+physical+therapist',
      linkedin: 'https://www.linkedin.com/jobs/physical-therapist-jobs'
    }
  }
]

// Helper function to get careers by category
export function getCareersByCategory(category: string): Career[] {
  return CAREERS.filter(career => career.category === category)
}

// Helper function to get careers by cluster
export function getCareersByCluster(cluster: string): Career[] {
  return CAREERS.filter(career => career.cluster === cluster)
}

// Helper function to search careers
export function searchCareers(query: string): Career[] {
  const lowerQuery = query.toLowerCase()
  return CAREERS.filter(career =>
    career.title.toLowerCase().includes(lowerQuery) ||
    career.cluster.toLowerCase().includes(lowerQuery) ||
    career.category.toLowerCase().includes(lowerQuery) ||
    career.description.toLowerCase().includes(lowerQuery) ||
    career.requiredSkills.some(skill => skill.toLowerCase().includes(lowerQuery))
  )
}

// Get random careers
export function getRandomCareers(count: number): Career[] {
  const shuffled = [...CAREERS].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
