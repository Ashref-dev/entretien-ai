import { Plus } from "lucide-react";

import { getCurrentUser } from "@/lib/session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { DashboardHeader } from "@/components/dashboard/header";
import CreateInterview from "@/components/interviews/create-interview";

const page = async () => {
  const user = await getCurrentUser();
  return (
    <div className="container mx-auto px-4 py-8">
      <DashboardHeader
        heading="Dashboard"
        text={`Current Role: ${user?.role} — Change your role in settings.`}
      />

{/* // interview creation section  */}
      <CreateInterview />

      <div>
        <h3 className="mb-4 text-2xl font-semibold">Past Mock Interviews</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Frontend Developer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">85%</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>UX Designer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">92%</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Data Scientist</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">78%</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
