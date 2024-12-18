"use client";

import { useContext } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";

import { ModalContext } from "../modals/providers";
import { MovingBorderButton } from "../ui/moving-border-button";
import { Skeleton } from "../ui/skeleton";

const HeroCTA = () => {
  const { setShowSignInModal } = useContext(ModalContext);

  const { data: session, status } = useSession();

  return (
    <>
      {session ? (
        <Link href="/interviews" prefetch={true}>
          <MovingBorderButton
            borderRadius="1rem"
            className="border-neutral-200 bg-white font-medium text-black dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          >
            Start For Free
            <ChevronRight className="size-5" />
          </MovingBorderButton>
        </Link>
      ) : status === "unauthenticated" ? (
        <MovingBorderButton
          borderRadius="1rem"
          className="border-neutral-200 bg-white font-medium text-black dark:border-slate-800 dark:bg-slate-950 dark:text-white"
          onClick={() => setShowSignInModal(true)}
        >
          Start For Free
          <ChevronRight className="size-5" />
        </MovingBorderButton>
      ) : (
        <Skeleton className="hidden h-12 w-40 rounded-full lg:flex" />
      )}
    </>
  );
};

export default HeroCTA;
