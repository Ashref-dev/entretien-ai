import { NavMobile } from "@/components/layout/mobile-nav";
import { NavBar } from "@/components/layout/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import BackgroundShaderClient from "@/components/sections/background-shader-client";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <NavMobile />
      <NavBar scroll={true} />
      <BackgroundShaderClient className="absolute h-screen w-full" />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
