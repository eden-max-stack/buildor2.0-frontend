import {
  LeftProfileCard,
  SolvedQuestion,
  ProfessorFeedback,
  AcademicInfo,
  PortfolioProject,
  CurrentProject,
  Achievement,
  ExternalLink,
  CodingStatistics,
  ContributionGrid,
  ProfileProps,
  ContributionLevel,
} from "./models";

// --- LEFT PROFILE CARD ---

export const mockLeftProfileCard: LeftProfileCard = {
  fullName: "Alex Chen",
  username: "alex_dev",
  profileDesc:
    "Full-stack enthusiast building scalable apps. Loves React, Node.js, and coffee. ☕️",
  graduationYear: 2026,
  location: "San Francisco, CA",
  website: "https://alexchen.dev",
  skills: ["React", "TypeScript", "Node.js", "Python", "Tailwind"],
};

// --- SOLVED QUESTIONS ---

export const mockSolvedQuestions: SolvedQuestion[] = [
  {
    id: 1,
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    topic: "Linked List",
    lang: "Python",
    date: "2 days ago",
    hintsUsed: 0,
    runtime: "124ms",
    memory: "18.4MB",
    rank: "Top 5%",
  },
  {
    id: 2,
    title: "Two Sum",
    difficulty: "Easy",
    topic: "Array",
    lang: "JavaScript",
    date: "5 days ago",
    hintsUsed: 1,
    runtime: "54ms",
    memory: "42.1MB",
    rank: "Top 15%",
  },
  {
    id: 3,
    title: "Course Schedule II",
    difficulty: "Medium",
    topic: "Graph",
    lang: "Java",
    date: "1 week ago",
    hintsUsed: 2,
    runtime: "8ms",
    memory: "45.2MB",
    rank: "Top 32%",
  },
  {
    id: 4,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    topic: "String",
    lang: "C++",
    date: "2 weeks ago",
    hintsUsed: 0,
    runtime: "12ms",
    memory: "8.4MB",
    rank: "Top 8%",
  },
  {
    id: 5,
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    topic: "Tree",
    lang: "Python",
    date: "3 weeks ago",
    hintsUsed: 1,
    runtime: "96ms",
    memory: "21.2MB",
    rank: "Top 12%",
  },
  {
    id: 6,
    title: "Valid Parentheses",
    difficulty: "Easy",
    topic: "Stack",
    lang: "TypeScript",
    date: "1 month ago",
    hintsUsed: 0,
    runtime: "48ms",
    memory: "39.8MB",
    rank: "Top 6%",
  },
];

// --- PROFESSOR FEEDBACK ---

export const mockProfessorFeedback: ProfessorFeedback[] = [
  {
    id: 1,
    prof: "Dr. Emily Chen",
    course: "Advanced Algorithms (CS301)",
    date: "Dec 15, 2024",
    comment:
      "Alex demonstrated exceptional understanding of dynamic programming concepts. The final project on genetic algorithms was particularly impressive.",
  },
  {
    id: 2,
    prof: "Prof. Mark Davis",
    course: "Web Systems (CS412)",
    date: "Nov 20, 2024",
    comment:
      "Consistently writes clean, maintainable code. Needs to focus slightly more on documentation standards, but technical execution is flawless.",
  },
  {
    id: 3,
    prof: "Dr. Sarah Johnson",
    course: "Database Systems (CS350)",
    date: "Oct 10, 2024",
    comment:
      "Outstanding work on the database optimization project. Alex showed deep understanding of indexing strategies and query performance tuning.",
  },
];

// --- ACADEMIC INFO ---

export const mockAcademicInfo: AcademicInfo = {
  university: "Tech University",
  degree: "B.S. Computer Science",
  major: "Software Engineering",
  gpa: "3.8/4.0",
  expectedGraduation: "May 2026",
};

// --- PORTFOLIO PROJECTS ---

export const mockPortfolioProjects: PortfolioProject[] = [
  {
    id: 1,
    title: "Resume Parser",
    description: "NLP-powered resume parsing system using Python and spaCy",
    tags: ["Python", "NLP", "Machine Learning"],
    githubUrl: "https://github.com/alex_dev/resume-parser",
    stars: 124,
    language: "Python",
  },
  {
    id: 2,
    title: "Task Tracker Pro",
    description: "Full-stack task management app with real-time collaboration",
    tags: ["React", "Node.js", "MongoDB", "Socket.io"],
    githubUrl: "https://github.com/alex_dev/task-tracker",
    liveUrl: "https://tasktrackerpro.netlify.app",
    stars: 89,
    language: "TypeScript",
  },
  {
    id: 3,
    title: "Algorithm Visualizer",
    description:
      "Interactive visualizations for sorting and pathfinding algorithms",
    tags: ["JavaScript", "D3.js", "Algorithms"],
    githubUrl: "https://github.com/alex_dev/algo-viz",
    liveUrl: "https://algo-viz-alex.vercel.app",
    stars: 203,
    language: "JavaScript",
  },
];

// --- CURRENT PROJECT ---

export const mockCurrentProject: CurrentProject = {
  title: "Resume Parser using NLP",
  description:
    "Building an intelligent resume parsing system with Python and spaCy",
  techStack: ["Python", "spaCy", "FastAPI", "PostgreSQL"],
  status: "in-progress",
};

// --- RECENT ACHIEVEMENT ---

export const mockRecentAchievement: Achievement = {
  id: 1,
  title: "Reached Top 5% in LeetCode Weekly Contest",
  description: "Solved 4/4 problems in Contest 375",
  date: "2 weeks ago",
  type: "contest",
};

// --- EXTERNAL LINKS ---

export const mockExternalLinks: ExternalLink[] = [
  {
    id: 1,
    platform: "GitHub",
    url: "https://github.com/alex_dev",
    username: "alex_dev",
  },
  {
    id: 2,
    platform: "LinkedIn",
    url: "https://linkedin.com/in/alexchen",
    username: "alexchen",
  },
  {
    id: 3,
    platform: "LeetCode",
    url: "https://leetcode.com/alex_dev",
    username: "alex_dev",
  },
];

// --- CODING STATISTICS ---

export const mockCodingStatistics: CodingStatistics = {
  totalQuestionsSolved: 342,
  easyCount: 156,
  mediumCount: 142,
  hardCount: 44,
  totalContests: 23,
  globalRanking: 8234,
  streakDays: 47,
  languagesUsed: ["Python", "JavaScript", "TypeScript", "Java", "C++"],
};

// --- CONTRIBUTION GRID ---

// Helper function to generate random contribution data
const generateContributionGrid = (): ContributionGrid => {
  const data: ContributionLevel[] = Array.from(
    { length: 30 * 7 },
    () => Math.floor(Math.random() * 5) as ContributionLevel,
  );

  const totalContributions = data.reduce<number>(
    (sum, level) => sum + level,
    0,
  );

  return {
    data,
    totalContributions,
  };
};

export const mockContributionGrid: ContributionGrid =
  generateContributionGrid();

// --- COMPLETE PROFILE DATA ---

export const mockProfileData: ProfileProps = {
  leftProfileCard: mockLeftProfileCard,
  contributionGrid: mockContributionGrid,
  solvedQuestions: mockSolvedQuestions,
  professorFeedback: mockProfessorFeedback,
  academicInfo: mockAcademicInfo,
  portfolioProjects: mockPortfolioProjects,
  currentProject: mockCurrentProject,
  recentAchievement: mockRecentAchievement,
  externalLinks: mockExternalLinks,
  statistics: mockCodingStatistics,
};
