import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience. Let's begin with our first question.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en",
  },
  voice: {
    provider: "11labs",
    voiceId: "sarah",
    stability: 0.5,
    similarityBoost: 0.8,
    speed: 0.8,
    style: 0.4,
    useSpeakerBoost: true,
  },
  model: {
    provider: "openai",
    model: "gpt-3.5-turbo", // Using cheaper model to avoid quota issues
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

IMPORTANT INTERVIEW RULES:
1. Ask questions from this specific list ONE AT A TIME:
{{questions}}

2. ALWAYS wait for the candidate's complete response before asking the next question
3. Do NOT continue talking or answer for the candidate
4. Listen actively and acknowledge their response briefly before moving to the next question
5. Ask brief clarifying follow-up questions only if their response is unclear
6. Keep your responses SHORT and conversational (this is voice, not text)

Interview Flow:
- Start with the first question from the list
- Wait for their full response
- Give brief acknowledgment (e.g., "Thank you for that insight")
- Move to the next question
- Continue until all questions are covered

Professional Guidelines:
- Be warm but professional
- Keep responses under 2 sentences
- Don't ramble or give long explanations
- Focus on listening, not talking
- End professionally when all questions are complete

Remember: Your primary job is to ASK questions and LISTEN, not to dominate the conversation.`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews: Interview[] = [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];

export const staticInterviewTemplates = [
  {
    id: "backend-template-1",
    userId: "",
    role: "Backend Developer",
    type: "Technical",
    techstack: ["Node.js", "Express", "MongoDB", "Docker", "AWS"],
    level: "Mid-Level",
    questions: [],
    finalized: true,
    createdAt: new Date().toISOString(),
    companyImage: "/covers/amazon.png",
  },
  {
    id: "fullstack-template-1",
    userId: "",
    role: "Fullstack Developer",
    type: "Mixed",
    techstack: ["React", "Node.js", "PostgreSQL", "TypeScript", "Next.js"],
    level: "Senior",
    questions: [],
    finalized: true,
    createdAt: new Date().toISOString(),
    companyImage: "/covers/facebook.png",
  },
  {
    id: "devops-template-1",
    userId: "",
    role: "DevOps Engineer",
    type: "Technical",
    techstack: ["Docker", "Kubernetes", "AWS", "Terraform", "Jenkins"],
    level: "Mid-Level",
    questions: [],
    finalized: true,
    createdAt: new Date().toISOString(),
    companyImage: "/covers/spotify.png",
  },
  {
    id: "backend-template-2",
    userId: "",
    role: "Backend Developer",
    type: "Technical",
    techstack: ["Python", "Django", "Redis", "PostgreSQL", "Docker"],
    level: "Senior",
    questions: [],
    finalized: true,
    createdAt: new Date().toISOString(),
    companyImage: "/covers/reddit.png",
  },
  {
    id: "fullstack-template-2",
    userId: "",
    role: "Fullstack Developer",
    type: "Mixed",
    techstack: ["Vue.js", "Express", "MongoDB", "TypeScript", "AWS"],
    level: "Mid-Level",
    questions: [],
    finalized: true,
    createdAt: new Date().toISOString(),
    companyImage: "/covers/pinterest.png",
  },
  {
    id: "devops-template-2",
    userId: "",
    role: "DevOps Engineer",
    type: "Technical",
    techstack: ["Azure", "Ansible", "Docker", "Prometheus", "Grafana"],
    level: "Senior",
    questions: [],
    finalized: true,
    createdAt: new Date().toISOString(),
    companyImage: "/covers/telegram.png",
  },
] as const;
