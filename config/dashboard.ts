import { UserRole } from "@prisma/client";

import { SidebarNavItem } from "types";

export const sidebarLinks: SidebarNavItem[] = [
  {
    title: "MENU",
    items: [
      {
        href: "/admin",
        icon: "laptop",
        title: "Admin Panel",
        authorizeOnly: UserRole.ADMIN,
      },
      {
        href: "/interviews",
        icon: "interviews",
        title: "Interviews",
        authorizeOnly: UserRole.USER,
      },
      {
        href: "/interviews/history",
        icon: "history",
        title: "History",
        authorizeOnly: UserRole.USER,
      },
      // {
      //   href: "/resumes",
      //   icon: "fileText",
      //   title: "My Resumes",
      //   authorizeOnly: UserRole.USER,
      //   disabled: true,
      // },
      // {
      //   href: "/builder",
      //   icon: "filePenLine",
      //   title: "Resume builder",
      //   authorizeOnly: UserRole.USER,
      //   disabled: true,
      // },

      {
        href: "/billing",
        icon: "billing",
        title: "Billing",
        authorizeOnly: UserRole.USER,
      },

      // { href: "/charts", icon: "lineChart", title: "Charts" },
      {
        href: "/admin/orders",
        icon: "package",
        title: "Orders",
        badge: 2,
        authorizeOnly: UserRole.ADMIN,
      },
      // {
      //   href: "#/dashboard/posts",
      //   icon: "post",
      //   title: "User Posts",
      //   authorizeOnly: UserRole.USER,
      //   disabled: true,
      // },
    ],
  },
  {
    title: "OPTIONS",
    items: [
      { href: "/settings", icon: "settings", title: "Settings" },
      // { href: "/", icon: "home", title: "Homepage" },
      // { href: "/docs", icon: "bookOpen", title: "Documentation" },
      {
        href: "/support",
        icon: "messages",
        title: "Support",
        authorizeOnly: UserRole.USER,
        disabled: true,
      },
    ],
  },
];
