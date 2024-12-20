import * as React from "react";
import Link from "next/link";

import { footerLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/layout/mode-toggle";

import { Icons } from "../shared/icons";
import { ProductHuntBadge } from "../shared/product-hunt-badge";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn("border-t bg-background", className)}>
      <div className="mx-auto w-full max-w-7xl px-4 py-16">
        <div className="flex flex-col items-center gap-16">
          <ProductHuntBadge />

          {/* Newsletter Section - Centered */}
          {/* <div className="w-full max-w-lg space-y-4 text-center">
            <h3 className="text-sm font-semibold tracking-wider">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground/80">
              Subscribe to our newsletter for updates and exclusive content.
            </p>
            <NewsletterForm />
          </div> */}

          {/* Main Footer Content - Two Columns */}
          <div className="flex w-full max-w-2xl flex-col gap-14 sm:flex-row">
            {/* Brand Section */}
            <div className="flex flex-col items-center space-y-4 text-center sm:items-start sm:text-left">
              <Link href="/" className="flex items-center space-x-2">
                <Icons.logo className="size-8" />
                <span className="font-urban text-xl font-bold">
                  {siteConfig.name}
                </span>
              </Link>
              <p className="text-sm text-muted-foreground/80">
                {siteConfig.description}
              </p>
              <div className="flex items-center space-x-3">
                {Object.entries(siteConfig.links).map(([platform, url]) => {
                  const Icon = Icons[platform as keyof typeof Icons];
                  return (
                    <Link
                      href={url}
                      key={platform}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                      >
                        <Icon className="size-4" />
                        <span className="sr-only">{platform}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Navigation Links Grid */}
            <div className="grid gap-8 text-center sm:grid-cols-2 sm:text-left">
              {footerLinks.map((section) => (
                <div key={section.title} className="space-y-4">
                  <h3 className="text-sm font-semibold tracking-wider">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.items?.map((link) => (
                      <li key={link.title}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground/80 transition-colors hover:text-primary"
                        >
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex w-full items-center justify-between px-2">
            <p className="text-center text-sm text-muted-foreground/80">
              © {new Date().getFullYear()} {siteConfig.name}. All rights
              reserved.
            </p>
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
