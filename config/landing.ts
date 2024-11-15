import { FeatureLdg, InfoLdg, TestimonialType } from "types";

export const infos: InfoLdg[] = [
  {
    title: "AI-Powered Interview Prep",
    description:
      "Practice with an AI that thinks like a senior interviewer. Get role-specific questions and expert feedback that's indistinguishable from real tech interviews at FAANG companies.",
    image: "/_static/landing/shot4.webp",
    list: [
      {
        title: "Industry-Specific Training",
        description:
          "Tailored questions for Software Engineering, Data Science, Product Management and more.",
        icon: "briefcase",
      },
      {
        title: "Real-Time Performance Analysis",
        description:
          "Get instant feedback on technical accuracy, communication clarity, and delivery confidence.",
        icon: "messageCircle",
      },
      {
        title: "FAANG-Level Preparation",
        description:
          "Practice with questions sourced from actual interviews at top tech companies.",
        icon: "brain",
      },
    ],
  },
  {
    title: "Land Your Dream Tech Role",
    description:
      "Turn practice into job offers. Our platform analyzes your responses, identifies improvement areas, and provides actionable feedback that helps you stand out in technical and behavioral interviews.",
    image: "/_static/landing/shot5.webp",
    list: [
      {
        title: "Personalized Learning Path",
        description:
          "AI adapts questions based on your experience level and previous responses.",
        icon: "trending-up",
      },
      {
        title: "Success Blueprints",
        description:
          "Access proven answer frameworks from candidates who landed $200K+ offers.",
        icon: "award",
      },
      {
        title: "Interview Analytics",
        description:
          "Track confidence scores, technical accuracy, and communication improvements across sessions.",
        icon: "pieChart",
      },
    ],
  },
];

export const features: FeatureLdg[] = [
  {
    title: "Smart Resume Analysis",
    description:
      "Our AI reads your resume and generates interview questions matching your exact experience level and tech stack.",
    link: "/features/resume-analysis",
    icon: "fileText",
  },
  {
    title: "Advanced Speech Analysis",
    description:
      "Eliminate filler words and perfect your delivery with real-time feedback on pace, clarity, and confidence.",
    link: "/features/voice-recognition",
    icon: "mic",
  },
  {
    title: "Success Metrics Dashboard",
    description:
      "Visualize your improvement across technical knowledge, communication skills, and interview confidence.",
    link: "/features/analytics",
    icon: "lineChart",
  },
  {
    title: "Senior Interviewer Feedback",
    description:
      "Get detailed feedback on both technical accuracy and soft skills from an AI trained on thousands of successful interviews.",
    link: "/features/feedback",
    icon: "messageSquare",
  },
  {
    title: "Tech Industry Coverage",
    description:
      "Specialized tracks for Frontend, Backend, Full-Stack, DevOps, ML/AI, and other in-demand roles.",
    link: "/features/industries",
    icon: "buildings",
  },
  {
    title: "Progress Tracking",
    description:
      "See your growth with detailed session recordings and improvement analytics over time.",
    link: "/features/history",
    icon: "history",
  },
];

export const testimonials: TestimonialType[] = [
  {
    name: "Alex Chen",
    job: "Software Engineer at Google",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    review:
      "After practicing with Entretien AI for a few weeks, I felt much more confident going into my Google interviews. The technical questions were challenging and relevant, and the feedback on my communication style was eye-opening. It helped me present my solutions more clearly.",
  },
  {
    name: "Sarah Miller",
    job: "Product Manager at CIN Group",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    review:
      "I was struggling with behavioral interviews until I found Entretien AI. The platform taught me how to structure my responses using the STAR method effectively. The instant feedback helped me refine my answers and sound more polished.",
  },
  {
    name: "James Liu",
    job: "Data Scientist at Amazon",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    review:
      "The ML and data science questions were exactly what I needed. Being able to practice explaining complex concepts clearly was invaluable. The platform helped me find the right balance between technical depth and clear communication.",
  },
  {
    name: "Ryan Park",
    job: "Frontend Developer at Apple",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    review:
      "The platform analyzed my resume and generated questions about my React projects and system design experience. This targeted practice helped me feel prepared for the actual interviews. Really impressed with how relevant the questions were.",
  },
  {
    name: "Maya Patel",
    job: "DevOps Engineer at Microsoft",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    review:
      "English isn't my first language, so I was nervous about technical interviews. The speech recognition feature helped me improve my pronunciation and pacing. After a month of practice, I felt much more confident.",
  },
  {
    name: "Emma Thompson",
    job: "Senior Product Designer at Spotify",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    review:
      "The UX design questions were spot-on. I particularly appreciated how the platform helped me articulate my design decisions and process. The feedback on presenting portfolio work was incredibly valuable.",
  },
  {
    name: "Daniel Kim",
    job: "Full Stack Developer at Netflix",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    review:
      "What stood out was how the platform helped me prepare for both frontend and backend questions. The system design scenarios were particularly helpful. I felt well-prepared for all aspects of my Netflix interviews.",
  },
];
