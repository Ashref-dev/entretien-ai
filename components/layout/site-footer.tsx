import * as React from "react";
import Link from "next/link";

import { footerLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/layout/mode-toggle";

import { NewsletterForm } from "../forms/newsletter-form";
import { Icons } from "../shared/icons";

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer
      className={cn(
        "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      {/* Main Footer Content */}
      <div className="container grid max-w-6xl grid-cols-2 gap-8 py-16 md:grid-cols-5">
        {/* Navigation Links */}
        {footerLinks.map((section) => (
          <div key={section.title} className="space-y-3">
            <Link href="/" className="flex items-center space-x-2">
              <Icons.logo className="size-7" />
              <span className="font-urban text-xl font-bold">
                {siteConfig.name}
              </span>
            </Link>
            <h3 className="text-sm font-semibold tracking-wider text-foreground">
              {section.title}
            </h3>
            <ul className="space-y-3">
              {section.items?.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter Section */}
        <div className="col-span-full space-y-4 md:col-span-2">
          <h3 className="text-sm font-semibold tracking-wider text-foreground">
            Subscribe to our newsletter
          </h3>
          <p className="text-sm text-muted-foreground">
            Get the latest updates and exclusive offers directly in your inbox.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t bg-muted/50">
        <div className="container flex max-w-6xl flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row md:py-0">
          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground md:text-left">
            <span>
              © {new Date().getFullYear()} {siteConfig.name}.
            </span>
            <span className="mx-1">All rights reserved.</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icons.gitHub className="size-5" />
              <span className="sr-only">GitHub</span>
            </Link>

            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icons.xTwitter className="size-5" />
              <span className="sr-only">Twitter</span>
            </Link>

            <div className="h-4 w-px bg-border" />
            <ModeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
