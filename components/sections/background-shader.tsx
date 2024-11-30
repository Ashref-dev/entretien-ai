"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import clsx from "clsx";
import { useTheme } from "next-themes";

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((mod) => mod.ShaderGradientCanvas),
  { ssr: false },
);

const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((mod) => mod.ShaderGradient),
  { ssr: false },
);

export function BackgroundShader({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventDefault = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };

    // Prevent all touch events
    container.addEventListener("touchstart", preventDefault, {
      passive: false,
    });
    container.addEventListener("touchmove", preventDefault, { passive: false });
    container.addEventListener("touchend", preventDefault, { passive: false });
    container.addEventListener("wheel", preventDefault, { passive: false });
    container.addEventListener("gesturestart", preventDefault, {
      passive: false,
    });
    container.addEventListener("gesturechange", preventDefault, {
      passive: false,
    });
    container.addEventListener("gestureend", preventDefault, {
      passive: false,
    });
    container.addEventListener("pinch", preventDefault, { passive: false });
    container.addEventListener("pinchstart", preventDefault, {
      passive: false,
    });
    container.addEventListener("pinchend", preventDefault, { passive: false });
    container.addEventListener("pinchcancel", preventDefault, {
      passive: false,
    });

    // Prevent double-tap to zoom
    let lastTap = 0;
    const handleTouchStart = (e: TouchEvent) => {
      const now = Date.now();
      if (now - lastTap < 300) {
        e.preventDefault();
      }
      lastTap = now;
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });

    return () => {
      container.removeEventListener("touchstart", preventDefault);
      container.removeEventListener("touchmove", preventDefault);
      container.removeEventListener("touchend", preventDefault);
      container.removeEventListener("wheel", preventDefault);
      container.removeEventListener("gesturestart", preventDefault);
      container.removeEventListener("gesturechange", preventDefault);
      container.removeEventListener("gestureend", preventDefault);
      container.removeEventListener("pinch", preventDefault);
      container.removeEventListener("pinchstart", preventDefault);
      container.removeEventListener("pinchend", preventDefault);
      container.removeEventListener("pinchcancel", preventDefault);
      container.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  const { theme } = useTheme();

  const gradientUrl =
    theme === "light"
      ? "https://shadergradient-web.vercel.app/customize?animate=on&axesHelper=off&bgColor1=%23af38ff&bgColor2=%23910aff&brightness=1.6&cAzimuthAngle=180&cDistance=3.7&cPolarAngle=100&cameraZoom=12.5&color1=%23809bd6&color2=%23910aff&color3=%23af38ff&destination=onCanvas&embedMode=off&envPreset=lobby&format=gif&fov=40&frameRate=10&gizmoHelper=hide&grain=on&lightType=3d&pixelDensity=0.9&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.5&rotationX=0&rotationY=0&rotationZ=180&shader=defaults&type=plane&uAmplitude=7&uDensity=1.1&uFrequency=5.5&uSpeed=0.4&uStrength=1.5&uTime=0&wireframe=false"
      : "https://www.shadergradient.co/customize?animate=on&axesHelper=on&bgColor1=%23000000&bgColor2=%23000000&brightness=1&cAzimuthAngle=180&cDistance=5.7&cPolarAngle=115&cameraZoom=1&color1=%23268c9a&color2=%239224b3&color3=%23000000&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&grain=on&lightType=3d&pixelDensity=1&positionX=-0.5&positionY=0.1&positionZ=-1&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=0&rotationY=0&rotationZ=235&shader=defaults&toggleAxis=true&type=waterPlane&uAmplitude=0&uDensity=1.1&uFrequency=5.5&uSpeed=0.1&uStrength=2.4&uTime=0.2&wireframe=false&zoomOut=false";

  return (
    <div
      className={clsx("pointer-events-none touch-none select-none", className)}
      style={{
        touchAction: "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
        overscrollBehavior: "none",
        overscrollBehaviorY: "none",
        overscrollBehaviorX: "none",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <ShaderGradientCanvas
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          height: "100%",
          width: "100%",
          // backgroundColor: "var(--gradient-2)",
          pointerEvents: "none",
          touchAction: "none",
        }}
      >
        <ShaderGradient control="query" urlString={gradientUrl} />
      </ShaderGradientCanvas>
      <div
          className="absolute inset-x-0 bottom-0 h-64"
          style={{
            background: `linear-gradient(to top, 
            hsl(var(--background)) 0%,
            hsl(var(--background)) 15%,
            hsl(var(--background) / 0.95) 30%,
            hsl(var(--background) / 0.8) 45%,
            hsl(var(--background) / 0.6) 60%,
            hsl(var(--background) / 0.3) 75%,
            hsl(var(--background) / 0.1) 90%,
            transparent 100%
          )`,
          }}
        />
    </div>
  );
}
