import {
  Bot,
  Boxes,
  Building2,
  Compass,
  Diamond,
  Fingerprint,
  Rocket,
  Waves,
} from "lucide-react";

import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

const logos = [
  {
    name: "Waverio",
    icon: Waves,
    color: "text-purple-500",
  },
  {
    name: "Logoipsum",
    icon: Boxes,
    color: "text-gray-700",
  },
  {
    name: "Alterbone",
    icon: Bot,
    color: "text-green-600",
  },
  {
    name: "Tinygone",
    icon: Fingerprint,
    color: "text-pink-500",
  },
  {
    name: "Preso",
    icon: Compass,
    color: "text-cyan-500",
  },
  {
    name: "Ridoria",
    icon: Rocket,
    color: "text-blue-500",
  },
  {
    name: "Carbonia",
    icon: Diamond,
    color: "text-indigo-500",
  },
  {
    name: "Incanto",
    icon: Building2,
    color: "text-blue-600",
  },
];

export default function LogoCloud() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      {/* Gradient Blur Shapes - Smaller and more subtle */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute left-[50%] top-[50%] h-[200px] w-[250px] -translate-x-[50%] -translate-y-[50%] rounded-full bg-purple-500/15 blur-[96px]"
          style={{ filter: "blur(96px)" }}
        />
        <div
          className="absolute right-[30%] top-[40%] h-[150px] w-[200px] rounded-full bg-blue-500/15 blur-[80px]"
          style={{ filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-[40%] left-[30%] h-[150px] w-[200px] rounded-full bg-cyan-500/15 blur-[80px]"
          style={{ filter: "blur(80px)" }}
        />
      </div>

      <MaxWidthWrapper>
        <h2 className="text-center text-lg font-medium text-muted-foreground">
          Popular brands use Entretien AI
        </h2>

        <div className="relative mt-12 grid grid-cols-2 items-center gap-12 md:grid-cols-3 lg:grid-cols-4">
          {logos.map(({ name, icon: Icon, color }) => (
            <div
              key={name}
              className="flex flex-col items-center justify-center gap-3 transition-all hover:scale-105"
            >
              <div className={`${color} transition-colors`}>
                <Icon size={32} strokeWidth={1.5} />
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {name}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center">
            <img
              src="/capterra-logo.svg"
              alt="Capterra"
              className="h-6 w-auto"
            />
            <div className="ml-2 flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            4.4/5 (14,590 Reviews)
          </p>
        </div>
      </MaxWidthWrapper>
    </section>
  );
}
