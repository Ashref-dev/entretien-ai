import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Brain,
  Briefcase,
  Building,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  FileClock,
  FileText,
  HelpCircle,
  Home,
  Image,
  Laptop,
  LayoutPanelLeft,
  LineChart,
  Loader2,
  LucideIcon,
  LucideProps,
  MessageCircle,
  MessagesSquare,
  MessagesSquareIcon,
  Mic,
  Moon,
  MoreVertical,
  Package,
  PieChart,
  Plus,
  Search,
  Settings,
  SunMedium,
  Trash,
  TrendingUp,
  User,
  X,
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  add: Plus,
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  billing: CreditCard,
  interviews: MessagesSquareIcon,
  bookOpen: BookOpen,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  check: Check,
  close: X,
  copy: Copy,
  dashboard: LayoutPanelLeft,
  ellipsis: MoreVertical,
  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),
  google: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="google"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 488 512"
      {...props}
    >
      <path
        d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        fill="currentColor"
      />
    </svg>
  ),
  nextjs: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="nextjs"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 15 15"
      {...props}
    >
      <path
        fill="currentColor"
        d="m4.5 4.5l.405-.293A.5.5 0 0 0 4 4.5zm3 9.5A6.5 6.5 0 0 1 1 7.5H0A7.5 7.5 0 0 0 7.5 15zM14 7.5A6.5 6.5 0 0 1 7.5 14v1A7.5 7.5 0 0 0 15 7.5zM7.5 1A6.5 6.5 0 0 1 14 7.5h1A7.5 7.5 0 0 0 7.5 0zm0-1A7.5 7.5 0 0 0 0 7.5h1A6.5 6.5 0 0 1 7.5 1zM5 12V4.5H4V12zm-.905-7.207l6.5 9l.81-.586l-6.5-9zM10 4v6h1V4z"
      ></path>
    </svg>
  ),
  help: HelpCircle,
  home: Home,
  history: FileClock,
  laptop: Laptop,
  lineChart: LineChart,
  logo: ({ ...props }: LucideProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 396 482"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M104.006 23.1401C111.176 12.7894 121.839 2.65698 135.183 2.37639C174.496 -0.647761 214.091 -0.647761 253.436 1.59697C270.303 1.00461 285.673 11.8541 294.122 25.8525C303.132 42.9374 296.678 62.8593 300.856 81.0666C323.085 81.7837 346.218 78.5101 367.543 86.4602C384.753 94.0985 396.475 113.023 395.477 131.885C395.322 193.209 395.29 254.565 395.477 315.89C396.226 339.553 387.714 363.653 371.69 381.205C343.007 411.759 313.981 442 284.925 472.179C280.435 476.669 275.104 480.441 268.869 482C260.077 480.94 251.222 474.736 250.162 465.445C248.074 447.051 250.412 428.407 249.102 409.95C249.009 396.264 235.354 385.227 222.041 385.976C164.925 385.882 107.809 386.038 50.6934 385.944C36.4145 386.069 22.2602 380.145 12.6889 369.483C2.43176 358.54 0.405298 342.796 0 328.423C0.187061 263.918 -0.124715 199.414 0.187053 134.909C0.062346 115.579 9.32182 95.0649 27.7785 87.0213C49.4775 78.1048 73.4837 82.0331 96.3051 80.9731C96.9598 61.6435 92.6574 40.2873 104.006 23.1401ZM133.998 46.1798C132.439 57.7463 133.655 69.4376 133.343 81.0666C176.18 81.4719 219.017 81.1289 261.823 81.2848C262.041 67.6606 262.353 54.0051 260.95 40.4121C253.405 38.4791 245.735 36.8579 237.91 37.1385C208.729 37.4814 179.547 37.1073 150.366 37.2632C144.099 37.232 135.494 39.0403 133.998 46.1798ZM40.0621 121.409C38.4409 127.894 36.9756 134.472 37.1315 141.175C37.3186 203.654 37.2251 266.101 37.1004 328.548C37.2874 335.344 37.911 343.45 43.6475 348.002C47.9811 348.906 52.4393 348.813 56.8353 348.906C110.958 348.875 165.081 349 219.173 348.813C241.215 348.501 263.911 358.509 276.257 377.184C283.428 387.753 285.174 400.691 288.884 412.663C300.669 405.243 307.933 393.053 317.598 383.357C333.81 366.397 356.881 350.746 358.065 324.994C358.72 270.029 357.816 215.002 358.284 160.037C358.065 148.221 359.125 136.312 357.317 124.621C353.015 118.572 344.472 118.603 337.769 118.292C248.354 118.323 158.939 118.385 69.493 118.26C59.5788 117.824 49.5711 118.292 40.0621 121.409Z"
        fill="url(#paint0_linear_10_13)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_10_13"
          x1="-15.5164"
          y1="5.61233"
          x2="216.9"
          y2="493.555"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#36CDE1" />
          <stop offset="1" stopColor="#994BFF" />
        </linearGradient>
      </defs>
    </svg>
  ),
  media: Image,
  messages: MessagesSquare,
  moon: Moon,
  package: Package,
  page: File,
  fileText: FileText,
  mic: Mic,
  messageSquare: MessagesSquare,
  post: FileText,
  search: Search,
  settings: Settings,
  spinner: Loader2,
  sun: SunMedium,
  trash: Trash,
  twitter: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="twitter"
      role="img"
      {...props}
    >
      <path
        d="M14.258 10.152L23.176 0h-2.113l-7.747 8.813L7.133 0H0l9.352 13.328L0 23.973h2.113l8.176-9.309 6.531 9.309h7.133zm-2.895 3.293l-.949-1.328L2.875 1.56h3.246l6.086 8.523.945 1.328 7.91 11.078h-3.246zm0 0"
        fill="currentColor"
      />
    </svg>
  ),
  user: User,
  warning: AlertTriangle,
  briefcase: Briefcase,
  messageCircle: MessageCircle,
  brain: Brain,
  "trending-up": TrendingUp,
  award: Award,
  pieChart: PieChart,
  buildings: Building,
};
