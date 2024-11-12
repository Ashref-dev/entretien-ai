import { FeatureLdg, InfoLdg, TestimonialType } from "types";

export const infos: InfoLdg[] = [
  {
    title: "Interview Excellence",
    description:
      "Experience the future of interview preparation with our advanced AI platform. Get personalized questions, real-time feedback, and expert analysis tailored to your specific role and experience level.",
    image: "/_static/landing/shot1.jpg",
    list: [
      {
        title: "Role-Specific",
        description: "Customized questions for any job position or industry.",
        icon: "briefcase",
      },
      {
        title: "Instant Feedback",
        description: "Real-time analysis and scoring of your responses.",
        icon: "messageCircle",
      },
      {
        title: "Comprehensive",
        description: "Cover technical, behavioral, and soft skills assessment.",
        icon: "brain",
      },
    ],
  },
  {
    title: "Perfect Your Interview Skills",
    description:
      "Practice makes perfect. Our platform provides a safe environment to rehearse your answers, improve your communication, and build confidence for the real interview.",
    image: "/_static/landing/shot2.jpg",
    list: [
      {
        title: "Adaptive Learning",
        description: "Questions adjust based on your performance and progress.",
        icon: "trending-up",
      },
      {
        title: "Expert Guidance",
        description: "Access to optimal answers and industry best practices.",
        icon: "award",
      },
      {
        title: "Detailed Analytics",
        description:
          "Track your improvement with comprehensive performance metrics.",
        icon: "pieChart",
      },
    ],
  },
];

export const features: FeatureLdg[] = [
  {
    title: "Resume Analysis",
    description:
      "AI-powered resume scanning to generate relevant interview questions.",
    link: "/features/resume-analysis",
    icon: "fileText",
  },
  {
    title: "Voice Recognition",
    description:
      "Practice speaking your answers with real-time speech analysis.",
    link: "/features/voice-recognition",
    icon: "mic",
  },
  {
    title: "Performance Tracking",
    description: "Monitor your progress and identify areas for improvement.",
    link: "/features/analytics",
    icon: "lineChart",
  },
  {
    title: "Expert Feedback",
    description:
      "Detailed feedback on technical accuracy and communication skills.",
    link: "/features/feedback",
    icon: "messageSquare",
  },
  {
    title: "Multiple Industries",
    description:
      "Specialized questions for tech, finance, healthcare, and more.",
    link: "/features/industries",
    icon: "buildings",
  },
  {
    title: "Interview History",
    description: "Review past sessions and track your improvement over time.",
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
