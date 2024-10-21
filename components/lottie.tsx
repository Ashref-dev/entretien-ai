import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Lottie from "react-lottie-player";

interface DynamicLottieProps {
  animationData?: any | (() => Promise<any>);

  playMode?: "loop" | "oneTime" | "hover";
  className?: string;
  hoverDuration?: number;
}

const DynamicLottie: React.FC<DynamicLottieProps> = ({
  animationData: initialAnimationData,
  playMode = "loop",
  className,
  hoverDuration = 3000,
}) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(playMode === "loop");
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    const loadAnimationData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (typeof initialAnimationData === "function") {
          const data = await initialAnimationData();
          setAnimationData(data.default || data);
        } else if (initialAnimationData) {
          setAnimationData(initialAnimationData);
        } else {
          throw new Error("No animation data or path provided");
        }
      } catch (error) {
        console.error("Failed to load animation:", error);
        setError("Failed to load animation");
      } finally {
        setIsLoading(false);
      }
    };

    loadAnimationData();
  }, [initialAnimationData]);

  useEffect(() => {
    if (playMode === "oneTime" && !hasPlayed && animationData) {
      setIsPlaying(true);
      setHasPlayed(true);
    }
  }, [playMode, hasPlayed, animationData]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const resetAnimation = () => {
    setIsPlaying(false);
    setKey((prevKey) => prevKey + 1); // Force re-render of Lottie component
  };

  const handleMouseEnter = () => {
    if (isPlaying) return;

    if (playMode === "hover") {
      setIsPlaying(true);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        resetAnimation();
      }, hoverDuration);
    }
  };

  const handleMouseLeave = () => {
    // Optionally, you can reset the animation immediately on mouse leave
    // resetAnimation();
    // Or keep the current behavior:
    // Do nothing on mouse leave, let the timer handle stopping the animation
  };

  const handleComplete = () => {
    if (playMode === "oneTime") {
      setIsPlaying(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!animationData) return <div>No animation data available</div>;

  return (
    <div
      className={clsx("dynamic-lottie-container", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Lottie
        key={key}
        ref={lottieRef}
        loop={false}
        animationData={animationData}
        play={isPlaying}
        onComplete={handleComplete}
      />
    </div>
  );
};

export default DynamicLottie;
