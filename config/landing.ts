import { FeatureLdg, InfoLdg, TestimonialType } from "types";

export const infos: InfoLdg[] = [
  {
    title: "AI-Powered Interview Excellence",
    description:
      "Experience the future of interview preparation with our advanced AI platform. Get personalized questions, real-time feedback, and expert analysis tailored to your specific role and experience level.",
    image: "/_static/illustrations/work-from-home.jpg",
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
    image: "/_static/illustrations/practice.jpg",
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
    name: "John Doe",
    job: "Software Engineer at Google",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    review:
      "Interview AI was a game-changer in my job search. The AI-generated questions were incredibly relevant to my role, and the instant feedback helped me identify and improve my weak points. I landed my dream job at Google, and I credit a lot of my interview success to this platform.",
  },
  {
    name: "Alice Smith",
    job: "Product Manager at Meta",
    image: "https://randomuser.me/api/portraits/women/2.jpg",
    review:
      "The behavioral interview practice on Interview AI was invaluable. The platform helped me structure my STAR responses better, and the detailed feedback on my communication style made a huge difference. Highly recommend for anyone preparing for PM roles!",
  },
  {
    name: "David Johnson",
    job: "Data Scientist at Amazon",
    image: "https://randomuser.me/api/portraits/men/3.jpg",
    review:
      "The technical questions were spot-on for my field. Being able to practice with voice recognition and get feedback on both my technical accuracy and communication clarity was incredibly helpful.",
  },
  {
    name: "Michael Wilson",
    job: "Frontend Developer at Apple",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    review:
      "The resume analysis feature is brilliant! It generated questions specific to my experience, which helped me prepare for questions about my past projects. The optimal answers provided great insights too.",
  },
  {
    name: "Sophia Garcia",
    job: "DevOps Engineer at Microsoft",
    image: "https://randomuser.me/api/portraits/women/6.jpg",
    review:
      "As someone who gets nervous during interviews, having a safe space to practice was crucial. The AI feedback helped me improve my confidence and technical communication significantly.",
  },
  {
    name: "Emily Brown",
    job: "Senior Product Designer at Spotify",
    image: "https://randomuser.me/api/portraits/women/4.jpg",
    review:
      "The platform's ability to adapt questions based on my performance helped me prepare for increasingly challenging interviews. The design-specific questions were particularly helpful for my UX/UI role interviews.",
  },
  {
    name: "Jason Stan",
    job: "Full Stack Developer at Netflix",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
    review:
      "Interview AI's comprehensive coverage of both technical and soft skills made my interview preparation much more effective. The performance tracking helped me focus on areas where I needed the most improvement.",
  },
];
