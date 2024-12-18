import Link from "next/link";
import { Coffee, Heart } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { MovingBorderButton } from "@/components/ui/moving-border-button";
import { Icons } from "@/components/shared/icons";

export function PleaseDonate() {
  return (
    <section className="container relative mx-auto px-4 py-24 sm:px-6 lg:px-8">
      {/* Background gradient effect */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className={cn(
            "absolute left-1/2 top-1/2 size-[300px]",
            "-translate-x-1/2 -translate-y-1/2 rounded-full",
            "bg-gradient-to-r from-purple-500/30 to-cyan-500/30",
            "animate-blob blur-[100px]",
          )}
        />
      </div>

      <div className="mx-auto max-w-4xl space-y-12">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="animate-fade-up bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-center font-urban text-4xl font-bold tracking-tight text-transparent opacity-0 [animation-delay:100ms] sm:text-5xl md:text-6xl">
            100% Free & Open Source
          </h1>

          <p className="mt-6 animate-fade-up text-balance text-xl text-muted-foreground opacity-0 [animation-delay:300ms]">
            Entretien AI is completely free and open source. We believe everyone
            deserves access to quality interview preparation tools.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Support Card */}
          <Card className="group animate-fade-up rounded-xl border-2 bg-card/50 opacity-0 transition-all duration-300 [animation-delay:500ms] hover:border-amber-500 hover:shadow-lg hover:shadow-amber-500/20">
            <CardContent className="flex h-full flex-col items-center gap-6 p-8">
              <Coffee className="size-12 text-amber-500 transition-transform duration-300 group-hover:scale-110" />
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold">Support Our Work</h2>
                <p className="text-muted-foreground">
                  If you find our service valuable, consider buying us a coffee
                  to help maintain and improve the platform.
                </p>
              </div>
              <Link
                href="https://www.buymeacoffee.com/entretien_ai"
                target="_blank"
                className="mt-auto"
              >
                <MovingBorderButton
                  borderRadius="0.75rem"
                  className="border-amber-500 bg-amber-500 font-medium text-white outline outline-amber-500"
                >
                  Buy us a coffee
                  <Heart className="ml-2 size-4" />
                </MovingBorderButton>
              </Link>
            </CardContent>
          </Card>

          {/* GitHub Card */}
          <Card className="group animate-fade-up rounded-xl border-2 bg-card/50 opacity-0 transition-all duration-300 [animation-delay:700ms] hover:border-foreground hover:shadow-lg hover:shadow-foreground/20">
            <CardContent className="flex h-full flex-col items-center gap-6 p-8">
              <Icons.gitHub className="size-12 transition-transform duration-300 group-hover:scale-110" />
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-semibold">Open Source</h2>
                <p className="text-muted-foreground">
                  We are fully open source and free, feel free to check out our
                  Github or donate to support the site.
                </p>
              </div>
              <Link
                href="https://www.buymeacoffee.com/entretien_ai"
                target="_blank"
                className="mt-auto"
              >
                <MovingBorderButton
                  borderRadius="0.75rem"
                  className="font-medium text-white"
                >
                  Buy us a coffee
                  <Heart className="ml-2 size-4" />
                </MovingBorderButton>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
