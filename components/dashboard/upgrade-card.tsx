import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { AnimatedIcon } from "../shared/animated-icon";

export function UpgradeCard() {
  return (
    <Card className="md:max-xl:rounded-none md:max-xl:border-none md:max-xl:shadow-none">
      <CardHeader className="md:max-xl:px-4">
        <AnimatedIcon icon="coins" className="mx-auto size-20 lg:size-32" />
        <CardTitle>Upgrade to Pro</CardTitle>
        <CardDescription>
          Unlock all features and get unlimited access to our support team.
        </CardDescription>
      </CardHeader>
      <CardContent className="md:max-xl:px-4">
        <Link href="/pricing">
          <Button size="sm" className="w-full" variant="default" rounded="full">
            Upgrade
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
