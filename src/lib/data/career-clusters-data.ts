// src/lib/data/career-clusters-data.ts

export type CareerCluster = {
  id: string
  name: string
  icon: string
  color: string
  description: string
  videoUrl: string // Placeholder - replace with actual video URLs
  riasecAlignment: string[] // Which RIASEC codes align with this cluster
  careers: {
    title: string
    salaryRange: string
    educationRequired: string
    description: string
  }[]
  quiz: {
    question: string
    options: string[]
    scores: number[] // Score for each option (0-3)
  }[]
  studentProfile: {
    name: string
    age: number
    school: string
    story: string
    favoritePart: string
  }
  dayInLife: {
    scenario: string
    choices: {
      text: string
      outcome: string
      score: number // How well this fits the cluster
    }[]
  }[]
}

export const CAREER_CLUSTERS: CareerCluster[] = [
  {
    id: 'agriculture',
    name: 'Agriculture, Food & Natural Resources',
    icon: '🌾',
    color: 'from-green-400 to-green-600',
    description: 'Work with plants, animals, and the environment to produce food, fiber, and natural resources.',
    videoUrl: '/videos/clusters/agriculture.mp4',
    riasecAlignment: ['R', 'I', 'C'],
    careers: [
      {
        title: 'Agricultural Scientist',
        salaryRange: '$60K - $120K',
        educationRequired: "Bachelor's or Master's in Agriculture",
        description: 'Research ways to improve crop yields and sustainability'
      },
      {
        title: 'Veterinarian',
        salaryRange: '$75K - $150K',
        educationRequired: 'Doctor of Veterinary Medicine',
        description: 'Care for animal health and perform medical procedures'
      },
      {
        title: 'Environmental Scientist',
        salaryRange: '$55K - $100K',
        educationRequired: "Bachelor's in Environmental Science",
        description: 'Study environmental issues and develop conservation solutions'
      },
      {
        title: 'Food Scientist',
        salaryRange: '$50K - $95K',
        educationRequired: "Bachelor's in Food Science",
        description: 'Develop and test new food products and safety measures'
      },
      {
        title: 'Forester',
        salaryRange: '$45K - $80K',
        educationRequired: "Bachelor's in Forestry",
        description: 'Manage and protect forest resources'
      },
      {
        title: 'Agricultural Engineer',
        salaryRange: '$60K - $110K',
        educationRequired: "Bachelor's in Agricultural Engineering",
        description: 'Design equipment and systems for farming operations'
      },
      {
        title: 'Park Ranger',
        salaryRange: '$40K - $70K',
        educationRequired: "Bachelor's in Environmental Studies",
        description: 'Protect and manage natural parks and wildlife'
      },
      {
        title: 'Sustainable Agriculture Consultant',
        salaryRange: '$50K - $90K',
        educationRequired: "Bachelor's in Agriculture/Sustainability",
        description: 'Help farms implement eco-friendly practices'
      }
    ],
    quiz: [
      {
        question: 'How do you feel about working outdoors in various weather conditions?',
        options: [
          "I love being outside in nature, rain or shine",
          "I enjoy it occasionally but prefer climate-controlled environments",
          "I'd rather work indoors most of the time",
          "Weather doesn't matter much to me"
        ],
        scores: [3, 1, 0, 2]
      },
      {
        question: 'What interests you most about this field?',
        options: [
          'Working with animals and their welfare',
          'Solving environmental problems',
          'Growing and producing food',
          'Using technology in agriculture'
        ],
        scores: [3, 3, 3, 3]
      },
      {
        question: 'How comfortable are you with physical labor?',
        options: [
          'Very comfortable, I enjoy active work',
          'Somewhat comfortable with moderate activity',
          'Prefer mostly desk work',
          'Open to occasional physical tasks'
        ],
        scores: [3, 2, 0, 1]
      }
    ],
    studentProfile: {
      name: 'Maria Rodriguez',
      age: 19,
      school: 'UC Davis',
      story: 'Growing up on my family\'s farm, I saw firsthand the challenges farmers face. I\'m studying agricultural science to help develop sustainable farming practices that work for small farmers.',
      favoritePart: 'Conducting field experiments and seeing real impact on crop yields'
    },
    dayInLife: [
      {
        scenario: "You're working on a farm that's experiencing crop disease. What's your first step?",
        choices: [
          {
            text: 'Take soil and plant samples for lab analysis',
            outcome: 'Good scientific approach! You identify the pathogen and recommend treatment.',
            score: 3
          },
          {
            text: 'Consult with experienced farmers in the area',
            outcome: 'Valuable local knowledge helps you understand the history of the issue.',
            score: 2
          },
          {
            text: 'Research similar cases online and in journals',
            outcome: 'You find relevant studies that guide your investigation.',
            score: 2
          }
        ]
      },
      {
        scenario: "A farmer wants to transition to organic practices. How do you help?",
        choices: [
          {
            text: 'Create a detailed 3-year transition plan with cost analysis',
            outcome: 'Excellent! Your comprehensive plan gives them confidence to proceed.',
            score: 3
          },
          {
            text: 'Connect them with other organic farmers for mentorship',
            outcome: 'Great networking! They learn from others\' experiences.',
            score: 2
          },
          {
            text: 'Recommend they start with a small test plot',
            outcome: 'Smart strategy to minimize risk while learning.',
            score: 3
          }
        ]
      }
    ]
  },
  {
    id: 'architecture',
    name: 'Architecture & Construction',
    icon: '🏗️',
    color: 'from-orange-400 to-red-600',
    description: 'Design, plan, manage, and build structures and infrastructure.',
    videoUrl: '/videos/clusters/architecture.mp4',
    riasecAlignment: ['R', 'I', 'E'],
    careers: [
      {
        title: 'Architect',
        salaryRange: '$65K - $130K',
        educationRequired: "Bachelor's + Licensure",
        description: 'Design buildings and structures with aesthetics and functionality'
      },
      {
        title: 'Civil Engineer',
        salaryRange: '$70K - $125K',
        educationRequired: "Bachelor's in Civil Engineering",
        description: 'Design and oversee infrastructure projects like roads and bridges'
      },
      {
        title: 'Construction Manager',
        salaryRange: '$75K - $140K',
        educationRequired: "Bachelor's in Construction Management",
        description: 'Coordinate and supervise construction projects'
      },
      {
        title: 'Urban Planner',
        salaryRange: '$55K - $100K',
        educationRequired: "Master's in Urban Planning",
        description: 'Plan land use and community development'
      },
      {
        title: 'Interior Designer',
        salaryRange: '$40K - $85K',
        educationRequired: "Bachelor's in Interior Design",
        description: 'Create functional and aesthetic interior spaces'
      },
      {
        title: 'Structural Engineer',
        salaryRange: '$70K - $130K',
        educationRequired: "Bachelor's + Master's in Engineering",
        description: 'Ensure buildings can withstand structural loads'
      },
      {
        title: 'Landscape Architect',
        salaryRange: '$50K - $95K',
        educationRequired: "Bachelor's in Landscape Architecture",
        description: 'Design outdoor spaces and gardens'
      },
      {
        title: 'Sustainable Building Consultant',
        salaryRange: '$60K - $110K',
        educationRequired: "Bachelor's + Green Building Certification",
        description: 'Help design eco-friendly, energy-efficient buildings'
      }
    ],
    quiz: [
      {
        question: 'How do you feel about math and physics?',
        options: [
          'I excel at them and find them interesting',
          'They\'re okay, I can handle them',
          'Not my strongest subjects',
          'I prefer creative over technical work'
        ],
        scores: [3, 2, 1, 0]
      },
      {
        question: 'What appeals to you most about this field?',
        options: [
          'Seeing my designs become reality',
          'Solving complex structural problems',
          'Leading teams and managing projects',
          'Creating sustainable solutions'
        ],
        scores: [3, 3, 3, 3]
      },
      {
        question: 'How comfortable are you with Computer-Aided Design (CAD) software?',
        options: [
          'Very comfortable, I enjoy using design tools',
          'Willing to learn, seems interesting',
          'Prefer hands-on work over computer work',
          'Not sure, haven\'t tried it yet'
        ],
        scores: [3, 2, 1, 1]
      }
    ],
    studentProfile: {
      name: 'James Chen',
      age: 20,
      school: 'Cornell University',
      story: 'After visiting the High Line in NYC, I became obsessed with how architecture can transform communities. I want to design public spaces that bring people together and improve quality of life.',
      favoritePart: 'Using 3D modeling software to bring my ideas to life'
    },
    dayInLife: [
      {
        scenario: "A client wants a modern design, but the building is in a historic district. What do you do?",
        choices: [
          {
            text: 'Research historic preservation guidelines first',
            outcome: 'Smart! You avoid costly redesigns by understanding constraints.',
            score: 3
          },
          {
            text: 'Design a modern interior with traditional exterior',
            outcome: 'Creative compromise that satisfies both requirements!',
            score: 3
          },
          {
            text: 'Meet with the historic board to discuss possibilities',
            outcome: 'Good stakeholder engagement opens up options.',
            score: 2
          }
        ]
      },
      {
        scenario: "Your construction team reports that your design will exceed budget. How do you respond?",
        choices: [
          {
            text: 'Review the design for cost-saving alternatives',
            outcome: 'You find ways to maintain vision while reducing costs.',
            score: 3
          },
          {
            text: 'Propose a phased implementation plan',
            outcome: 'Clever! Essential features now, enhancements later.',
            score: 2
          },
          {
            text: 'Meet with all stakeholders to reprioritize',
            outcome: 'Collaborative approach ensures everyone\'s input.',
            score: 2
          }
        ]
      }
    ]
  },
  {
    id: 'arts',
    name: 'Arts, Audio/Video Technology & Communications',
    icon: '🎭',
    color: 'from-pink-400 to-purple-600',
    description: 'Create, produce, and distribute multimedia content and entertainment.',
    videoUrl: '/videos/clusters/arts.mp4',
    riasecAlignment: ['A', 'E', 'S'],
    careers: [
      {
        title: 'Graphic Designer',
        salaryRange: '$45K - $85K',
        educationRequired: "Bachelor's in Graphic Design",
        description: 'Create visual content for brands and marketing'
      },
      {
        title: 'Film Director',
        salaryRange: '$50K - $150K+',
        educationRequired: "Bachelor's in Film/Experience",
        description: 'Lead creative vision and production of films'
      },
      {
        title: 'UX/UI Designer',
        salaryRange: '$70K - $130K',
        educationRequired: "Bachelor's in Design/HCI",
        description: 'Design user experiences for digital products'
      },
      {
        title: 'Journalist',
        salaryRange: '$40K - $90K',
        educationRequired: "Bachelor's in Journalism",
        description: 'Research and report news stories'
      },
      {
        title: 'Video Game Designer',
        salaryRange: '$55K - $110K',
        educationRequired: "Bachelor's in Game Design",
        description: 'Create gameplay mechanics and game worlds'
      },
      {
        title: 'Music Producer',
        salaryRange: '$35K - $120K',
        educationRequired: 'Varies - Degree or Experience',
        description: 'Produce and engineer music recordings'
      },
      {
        title: 'Social Media Manager',
        salaryRange: '$45K - $85K',
        educationRequired: "Bachelor's in Marketing/Communications",
        description: 'Develop and execute social media strategies'
      },
      {
        title: 'Animator',
        salaryRange: '$50K - $95K',
        educationRequired: "Bachelor's in Animation",
        description: 'Create animated content for film, TV, and games'
      }
    ],
    quiz: [
      {
        question: 'How do you feel about creative feedback and iteration?',
        options: [
          'I thrive on feedback and love refining my work',
          'I appreciate constructive criticism',
          'I prefer to work independently without much feedback',
          'Feedback is helpful but can be challenging'
        ],
        scores: [3, 2, 0, 1]
      },
      {
        question: 'What creative medium excites you most?',
        options: [
          'Visual arts and design',
          'Video and film production',
          'Writing and storytelling',
          'Audio and music creation'
        ],
        scores: [3, 3, 3, 3]
      },
      {
        question: 'How comfortable are you learning new creative software?',
        options: [
          'Very comfortable, I love exploring new tools',
          'Willing to learn what\'s needed',
          'Prefer to master a few tools deeply',
          'Can be overwhelming but I\'m interested'
        ],
        scores: [3, 2, 2, 1]
      }
    ],
    studentProfile: {
      name: 'Alexa Morrison',
      age: 18,
      school: 'NYU Tisch',
      story: 'I\'ve been making short films on my phone since I was 13. What started as fun evolved into a passion for storytelling. I want to direct films that amplify underrepresented voices.',
      favoritePart: 'Collaborating with other creatives and bringing stories to life'
    },
    dayInLife: [
      {
        scenario: "A client hates your design that you spent weeks perfecting. What's your response?",
        choices: [
          {
            text: 'Ask specific questions about what isn\'t working',
            outcome: 'You discover their concerns and can address them directly.',
            score: 3
          },
          {
            text: 'Present the reasoning behind your design choices',
            outcome: 'Explaining your process helps them understand your vision.',
            score: 2
          },
          {
            text: 'Offer 2-3 alternative directions based on their feedback',
            outcome: 'Your flexibility and solutions-focus impresses them.',
            score: 3
          }
        ]
      },
      {
        scenario: "You have a creative breakthrough at 2 AM. What do you do?",
        choices: [
          {
            text: 'Sketch it out immediately before I forget',
            outcome: 'Good call! You capture the idea while it\'s fresh.',
            score: 3
          },
          {
            text: 'Voice memo myself the concept',
            outcome: 'Smart way to preserve ideas quickly.',
            score: 2
          },
          {
            text: 'Set an early alarm to work on it tomorrow',
            outcome: 'Some ideas survive sleep, but you risk losing details.',
            score: 1
          }
        ]
      }
    ]
  },
  {
    id: 'business',
    name: 'Business Management & Administration',
    icon: '💼',
    color: 'from-blue-400 to-indigo-600',
    description: 'Plan, organize, direct, and manage business operations and resources.',
    videoUrl: '/videos/clusters/business.mp4',
    riasecAlignment: ['E', 'C', 'S'],
    careers: [
      {
        title: 'Business Analyst',
        salaryRange: '$60K - $110K',
        educationRequired: "Bachelor's in Business",
        description: 'Analyze business processes and recommend improvements'
      },
      {
        title: 'Management Consultant',
        salaryRange: '$75K - $150K',
        educationRequired: "Bachelor's/MBA",
        description: 'Advise organizations on strategy and operations'
      },
      {
        title: 'Human Resources Manager',
        salaryRange: '$65K - $125K',
        educationRequired: "Bachelor's in HR/Business",
        description: 'Oversee employee recruitment, development, and relations'
      },
      {
        title: 'Operations Manager',
        salaryRange: '$60K - $115K',
        educationRequired: "Bachelor's in Business/Operations",
        description: 'Manage day-to-day business operations'
      },
      {
        title: 'Project Manager',
        salaryRange: '$70K - $130K',
        educationRequired: "Bachelor's + PMP Certification",
        description: 'Lead projects from planning to completion'
      },
      {
        title: 'Entrepreneur',
        salaryRange: 'Varies widely',
        educationRequired: 'Varies - Often Business Degree',
        description: 'Start and grow your own business ventures'
      },
      {
        title: 'Supply Chain Manager',
        salaryRange: '$70K - $130K',
        educationRequired: "Bachelor's in Supply Chain/Business",
        description: 'Oversee product flow from supplier to customer'
      },
      {
        title: 'Executive Director (Nonprofit)',
        salaryRange: '$55K - $120K',
        educationRequired: "Bachelor's/Master's",
        description: 'Lead nonprofit organizations and missions'
      }
    ],
    quiz: [
      {
        question: 'How do you feel about leading teams and making decisions?',
        options: [
          'I naturally take charge and enjoy leadership',
          'I can lead when needed',
          'I prefer supporting roles',
          'Leadership is interesting but intimidating'
        ],
        scores: [3, 2, 0, 1]
      },
      {
        question: 'What aspect of business interests you most?',
        options: [
          'Strategy and growth planning',
          'Operations and efficiency',
          'People and organizational culture',
          'Innovation and entrepreneurship'
        ],
        scores: [3, 3, 3, 3]
      },
      {
        question: 'How comfortable are you with data and analytics?',
        options: [
          'Very comfortable, I love data-driven decisions',
          'Comfortable enough to use in my work',
          'Prefer qualitative over quantitative',
          'Still learning but willing to develop'
        ],
        scores: [3, 2, 1, 1]
      }
    ],
    studentProfile: {
      name: 'David Park',
      age: 21,
      school: 'Wharton School of Business',
      story: 'My parents owned a small restaurant where I saw the challenges of running a business. I want to help small businesses scale sustainably using data and modern management practices.',
      favoritePart: 'Seeing how small process improvements can have big impacts'
    },
    dayInLife: [
      {
        scenario: "Your team is behind schedule on a major project. How do you handle it?",
        choices: [
          {
            text: 'Analyze the bottlenecks and reallocate resources',
            outcome: 'Data-driven approach identifies the real problems.',
            score: 3
          },
          {
            text: 'Have one-on-ones to understand team challenges',
            outcome: 'You discover personal issues affecting performance.',
            score: 2
          },
          {
            text: 'Break remaining work into smaller sprints',
            outcome: 'Agile approach gives the team achievable goals.',
            score: 3
          }
        ]
      },
      {
        scenario: "You notice employee morale is low. What's your first move?",
        choices: [
          {
            text: 'Send out an anonymous survey to gather feedback',
            outcome: 'You get honest insights about workplace issues.',
            score: 2
          },
          {
            text: 'Host a team building event',
            outcome: 'Temporary boost, but doesn\'t address root causes.',
            score: 1
          },
          {
            text: 'Schedule skip-level meetings to hear concerns',
            outcome: 'Direct conversations reveal leadership blind spots.',
            score: 3
          }
        ]
      }
    ]
  },
  {
    id: 'education',
    name: 'Education & Training',
    icon: '📚',
    color: 'from-yellow-400 to-orange-500',
    description: 'Plan, manage, and provide education and training services.',
    videoUrl: '/videos/clusters/education.mp4',
    riasecAlignment: ['S', 'A', 'E'],
    careers: [
      {
        title: 'Teacher',
        salaryRange: '$45K - $85K',
        educationRequired: "Bachelor's + Teaching Credential",
        description: 'Educate students in specific subject areas'
      },
      {
        title: 'School Counselor',
        salaryRange: '$50K - $80K',
        educationRequired: "Master's in Counseling",
        description: 'Support students\' academic and personal development'
      },
      {
        title: 'Corporate Trainer',
        salaryRange: '$55K - $95K',
        educationRequired: "Bachelor's + Experience",
        description: 'Develop and deliver employee training programs'
      },
      {
        title: 'Instructional Designer',
        salaryRange: '$60K - $105K',
        educationRequired: "Master's in Education/ID",
        description: 'Design educational curricula and learning materials'
      },
      {
        title: 'EdTech Specialist',
        salaryRange: '$55K - $100K',
        educationRequired: "Bachelor's in Education/Technology",
        description: 'Integrate technology into educational settings'
      },
      {
        title: 'Special Education Teacher',
        salaryRange: '$50K - $90K',
        educationRequired: "Bachelor's + Special Ed Credential",
        description: 'Support students with diverse learning needs'
      },
      {
        title: 'College Professor',
        salaryRange: '$60K - $150K',
        educationRequired: 'PhD or Terminal Degree',
        description: 'Teach and conduct research at universities'
      },
      {
        title: 'Educational Administrator',
        salaryRange: '$75K - $140K',
        educationRequired: "Master's + Admin Credential",
        description: 'Lead schools and educational programs'
      }
    ],
    quiz: [
      {
        question: 'How do you feel about explaining concepts to others?',
        options: [
          'I love it and I\'m good at breaking things down',
          'I enjoy helping others understand',
          'It\'s okay but not my favorite activity',
          'I find it challenging to teach'
        ],
        scores: [3, 2, 1, 0]
      },
      {
        question: 'What motivates you most about education?',
        options: [
          'Seeing students have "aha!" moments',
          'Making a lasting impact on lives',
          'Creating innovative learning experiences',
          'Supporting students through challenges'
        ],
        scores: [3, 3, 3, 3]
      },
      {
        question: 'How patient are you when things don\'t go as planned?',
        options: [
          'Very patient, I stay calm and adapt',
          'Generally patient with some frustration',
          'I struggle with unexpected changes',
          'Depends on the situation'
        ],
        scores: [3, 2, 0, 1]
      }
    ],
    studentProfile: {
      name: 'Sarah Johnson',
      age: 20,
      school: 'Stanford',
      story: 'My 8th grade English teacher changed my life by believing in me when I didn\'t believe in myself. I want to be that person for students who feel invisible or incapable.',
      favoritePart: 'That moment when a struggling student finally gets it'
    },
    dayInLife: [
      {
        scenario: "A student is consistently disruptive in class. What's your approach?",
        choices: [
          {
            text: 'Have a private conversation to understand what\'s going on',
            outcome: 'You learn they\'re struggling at home and need support.',
            score: 3
          },
          {
            text: 'Implement a behavior contract with clear expectations',
            outcome: 'Structure helps, but you miss underlying issues.',
            score: 1
          },
          {
            text: 'Try different seating and give them special roles',
            outcome: 'Creative approach that channels their energy positively.',
            score: 2
          }
        ]
      },
      {
        scenario: "Half your class failed the test. What do you do?",
        choices: [
          {
            text: 'Reflect on your teaching methods and re-teach',
            outcome: 'Taking responsibility leads to better outcomes.',
            score: 3
          },
          {
            text: 'Offer retakes after tutoring sessions',
            outcome: 'Supportive approach that focuses on learning.',
            score: 2
          },
          {
            text: 'Review the test for fairness and clarity',
            outcome: 'You discover the questions were confusing.',
            score: 2
          }
        ]
      }
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: '💰',
    color: 'from-green-400 to-teal-600',
    description: 'Plan, manage, and provide financial services and investment strategies.',
    videoUrl: '/videos/clusters/finance.mp4',
    riasecAlignment: ['C', 'E', 'I'],
    careers: [
      {
        title: 'Financial Analyst',
        salaryRange: '$60K - $110K',
        educationRequired: "Bachelor's in Finance",
        description: 'Analyze financial data and investment opportunities'
      },
      {
        title: 'Investment Banker',
        salaryRange: '$85K - $200K+',
        educationRequired: "Bachelor's in Finance/Economics",
        description: 'Advise on and execute financial transactions'
      },
      {
        title: 'Financial Planner',
        salaryRange: '$55K - $120K',
        educationRequired: "Bachelor's + CFP Certification",
        description: 'Help individuals plan for financial goals'
      },
      {
        title: 'Accountant',
        salaryRange: '$50K - $95K',
        educationRequired: "Bachelor's in Accounting + CPA",
        description: 'Prepare and examine financial records'
      },
      {
        title: 'Actuary',
        salaryRange: '$75K - $150K',
        educationRequired: "Bachelor's in Math/Actuarial Science",
        description: 'Analyze financial risks using mathematics'
      },
      {
        title: 'Portfolio Manager',
        salaryRange: '$85K - $180K',
        educationRequired: "Bachelor's/MBA + CFA",
        description: 'Manage investment portfolios for clients'
      },
      {
        title: 'Risk Manager',
        salaryRange: '$70K - $140K',
        educationRequired: "Bachelor's in Finance/Risk Management",
        description: 'Identify and mitigate financial risks'
      },
      {
        title: 'Cryptocurrency Analyst',
        salaryRange: '$65K - $130K',
        educationRequired: "Bachelor's in Finance/Comp Sci",
        description: 'Analyze blockchain and crypto markets'
      }
    ],
    quiz: [
      {
        question: 'How comfortable are you with numbers and data?',
        options: [
          'Very comfortable, I love working with data',
          'Comfortable enough for most tasks',
          'Can handle it but prefer other work',
          'Not my strong suit'
        ],
        scores: [3, 2, 1, 0]
      },
      {
        question: 'What interests you most about finance?',
        options: [
          'Analyzing markets and making predictions',
          'Helping people achieve financial goals',
          'The fast-paced, high-stakes environment',
          'Understanding how money moves through systems'
        ],
        scores: [3, 3, 3, 3]
      },
      {
        question: 'How do you handle pressure and deadlines?',
        options: [
          'I thrive under pressure',
          'I can handle it when needed',
          'Pressure stresses me out',
          'I prefer a steady, predictable pace'
        ],
        scores: [3, 2, 0, 1]
      }
    ],
    studentProfile: {
      name: 'Michael Zhang',
      age: 19,
      school: 'University of Pennsylvania',
      story: 'I grew up watching my immigrant parents struggle with financial literacy. I want to help underserved communities understand finance and build wealth.',
      favoritePart: 'Using data to uncover investment opportunities others miss'
    },
    dayInLife: [
      {
        scenario: "The market just crashed 10%. Your client is panicking. What do you do?",
        choices: [
          {
            text: 'Review their long-term strategy and risk tolerance',
            outcome: 'Reminding them of their plan calms their nerves.',
            score: 3
          },
          {
            text: 'Explain historical market recoveries with data',
            outcome: 'Evidence-based reassurance is effective.',
            score: 2
          },
          {
            text: 'Suggest tactical rebalancing to take advantage',
            outcome: 'Turning fear into opportunity impresses them.',
            score: 3
          }
        ]
      },
      {
        scenario: "You spot a potentially fraudulent transaction. What's your move?",
        choices: [
          {
            text: 'Immediately report it to compliance',
            outcome: 'By-the-book response prevents bigger problems.',
            score: 3
          },
          {
            text: 'Gather more evidence before reporting',
            outcome: 'Thorough but delays important action.',
            score: 1
          },
          {
            text: 'Alert your supervisor and follow their guidance',
            outcome: 'Good chain of command, ensures proper handling.',
            score: 2
          }
        ]
      }
    ]
  },
  // Continue with remaining clusters...
  {
    id: 'government',
    name: 'Government & Public Administration',
    icon: '🏛️',
    color: 'from-blue-500 to-purple-600',
    description: 'Execute governmental functions and provide public services.',
    videoUrl: '/videos/clusters/government.mp4',
    riasecAlignment: ['E', 'S', 'C'],
    careers: [
      {
        title: 'Policy Analyst',
        salaryRange: '$55K - $100K',
        educationRequired: "Bachelor's/Master's in Public Policy",
        description: 'Research and analyze policy proposals'
      },
      {
        title: 'Urban Planner',
        salaryRange: '$55K - $95K',
        educationRequired: "Master's in Urban Planning",
        description: 'Plan community development and land use'
      },
      {
        title: 'Foreign Service Officer',
        salaryRange: '$60K - $120K',
        educationRequired: "Bachelor's + FSO Exam",
        description: 'Represent the US in diplomatic relations'
      },
      {
        title: 'Legislative Assistant',
        salaryRange: '$45K - $75K',
        educationRequired: "Bachelor's in Political Science",
        description: 'Support elected officials with policy work'
      },
      {
        title: 'City Manager',
        salaryRange: '$80K - $180K',
        educationRequired: "Master's in Public Administration",
        description: 'Oversee municipal government operations'
      },
      {
        title: 'Intelligence Analyst',
        salaryRange: '$65K - $125K',
        educationRequired: "Bachelor's + Security Clearance",
        description: 'Analyze national security information'
      },
      {
        title: 'Emergency Management Director',
        salaryRange: '$60K - $110K',
        educationRequired: "Bachelor's in Emergency Management",
        description: 'Coordinate disaster preparedness and response'
      },
      {
        title: 'Public Affairs Specialist',
        salaryRange: '$50K - $90K',
        educationRequired: "Bachelor's in Communications",
        description: 'Manage government communications'
      }
    ],
    quiz: [
      {
        question: 'How interested are you in current events and politics?',
        options: [
          'Very interested, I follow closely',
          'Moderately interested',
          'Not particularly interested',
          'Only major events'
        ],
        scores: [3, 2, 0, 1]
      },
      {
        question: 'What motivates you about public service?',
        options: [
          'Making policy that helps people',
          'Serving my community/country',
          'Working on complex social problems',
          'The stability and benefits'
        ],
        scores: [3, 3, 3, 1]
      },
      {
        question: 'How do you handle bureaucracy and procedures?',
        options: [
          'I understand their importance and follow them',
          'I can work within them when needed',
          'They frustrate me significantly',
          'I prefer more flexibility'
        ],
        scores: [3, 2, 0, 1]
      }
    ],
    studentProfile: {
      name: 'Amanda Williams',
      age: 21,
      school: 'Georgetown University',
      story: 'Volunteering in local government showed me how policy directly impacts people\'s daily lives. I want to work on affordable housing policy to help families like mine.',
      favoritePart: 'Seeing how small policy changes can have big community impacts'
    },
    dayInLife: [
      {
        scenario: "A controversial policy is up for debate. Citizens are divided. What's your role?",
        choices: [
          {
            text: 'Organize town halls to hear all perspectives',
            outcome: 'Public engagement reveals common ground.',
            score: 3
          },
          {
            text: 'Research how other cities handled similar issues',
            outcome: 'Best practices inform your recommendation.',
            score: 2
          },
          {
            text: 'Conduct data analysis on potential impacts',
            outcome: 'Evidence-based approach builds credibility.',
            score: 3
          }
        ]
      }
    ]
  },
  {
    id: 'health',
    name: 'Health Science',
    icon: '⚕️',
    color: 'from-red-400 to-pink-600',
    description: 'Plan, manage, and provide therapeutic, diagnostic, and health information services.',
    videoUrl: '/videos/clusters/health.mp4',
    riasecAlignment: ['I', 'S', 'R'],
    careers: [
      {
        title: 'Physician',
        salaryRange: '$120K - $300K+',
        educationRequired: 'MD/DO + Residency',
        description: 'Diagnose and treat patient illnesses'
      },
      {
        title: 'Registered Nurse',
        salaryRange: '$60K - $95K',
        educationRequired: 'BSN or ADN + License',
        description: 'Provide patient care and support'
      },
      {
        title: 'Physical Therapist',
        salaryRange: '$70K - $105K',
        educationRequired: 'Doctor of Physical Therapy',
        description: 'Help patients recover movement and function'
      },
      {
        title: 'Medical Researcher',
        salaryRange: '$65K - $120K',
        educationRequired: 'PhD or MD',
        description: 'Conduct research to advance medical knowledge'
      },
      {
        title: 'Pharmacist',
        salaryRange: '$95K - $145K',
        educationRequired: 'Doctor of Pharmacy',
        description: 'Dispense medications and advise on use'
      },
      {
        title: 'Healthcare Administrator',
        salaryRange: '$70K - $140K',
        educationRequired: "Bachelor's/Master's in Healthcare Admin",
        description: 'Manage healthcare facilities and systems'
      },
      {
        title: 'Genetic Counselor',
        salaryRange: '$70K - $105K',
        educationRequired: "Master's in Genetic Counseling",
        description: 'Advise on genetic conditions and testing'
      },
      {
        title: 'Medical Illustrator',
        salaryRange: '$50K - $95K',
        educationRequired: "Master's in Medical Illustration",
        description: 'Create visual materials for medical education'
      }
    ],
    quiz: [
      {
        question: 'How comfortable are you with biology and human anatomy?',
        options: [
          'Very comfortable, I find it fascinating',
          'Comfortable enough to learn more',
          'It\'s challenging but interesting',
          'Not my favorite subject'
        ],
        scores: [3, 2, 1, 0]
      },
      {
        question: 'What appeals to you about healthcare?',
        options: [
          'Directly helping sick or injured people',
          'Scientific discovery and research',
          'Problem-solving and diagnosis',
          'The stability and respect'
        ],
        scores: [3, 3, 3, 1]
      },
      {
        question: 'How do you handle emotionally difficult situations?',
        options: [
          'I stay calm and focused on helping',
          'I can manage my emotions professionally',
          'I find it very challenging',
          'I need time to process afterward'
        ],
        scores: [3, 2, 0, 1]
      }
    ],
    studentProfile: {
      name: 'Priya Patel',
      age: 20,
      school: 'Johns Hopkins',
      story: 'When my grandmother had a stroke, I saw how healthcare workers made all the difference. I want to become a neurologist to help families navigate these difficult moments.',
      favoritePart: 'Learning how intricate and amazing the human body is'
    },
    dayInLife: [
      {
        scenario: "A patient isn't following their treatment plan. How do you respond?",
        choices: [
          {
            text: 'Ask about barriers they\'re facing',
            outcome: 'You discover cost is the issue and find solutions.',
            score: 3
          },
          {
            text: 'Explain the consequences of non-compliance',
            outcome: 'Fear tactics rarely work and damage trust.',
            score: 1
          },
          {
            text: 'Simplify the plan to make it more manageable',
            outcome: 'A realistic plan they can actually follow.',
            score: 3
          }
        ]
      }
    ]
  },
  {
    id: 'hospitality',
    name: 'Hospitality & Tourism',
    icon: '🏨',
    color: 'from-amber-400 to-orange-600',
    description: 'Manage and provide services related to hospitality, travel, and tourism.',
    videoUrl: '/videos/clusters/hospitality.mp4',
    riasecAlignment: ['E', 'S', 'A'],
    careers: [
      {
        title: 'Hotel Manager',
        salaryRange: '$50K - $110K',
        educationRequired: "Bachelor's in Hospitality Management",
        description: 'Oversee hotel operations and guest services'
      },
      {
        title: 'Event Planner',
        salaryRange: '$45K - $85K',
        educationRequired: "Bachelor's in Event Management",
        description: 'Plan and coordinate events and conferences'
      },
      {
        title: 'Travel Agent',
        salaryRange: '$35K - $65K',
        educationRequired: 'Varies - Training/Certification',
        description: 'Help clients plan travel and vacations'
      },
      {
        title: 'Restaurant Manager',
        salaryRange: '$45K - $85K',
        educationRequired: "Bachelor's or Experience",
        description: 'Manage restaurant operations and staff'
      },
      {
        title: 'Chef',
        salaryRange: '$40K - $95K',
        educationRequired: 'Culinary School or Experience',
        description: 'Create menus and prepare food'
      },
      {
        title: 'Tourism Director',
        salaryRange: '$50K - $95K',
        educationRequired: "Bachelor's in Tourism/Marketing",
        description: 'Promote destinations and manage tourism'
      },
      {
        title: 'Cruise Director',
        salaryRange: '$45K - $80K+',
        educationRequired: 'Experience in Hospitality',
        description: 'Coordinate activities and entertainment on cruises'
      },
      {
        title: 'Resort Manager',
        salaryRange: '$55K - $120K',
        educationRequired: "Bachelor's in Hospitality",
        description: 'Oversee resort operations and experiences'
      }
    ],
    quiz: [
      {
        question: 'How do you feel about irregular hours and working weekends?',
        options: [
          'Fine with me, I like flexibility',
          'Can handle it for the right role',
          'Prefer regular 9-5 schedule',
          'Would be very challenging'
        ],
        scores: [3, 2, 0, 0]
      },
      {
        question: 'What excites you about this field?',
        options: [
          'Creating memorable experiences for people',
          'The fast-paced, dynamic environment',
          'Meeting people from different cultures',
          'Food and culinary arts'
        ],
        scores: [3, 3, 3, 3]
      },
      {
        question: 'How do you handle difficult customers?',
        options: [
          'Stay calm and find solutions',
          'Take it in stride professionally',
          'Find it very stressful',
          'Prefer limited customer interaction'
        ],
        scores: [3, 2, 0, 0]
      }
    ],
    studentProfile: {
      name: 'Carlos Rivera',
      age: 19,
      school: 'Cornell School of Hotel Administration',
      story: 'Working at my family\'s restaurant taught me that hospitality is about making people feel special. I want to open a sustainable farm-to-table restaurant.',
      favoritePart: 'Seeing guests\' faces light up with excellent service'
    },
    dayInLife: [
      {
        scenario: "A VIP guest's room isn't ready on time. What do you do?",
        choices: [
          {
            text: 'Personally apologize and offer suite upgrade',
            outcome: 'Your proactive solution turns complaint into loyalty.',
            score: 3
          },
          {
            text: 'Provide lounge access and complimentary services',
            outcome: 'Good recovery but doesn\'t fully address frustration.',
            score: 2
          },
          {
            text: 'Blame housekeeping and offer discount',
            outcome: 'Deflecting responsibility damages your reputation.',
            score: 0
          }
        ]
      }
    ]
  },
  {
    id: 'human-services',
    name: 'Human Services',
    icon: '🤗',
    color: 'from-purple-400 to-pink-600',
    description: 'Prepare individuals for careers in counseling, mental health, and family services.',
    videoUrl: '/videos/clusters/human-services.mp4',
    riasecAlignment: ['S', 'I', 'E'],
    careers: [
      {
        title: 'Social Worker',
        salaryRange: '$45K - $75K',
        educationRequired: "Bachelor's/Master's in Social Work",
        description: 'Help individuals and families cope with challenges'
      },
      {
        title: 'Mental Health Counselor',
        salaryRange: '$40K - $70K',
        educationRequired: "Master's in Counseling",
        description: 'Provide therapy and mental health support'
      },
      {
        title: 'Child Welfare Specialist',
        salaryRange: '$40K - $65K',
        educationRequired: "Bachelor's in Social Work",
        description: 'Protect children and support families'
      },
      {
        title: 'Community Outreach Coordinator',
        salaryRange: '$40K - $70K',
        educationRequired: "Bachelor's in Social Services",
        description: 'Connect communities with resources'
      },
      {
        title: 'Substance Abuse Counselor',
        salaryRange: '$40K - $70K',
        educationRequired: "Bachelor's/Master's + Certification",
        description: 'Help individuals recover from addiction'
      },
      {
        title: 'Youth Program Director',
        salaryRange: '$45K - $80K',
        educationRequired: "Bachelor's in Social Services",
        description: 'Develop and manage youth programs'
      },
      {
        title: 'Family Therapist',
        salaryRange: '$50K - $85K',
        educationRequired: "Master's in Family Therapy",
        description: 'Provide counseling for family systems'
      },
      {
        title: 'Nonprofit Program Manager',
        salaryRange: '$50K - $85K',
        educationRequired: "Bachelor's/Master's",
        description: 'Manage social service programs'
      }
    ],
    quiz: [
      {
        question: 'How emotionally resilient are you?',
        options: [
          'Very resilient, I can handle difficult situations',
          'Generally resilient with support',
          'I struggle with others\' pain',
          'Still developing resilience'
        ],
        scores: [3, 2, 0, 1]
      },
      {
        question: 'What draws you to human services?',
        options: [
          'Deep desire to help vulnerable populations',
          'Interest in psychology and human behavior',
          'Want to address social justice issues',
          'Personal experience with these services'
        ],
        scores: [3, 3, 3, 3]
      },
      {
        question: 'How do you handle work-life boundaries?',
        options: [
          'Good at setting healthy boundaries',
          'Still learning to balance',
          'Tend to take work home emotionally',
          'Struggle with boundaries'
        ],
        scores: [3, 2, 0, 0]
      }
    ],
    studentProfile: {
      name: 'Jordan Martinez',
      age: 20,
      school: 'Boston University',
      story: 'Growing up in foster care showed me how much social workers matter. I want to reform the system and ensure every kid has an advocate who truly cares.',
      favoritePart: 'Being there for people when they need support most'
    },
    dayInLife: [
      {
        scenario: "A client is in crisis and calling you after hours. What do you do?",
        choices: [
          {
            text: 'Talk them through immediate safety planning',
            outcome: 'Your crisis intervention skills de-escalate the situation.',
            score: 3
          },
          {
            text: 'Direct them to emergency hotline and ER',
            outcome: 'Appropriate boundaries while ensuring safety.',
            score: 2
          },
          {
            text: 'Ignore it to maintain boundaries',
            outcome: 'Boundaries are important, but this misses urgency.',
            score: 0
          }
        ]
      }
    ]
  },
  {
    id: 'information-technology',
    name: 'Information Technology',
    icon: '💻',
    color: 'from-cyan-400 to-blue-600',
    description: 'Design, develop, manage, and support information systems.',
    videoUrl: '/videos/clusters/it.mp4',
    riasecAlignment: ['I', 'R', 'C'],
    careers: [
      {
        title: 'Software Engineer',
        salaryRange: '$80K - $160K',
        educationRequired: "Bachelor's in Computer Science",
        description: 'Design and develop software applications'
      },
      {
        title: 'Cybersecurity Analyst',
        salaryRange: '$75K - $140K',
        educationRequired: "Bachelor's in Cybersecurity/IT",
        description: 'Protect systems from security threats'
      },
      {
        title: 'Data Scientist',
        salaryRange: '$85K - $155K',
        educationRequired: "Bachelor's/Master's in Data Science",
        description: 'Analyze complex data to drive decisions'
      },
      {
        title: 'Network Administrator',
        salaryRange: '$60K - $100K',
        educationRequired: "Bachelor's in IT + Certifications",
        description: 'Manage and maintain computer networks'
      },
      {
        title: 'UX/UI Designer',
        salaryRange: '$70K - $130K',
        educationRequired: "Bachelor's in Design/HCI",
        description: 'Design user-friendly digital interfaces'
      },
      {
        title: 'Database Administrator',
        salaryRange: '$70K - $125K',
        educationRequired: "Bachelor's in Computer Science",
        description: 'Manage and secure organizational databases'
      },
      {
        title: 'Cloud Architect',
        salaryRange: '$90K - $170K',
        educationRequired: "Bachelor's + Cloud Certifications",
        description: 'Design cloud computing strategies'
      },
      {
        title: 'AI/Machine Learning Engineer',
        salaryRange: '$100K - $180K',
        educationRequired: "Master's/PhD in CS/AI",
        description: 'Develop artificial intelligence systems'
      }
    ],
    quiz: [
      {
        question: 'How comfortable are you with coding and programming?',
        options: [
          'Very comfortable, I love it',
          'Learning and enjoying it',
          'Can do basic tasks',
          'Haven\'t tried it yet'
        ],
        scores: [3, 2, 1, 1]
      },
      {
        question: 'What interests you most about technology?',
        options: [
          'Building things and solving problems',
          'How systems work behind the scenes',
          'Cybersecurity and ethical hacking',
          'Data and analytics'
        ],
        scores: [3, 3, 3, 3]
      },
      {
        question: 'How do you handle debugging and troubleshooting?',
        options: [
          'I enjoy the challenge of finding solutions',
          'Can be frustrating but satisfying',
          'Prefer clear instructions',
          'Find it very frustrating'
        ],
        scores: [3, 2, 1, 0]
      }
    ],
    studentProfile: {
      name: 'Emma Liu',
      age: 19,
      school: 'MIT',
      story: 'I taught myself to code at 14 making games. Now I want to use AI and machine learning to solve climate change and build a more sustainable future.',
      favoritePart: 'That feeling when your code finally works perfectly'
    },
    dayInLife: [
      {
        scenario: "Production system is down and customers can't access the app. What's your move?",
        choices: [
          {
            text: 'Check error logs and recent deployments',
            outcome: 'Systematic approach quickly identifies the issue.',
            score: 3
          },
          {
            text: 'Rollback to last stable version immediately',
            outcome: 'Fast action restores service, find root cause later.',
            score: 2
          },
          {
            text: 'Alert team and coordinate response',
            outcome: 'Good communication but delays resolution.',
            score: 1
          }
        ]
      }
    ]
  },
  {
    id: 'law',
    name: 'Law, Public Safety, Corrections & Security',
    icon: '⚖️',
    color: 'from-gray-600 to-gray-800',
    description: 'Plan, manage, and provide legal, public safety, and security services.',
    videoUrl: '/videos/clusters/law.mp4',
    riasecAlignment: ['E', 'S', 'R'],
    careers: [
      {
        title: 'Lawyer/Attorney',
        salaryRange: '$70K - $200K+',
        educationRequired: 'JD + Bar Exam',
        description: 'Represent clients in legal matters'
      },
      {
        title: 'Police Officer',
        salaryRange: '$50K - $90K',
        educationRequired: 'High School + Police Academy',
        description: 'Enforce laws and maintain public safety'
      },
      {
        title: 'Paralegal',
        salaryRange: '$45K - $75K',
        educationRequired: "Associate's/Bachelor's + Certification",
        description: 'Assist lawyers with legal work'
      },
      {
        title: 'Cybersecurity Specialist',
        salaryRange: '$75K - $140K',
        educationRequired: "Bachelor's in Cybersecurity",
        description: 'Protect organizations from cyber threats'
      },
      {
        title: 'Judge',
        salaryRange: '$120K - $200K+',
        educationRequired: 'JD + Legal Experience',
        description: 'Preside over legal proceedings'
      },
      {
        title: 'FBI Agent',
        salaryRange: '$70K - $130K',
        educationRequired: "Bachelor's + Training",
        description: 'Investigate federal crimes'
      },
      {
        title: 'Corrections Officer',
        salaryRange: '$40K - $70K',
        educationRequired: 'High School + Training',
        description: 'Supervise incarcerated individuals'
      },
      {
        title: 'Emergency Management Director',
        salaryRange: '$60K - $110K',
        educationRequired: "Bachelor's in Emergency Management",
        description: 'Plan for and respond to emergencies'
      }
    ],
    quiz: [
      {
        question: 'How do you handle high-pressure situations?',
        options: [
          'I stay calm and think clearly',
          'Can manage with some stress',
          'Find it very challenging',
          'Prefer low-pressure environments'
        ],
        scores: [3, 2, 0, 0]
      },
      {
        question: 'What draws you to this field?',
        options: [
          'Desire to serve and protect',
          'Interest in justice and law',
          'Problem-solving and investigation',
          'Security and stability'
        ],
        scores: [3, 3, 3, 1]
      },
      {
        question: 'How comfortable are you with confrontation?',
        options: [
          'Very comfortable, I handle it well',
          'Can manage when necessary',
          'Prefer to avoid conflict',
          'Makes me very uncomfortable'
        ],
        scores: [3, 2, 0, 0]
      }
    ],
    studentProfile: {
      name: 'Marcus Johnson',
      age: 21,
      school: 'Howard University',
      story: 'Seeing wrongful convictions motivated me to become a public defender. Everyone deserves quality legal representation regardless of income.',
      favoritePart: 'Researching case law and building arguments'
    },
    dayInLife: [
      {
        scenario: "You witness fellow officers using excessive force. What do you do?",
        choices: [
          {
            text: 'Immediately intervene to de-escalate',
            outcome: 'Brave action that prevents harm and builds trust.',
            score: 3
          },
          {
            text: 'Report it through proper channels',
            outcome: 'Important but situation already escalated.',
            score: 2
          },
          {
            text: 'Stay silent to avoid trouble',
            outcome: 'This perpetuates systemic problems.',
            score: 0
          }
        ]
      }
    ]
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: '🏭',
    color: 'from-gray-400 to-blue-600',
    description: 'Plan, manage, and perform the processing of materials into products.',
    videoUrl: '/videos/clusters/manufacturing.mp4',
    riasecAlignment: ['R', 'I', 'C'],
    careers: [
      {
        title: 'Manufacturing Engineer',
        salaryRange: '$65K - $115K',
        educationRequired: "Bachelor's in Engineering",
        description: 'Optimize manufacturing processes'
      },
      {
        title: 'Quality Control Inspector',
        salaryRange: '$40K - $70K',
        educationRequired: 'High School + Training',
        description: 'Ensure product quality standards'
      },
      {
        title: 'Industrial Designer',
        salaryRange: '$60K - $105K',
        educationRequired: "Bachelor's in Industrial Design",
        description: 'Design products for manufacturing'
      },
      {
        title: 'Production Manager',
        salaryRange: '$70K - $120K',
        educationRequired: "Bachelor's in Engineering/Business",
        description: 'Oversee manufacturing operations'
      },
      {
        title: 'Robotics Technician',
        salaryRange: '$50K - $85K',
        educationRequired: "Associate's in Robotics",
        description: 'Maintain and program manufacturing robots'
      },
      {
        title: 'Supply Chain Analyst',
        salaryRange: '$60K - $100K',
        educationRequired: "Bachelor's in Supply Chain",
        description: 'Optimize materials and logistics'
      },
      {
        title: 'CNC Machinist',
        salaryRange: '$45K - $75K',
        educationRequired: 'Technical School/Apprenticeship',
        description: 'Operate computer-controlled machines'
      },
      {
        title: 'Sustainability Engineer',
        salaryRange: '$70K - $125K',
        educationRequired: "Bachelor's in Engineering",
        description: 'Develop eco-friendly manufacturing'
      }
    ],
    quiz: [
      {
        question: 'How interested are you in how things are made?',
        options: [
          'Very interested, I love understanding processes',
          'Moderately interested',
          'Not particularly interested',
          'Never really thought about it'
        ],
        scores: [3, 2, 0, 0]
      },
      {
        question: 'What appeals to you about manufacturing?',
        options: [
          'Working with machines and technology',
          'Optimizing efficiency',
          'Creating tangible products',
          'Problem-solving production issues'
        ],
        scores: [3, 3, 3, 3]
      },
      {
        question: 'How detail-oriented are you?',
        options: [
          'Extremely detail-oriented',
          'Generally attentive to details',
          'Focus on big picture',
          'Details aren\'t my strength'
        ],
        scores: [3, 2, 1, 0]
      }
    ],
    studentProfile: {
      name: 'Tyler Wong',
      age: 18,
      school: 'Georgia Tech',
      story: 'Touring a Tesla factory blew my mind. I want to be part of the automation revolution and make manufacturing more efficient and sustainable.',
      favoritePart: 'Seeing how automation can solve complex problems'
    },
    dayInLife: [
      {
        scenario: "Production line efficiency dropped 15%. How do you diagnose it?",
        choices: [
          {
            text: 'Analyze data from sensors and systems',
            outcome: 'Data reveals machine needs calibration.',
            score: 3
          },
          {
            text: 'Talk to line workers about changes',
            outcome: 'They report a recent process change caused issues.',
            score: 2
          },
          {
            text: 'Observe the line in person',
            outcome: 'You spot a bottleneck in material flow.',
            score: 3
          }
        ]
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: '📱',
    color: 'from-pink-400 to-red-600',
    description: 'Plan, manage, and perform marketing activities to reach customers.',
    videoUrl: '/videos/clusters/marketing.mp4',
    riasecAlignment: ['E', 'A', 'S'],
    careers: [
      {
        title: 'Marketing Manager',
        salaryRange: '$60K - $130K',
        educationRequired: "Bachelor's in Marketing",
        description: 'Develop and execute marketing strategies'
      },
      {
        title: 'Social Media Manager',
        salaryRange: '$45K - $85K',
        educationRequired: "Bachelor's in Marketing/Communications",
        description: 'Manage brand presence on social platforms'
      },
      {
        title: 'Market Research Analyst',
        salaryRange: '$55K - $95K',
        educationRequired: "Bachelor's in Marketing/Statistics",
        description: 'Analyze market trends and consumer behavior'
      },
      {
        title: 'Brand Manager',
        salaryRange: '$70K - $130K',
        educationRequired: "Bachelor's/MBA",
        description: 'Develop and maintain brand identity'
      },
      {
        title: 'Digital Marketing Specialist',
        salaryRange: '$50K - $95K',
        educationRequired: "Bachelor's in Marketing",
        description: 'Execute online marketing campaigns'
      },
      {
        title: 'Content Creator',
        salaryRange: '$40K - $90K',
        educationRequired: "Bachelor's in Marketing/Communications",
        description: 'Create engaging marketing content'
      },
      {
        title: 'SEO Specialist',
        salaryRange: '$50K - $90K',
        educationRequired: "Bachelor's + Certifications",
        description: 'Optimize websites for search engines'
      },
      {
        title: 'Public Relations Manager',
        salaryRange: '$60K - $120K',
        educationRequired: "Bachelor's in PR/Communications",
        description: 'Manage brand reputation and media relations'
      }
    ],
    quiz: [
      {
        question: 'How creative are you with messaging and storytelling?',
        options: [
          'Very creative, I love crafting messages',
          'Fairly creative when needed',
          'More analytical than creative',
          'Not particularly creative'
        ],
        scores: [3, 2, 1, 0]
      },
      {
        question: 'What interests you most about marketing?',
        options: [
          'Understanding consumer psychology',
          'Creative campaigns and branding',
          'Data analytics and metrics',
          'Social media and trends'
        ],
        scores: [3, 3, 3, 3]
      },
      {
        question: 'How do you feel about constant change and trends?',
        options: [
          'I love staying on top of trends',
          'Can adapt to changes',
          'Prefer stability',
          'Change is stressful'
        ],
        scores: [3, 2, 0, 0]
      }
    ],
    studentProfile: {
      name: 'Sophie Taylor',
      age: 20,
      school: 'USC',
      story: 'I went viral on TikTok explaining marketing psychology and realized I could turn my passion into a career. I want to help brands connect authentically with Gen Z.',
      favoritePart: 'Seeing a campaign idea come to life and resonate'
    },
    dayInLife: [
      {
        scenario: "Your campaign isn't performing well. The CEO wants answers. What do you say?",
        choices: [
          {
            text: 'Present data on what\'s not working and solutions',
            outcome: 'Evidence-based approach builds confidence.',
            score: 3
          },
          {
            text: 'Explain the campaign needs more time',
            outcome: 'Valid point but doesn\'t address poor performance.',
            score: 1
          },
          {
            text: 'Propose pivot based on early learnings',
            outcome: 'Agile approach shows you\'re proactive.',
            score: 3
          }
        ]
      }
    ]
  },
  {
    id: 'stem',
    name: 'Science, Technology, Engineering & Mathematics',
    icon: '🔬',
    color: 'from-green-400 to-blue-600',
    description: 'Plan, manage, and provide scientific research and technical services.',
    videoUrl: '/videos/clusters/stem.mp4',
    riasecAlignment: ['I', 'R', 'A'],
    careers: [
      {
        title: 'Research Scientist',
        salaryRange: '$70K - $130K',
        educationRequired: 'PhD in Science',
        description: 'Conduct scientific research and experiments'
      },
      {
        title: 'Software Engineer',
        salaryRange: '$80K - $160K',
        educationRequired: "Bachelor's in Computer Science",
        description: 'Design and develop software systems'
      },
      {
        title: 'Biomedical Engineer',
        salaryRange: '$70K - $125K',
        educationRequired: "Bachelor's in Biomedical Engineering",
        description: 'Develop medical devices and technologies'
      },
      {
        title: 'Data Scientist',
        salaryRange: '$85K - $155K',
        educationRequired: "Master's in Data Science",
        description: 'Extract insights from complex data'
      },
      {
        title: 'Aerospace Engineer',
        salaryRange: '$80K - $145K',
        educationRequired: "Bachelor's in Aerospace Engineering",
        description: 'Design aircraft and spacecraft'
      },
      {
        title: 'Environmental Scientist',
        salaryRange: '$55K - $100K',
        educationRequired: "Bachelor's in Environmental Science",
        description: 'Study environmental problems and solutions'
      },
      {
        title: 'Robotics Engineer',
        salaryRange: '$75K - $135K',
        educationRequired: "Bachelor's in Robotics/Mechanical Eng",
        description: 'Design and build robotic systems'
      },
      {
        title: 'Mathematician',
        salaryRange: '$75K - $135K',
        educationRequired: "Master's/PhD in Mathematics",
        description: 'Develop mathematical theories and models'
      }
    ],
    quiz: [
      {
        question: 'How do you feel about math and science?',
        options: [
          'Love them, they\'re my strongest subjects',
          'Enjoy them and do well',
          'They\'re okay, not my favorites',
          'Find them very challenging'
        ],
        scores: [3, 2, 1, 0]
      },
      {
        question: 'What excites you about STEM?',
        options: [
          'Solving complex problems',
          'Making scientific discoveries',
          'Building innovative technology',
          'The intellectual challenge'
        ],
        scores: [3, 3, 3, 3]
      },
      {
        question: 'How persistent are you with difficult problems?',
        options: [
          'Very persistent, I don\'t give up',
          'Generally stick with it',
          'Depends on my interest',
          'Get frustrated easily'
        ],
        scores: [3, 2, 1, 0]
      }
    ],
    studentProfile: {
      name: 'Raj Sharma',
      age: 19,
      school: 'Caltech',
      story: 'After building my first robot in 8th grade, I was hooked. I want to work on AI and robotics that can help people with disabilities live more independently.',
      favoritePart: 'The moment when a hypothesis is confirmed through experiment'
    },
    dayInLife: [
      {
        scenario: "Your experiment failed for the 10th time. What now?",
        choices: [
          {
            text: 'Review methodology and variables systematically',
            outcome: 'You find a contamination issue affecting results.',
            score: 3
          },
          {
            text: 'Try a completely different approach',
            outcome: 'Fresh perspective leads to breakthrough.',
            score: 2
          },
          {
            text: 'Consult with colleagues and literature',
            outcome: 'Similar studies reveal what you\'re missing.',
            score: 3
          }
        ]
      }
    ]
  },
  {
    id: 'transportation',
    name: 'Transportation, Distribution & Logistics',
    icon: '🚚',
    color: 'from-blue-400 to-gray-600',
    description: 'Plan, manage, and move people, materials, and goods.',
    videoUrl: '/videos/clusters/transportation.mp4',
    riasecAlignment: ['R', 'C', 'E'],
    careers: [
      {
        title: 'Logistics Manager',
        salaryRange: '$60K - $115K',
        educationRequired: "Bachelor's in Supply Chain/Logistics",
        description: 'Coordinate movement of goods and materials'
      },
      {
        title: 'Transportation Planner',
        salaryRange: '$55K - $95K',
        educationRequired: "Bachelor's in Urban Planning/Engineering",
        description: 'Design transportation systems and networks'
      },
      {
        title: 'Supply Chain Analyst',
        salaryRange: '$60K - $105K',
        educationRequired: "Bachelor's in Supply Chain",
        description: 'Optimize supply chain operations'
      },
      {
        title: 'Pilot',
        salaryRange: '$80K - $200K+',
        educationRequired: 'Commercial Pilot License + Training',
        description: 'Operate aircraft for transport'
      },
      {
        title: 'Fleet Manager',
        salaryRange: '$55K - $95K',
        educationRequired: "Bachelor's in Business/Logistics",
        description: 'Manage vehicle fleets and maintenance'
      },
      {
        title: 'Warehouse Manager',
        salaryRange: '$50K - $90K',
        educationRequired: "Bachelor's or Experience",
        description: 'Oversee warehouse operations'
      },
      {
        title: 'Air Traffic Controller',
        salaryRange: '$75K - $140K',
        educationRequired: 'FAA Training Program',
        description: 'Direct aircraft traffic safely'
      },
      {
        title: 'Urban Mobility Consultant',
        salaryRange: '$65K - $120K',
        educationRequired: "Master's in Urban Planning",
        description: 'Design sustainable transportation solutions'
      }
    ],
    quiz: [
      {
        question: 'How organized are you with complex systems?',
        options: [
          'Very organized, I love systematizing',
          'Generally organized',
          'Can be organized when needed',
          'Organization is challenging for me'
        ],
        scores: [3, 2, 1, 0]
      },
      {
        question: 'What interests you about this field?',
        options: [
          'Optimizing efficiency and flow',
          'Problem-solving logistics challenges',
          'Impact on global commerce',
          'Technology and automation'
        ],
        scores: [3, 3, 3, 3]
      },
      {
        question: 'How comfortable are you with time pressure?',
        options: [
          'Thrive under deadline pressure',
          'Can handle it when necessary',
          'Prefer less time-sensitive work',
          'Time pressure stresses me greatly'
        ],
        scores: [3, 2, 1, 0]
      }
    ],
    studentProfile: {
      name: 'Kevin Anderson',
      age: 20,
      school: 'Georgia Tech',
      story: 'After learning about supply chain disruptions during COVID, I became fascinated by logistics. I want to build more resilient supply chains using AI and data.',
      favoritePart: 'Optimizing routes and seeing efficiency improvements'
    },
    dayInLife: [
      {
        scenario: "A major shipment is delayed and customers are waiting. What do you do?",
        choices: [
          {
            text: 'Find alternative routes or carriers immediately',
            outcome: 'Quick thinking minimizes delays.',
            score: 3
          },
          {
            text: 'Communicate proactively with all stakeholders',
            outcome: 'Transparency builds trust despite issue.',
            score: 2
          },
          {
            text: 'Analyze root cause to prevent future delays',
            outcome: 'Important but doesn\'t address current crisis.',
            score: 1
          }
        ]
      }
    ]
  }
]

// RIASEC to Career Cluster recommendations
export const RIASEC_CLUSTER_RECOMMENDATIONS: Record<string, string[]> = {
  'R': ['agriculture', 'architecture', 'manufacturing', 'transportation'],
  'I': ['stem', 'health', 'information-technology', 'agriculture'],
  'A': ['arts', 'architecture', 'marketing', 'education'],
  'S': ['education', 'human-services', 'health', 'government'],
  'E': ['business', 'marketing', 'law', 'hospitality'],
  'C': ['finance', 'business', 'information-technology', 'government']
}

export function getRecommendedClusters(riasecCode: string): string[] {
  if (!riasecCode) return []
  
  const letters = riasecCode.split('')
  const recommended = new Set<string>()
  
  letters.forEach(letter => {
    const clusters = RIASEC_CLUSTER_RECOMMENDATIONS[letter] || []
    clusters.forEach(cluster => recommended.add(cluster))
  })
  
  return Array.from(recommended).slice(0, 8)
}
