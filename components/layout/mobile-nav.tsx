"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useSession } from "next-auth/react";

import { docsConfig } from "@/config/docs";
import { marketingConfig } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { DocsSidebarNav } from "@/components/docs/sidebar-nav";
import { ModalContext } from "@/components/modals/providers";

import { ModeToggle } from "./mode-toggle";

export function NavMobile() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const { setShowSignInModal } = useContext(ModalContext);
  const selectedLayout = useSelectedLayoutSegment();
  const documentation = selectedLayout === "docs";

  const configMap = {
    docs: docsConfig.mainNav,
  };

  const links =
    (selectedLayout && configMap[selectedLayout]) || marketingConfig.mainNav;

  // prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "fixed right-2 top-2.5 z-[1000] rounded-full p-2 transition-all duration-300 ease-in-out hover:bg-muted focus:outline-none active:bg-muted md:hidden",
          open && "hover:bg-muted active:bg-muted",
        )}
      >
        <div className="relative size-5">
          <div
            className={cn(
              "absolute left-0 top-0 flex size-full items-center justify-center transition-all duration-300",
              open ? "rotate-180 opacity-100" : "rotate-0 opacity-0",
            )}
          >
            <X className="size-5 text-muted-foreground" />
          </div>
          <div
            className={cn(
              "absolute left-0 top-0 flex size-full items-center justify-center transition-all duration-300",
              open ? "rotate-180 opacity-0" : "rotate-0 opacity-100",
            )}
          >
            <Menu className="size-5 text-muted-foreground" />
          </div>
        </div>
      </button>

      <nav
        className={cn(
          "fixed inset-0 z-[100] w-full overflow-auto bg-background px-5 py-16 transition-all duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <ul className="grid divide-y divide-muted">
          {links &&
            links.length > 0 &&
            links.map(({ title, href }) => (
              <li key={href} className="py-3">
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="flex w-full font-medium capitalize"
                >
                  {title}
                </Link>
              </li>
            ))}

          {session ? (
            <>
              {session.user.role === "ADMIN" ? (
                <li className="py-3">
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="flex w-full font-medium capitalize"
                  >
                    Admin
                  </Link>
                </li>
              ) : null}

              <li className="py-3">
                <Link
                  href="/interviews"
                  onClick={() => setOpen(false)}
                  className="flex w-full font-medium capitalize"
                >
                  Interviews
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="py-3">
                <button
                  onClick={() => {
                    setOpen(false);
                    setShowSignInModal(true);
                  }}
                  className="flex w-full font-medium capitalize"
                >
                  Sign in
                </button>
              </li>
            </>
          )}
        </ul>

        {documentation ? (
          <div className="mt-8 block md:hidden">
            <DocsSidebarNav setOpen={setOpen} />
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-end space-x-4">
          <ModeToggle />
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-[90] bg-background/80 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />
    </>
  );
}
