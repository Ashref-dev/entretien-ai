"use client";

import React from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { AnimatedIconName } from "@/components/shared/animated-icon";

const CopyName = ({ text }: { text: AnimatedIconName }) => {
  const handleCopyIconName = (iconName: AnimatedIconName) => {
    // Copy the component usage example
    const componentCode = `<AnimatedIcon icon="${iconName}" className="size-24" />`;
    navigator.clipboard.writeText(componentCode);
    toast.success("Icon component code copied to clipboard!");
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto gap-2 p-2 text-sm"
      onClick={() => handleCopyIconName(text)}
    >
      <span className="text-muted-foreground">{text}</span>
      <Copy className="size-4" />
    </Button>
  );
};

export default CopyName;
