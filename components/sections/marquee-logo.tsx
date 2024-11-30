import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";

const logos = [
  {
    name: "Perplexity",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg",
  },
  {
    name: "Anthropic",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg",
  },
  {
    name: "XAI",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/93/XAI_Logo.svg",
  },
  {
    name: "Meta",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  },
  {
    name: "Perplexity",
    url: "https://upload.wikimedia.org/wikipedia/commons/1/1d/Perplexity_AI_logo.svg",
  },

  {
    name: "Anthropic",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/78/Anthropic_logo.svg",
  },
];

const firstRow = logos.slice(0, logos.length / 2);
const secondRow = logos.slice(logos.length / 2);

const LogoCard = ({ url, name }: { url: string; name: string }) => {
  return (
    <figure
      className={cn(
        "relative z-50 mx-4 flex w-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl px-8 py-4",
        // light styles
        "bg-gray-950/[.03] hover:bg-gray-950/[.10]",
        // dark styles
        "dark:bg-gray-50/[.05] dark:hover:bg-gray-50/[.15]",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={`${name} logo`}
        className="h-12 w-auto object-contain contrast-200 grayscale transition-all duration-200 hover:grayscale-0 dark:invert"
      />
    </figure>
  );
};

export function MarqueeDemo() {
  return (
    <div className="relative flex h-[200px] w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((logo) => (
          <LogoCard key={logo.name} {...logo} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:20s]">
        {secondRow.map((logo) => (
          <LogoCard key={logo.name} {...logo} />
        ))}
      </Marquee>
      {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background/100 to-background/0" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-background/100 to-background/0" /> */}
    </div>
  );
}

const MarqueeLogo = () => {
  return (
    <div className="relative z-50 mt-8 animate-fade-up opacity-0 [animation-delay:2400ms]">
      <h2 className="text-center text-lg font-medium text-neutral-800 dark:text-neutral-200">
        Trusted by engineers from top companies
      </h2>
      <MarqueeDemo />
    </div>
  );
};

export default MarqueeLogo;
