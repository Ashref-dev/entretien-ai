import * as React from "react";
import Link from "next/link";

import { footerLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
      <div className="mx-auto w-full max-w-7xl px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand Section */}
          <div className="space-y-4 lg:col-span-2">
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
              <Button variant="outline" size="icon" className="rounded-full">
                <Link href={siteConfig.links.github}>
                  <Icons.gitHub className="size-4" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Link href={siteConfig.links.twitter}>
                  <Icons.xTwitter className="size-4" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </Button>
            </div>
          </div>

          {/* Navigation Links */}
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

          {/* Newsletter Section */}
          <div className="space-y-4 lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wider">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground/80">
              Subscribe to our newsletter for updates and exclusive content.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <p className="text-center text-sm text-muted-foreground/80">
            © {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </p>
          <ModeToggle />
        </div>
      </div>
    </footer>
  );
}
