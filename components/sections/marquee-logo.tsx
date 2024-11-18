import { cn } from "@/lib/utils";
import Marquee from "@/components/ui/marquee";

const logos = [
  {
    name: "Microsoft",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  },

  {
    name: "Google",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  },

  {
    name: "IBM",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  },
  {
    name: "Oracle",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg",
  },
  {
    name: "Intel",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/7d/Intel_logo_%282006-2020%29.svg",
  },
];

const firstRow = logos.slice(0, logos.length / 2);
const secondRow = logos.slice(logos.length / 2);

const LogoCard = ({ url, name }: { url: string; name: string }) => {
  return (
    <figure
      className={cn(
        "relative mx-4 flex w-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl p-4",
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
        className="h-10 w-auto object-contain grayscale transition-all duration-200 hover:grayscale-0"
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
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background" />
    </div>
  );
}

const MarqueeLogo = () => {
  return (
    <div className="mt-8">
      <h2 className="text-center text-lg font-medium text-muted-foreground">
        Trusted by engineers from top companies
      </h2>
      <MarqueeDemo />
    </div>
  );
};

export default MarqueeLogo;
