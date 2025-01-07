"use client";

import { useContext, useEffect } from "react";

import { Button } from "@/components/ui/button";

import { ModalContext } from "../modals/providers";

export function UserAuthForm() {
  const { setShowSignInModal } = useContext(ModalContext);

  useEffect(() => {
    setShowSignInModal(true);
  }, [setShowSignInModal]);

  return (
    <div>
      <Button className="w-full" onClick={() => setShowSignInModal(true)}>
        Sign In
      </Button>
    </div>
  );
}
