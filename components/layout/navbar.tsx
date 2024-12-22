"use client";

import { useContext } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

import { marketingConfig } from "@/config/marketing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ModalContext } from "@/components/modals/providers";
import { Icons } from "@/components/shared/icons";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

import { ModeToggle } from "./mode-toggle";

interface NavBarProps {
  scroll?: boolean;
  large?: boolean;
}

export function NavBar({ scroll = false }: NavBarProps) {
  const scrolled = useScroll(50);
  const { data: session, status } = useSession();
  const { setShowSignInModal } = useContext(ModalContext);
  const { t } = useTranslation();

  const selectedLayout = useSelectedLayoutSegment();
  const documentation = selectedLayout === "docs";

  const links = marketingConfig.mainNav;

  return (
    <header
      className={`sticky top-0 z-[999] flex w-full animate-fade-down justify-center bg-background/60 opacity-0 backdrop-blur-xl transition-all [animation-delay:2200ms] ${
        scroll ? (scrolled ? "border-b" : "bg-transparent") : "border-b"
      }`}
    >
      <MaxWidthWrapper
        className="flex h-14 items-center justify-between py-4"
        large={documentation}
      >
        {/* Left section: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="size-7" />
            <span className="font-urban text-xl font-bold">
              {siteConfig.name}
            </span>
          </Link>
        </div>

        {/* Center section: Navigation links (hidden on mobile) */}
        <div className="hidden justify-center md:flex">
          {links && links.length > 0 ? (
            <nav className="flex gap-6">
              {links.map((item, index) => (
                <Link
                  key={index}
                  href={item.disabled ? "#" : item.href}
                  prefetch={true}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                    item.href.startsWith(`/${selectedLayout}`)
                      ? "text-foreground"
                      : "text-foreground/80",
                    item.disabled && "cursor-not-allowed opacity-80",
                  )}
                >
                  {t(`navigation.${item.title.toLowerCase()}`)}
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
        {/* Right section: User actions */}
        <div className="flex items-center space-x-3">
          <ModeToggle />
          <LanguageSwitcher />

          {session ? (
            <Link
              href={session.user.role === "ADMIN" ? "/admin" : "/interviews"}
              className="hidden md:block"
            >
              <Button
                className="gap-2 px-5"
                variant="default"
                size="sm"
                rounded="full"
              >
                <span>{t("interview.start")}</span>
                <LogIn className="size-4" />
              </Button>
            </Link>
          ) : status === "unauthenticated" ? (
            <Button
              className="hidden gap-2 px-5 md:flex"
              variant="default"
              size="sm"
              rounded="full"
              onClick={() => setShowSignInModal(true)}
            >
              <span>{t("auth.signIn")}</span>
              <Icons.arrowRight className="size-4" />
            </Button>
          ) : (
            <Skeleton className="hidden h-9 w-28 rounded-full lg:flex" />
          )}
        </div>
      </MaxWidthWrapper>
    </header>
  );
}
