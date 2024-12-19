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
        <CardTitle>Buy us a coffee</CardTitle>
        <CardDescription>
          Entretien AI is free thanks to donations, please support us to keep
          the project running.
        </CardDescription>
      </CardHeader>
      <CardContent className="md:max-xl:px-4">
        <Link href="/pricing">
          <Button size="sm" className="w-full" variant="default" rounded="full">
            Donate
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
