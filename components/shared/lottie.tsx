"use client";

import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import Lottie from "react-lottie-player";

import { Skeleton } from "../ui/skeleton";

interface DynamicLottieProps {
  animationData?: any | (() => Promise<any>);
  playMode?: "loop" | "oneTime" | "hover";
  className?: string;
  hoverDuration?: number;
  speed?: number;
}

const DynamicLottie: React.FC<DynamicLottieProps> = ({
  animationData: initialAnimationData,
  playMode = "hover",
  className,
  hoverDuration = 2000,
  speed = 1,
}) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    if (playMode === "loop") {
      setIsPlaying(true);
    }
  }, [playMode]);

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

  // const handleMouseLeave = () => {
  //   if (playMode === "hover") {
  //     resetAnimation();
  //     if (timerRef.current) {
  //       clearTimeout(timerRef.current);
  //     }
  //   }
  // };

  const handleComplete = () => {
    if (playMode === "oneTime") {
      setIsPlaying(false);
    }
  };

  if (isLoading) return <Skeleton className={clsx("size-full", className)} />;
  if (error) return <div>{error}</div>;
  if (!animationData) return <div>No animation data available</div>;

  return (
    <div className={clsx("", className)} onMouseEnter={handleMouseEnter}>
      <Lottie
        key={key}
        ref={lottieRef}
        loop={playMode === "loop"}
        animationData={animationData}
        play={isPlaying}
        speed={speed}
        onComplete={handleComplete}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default DynamicLottie;
