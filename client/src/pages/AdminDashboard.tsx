import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Trash2, Mail, Building2, MessageSquare, Calendar } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);

  const { data: submissions, isLoading, refetch } = trpc.contact.list.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      toast.success("Submission deleted successfully");
      refetch();
      setSelectedSubmission(null);
    },
    onError: () => {
      toast.error("Failed to delete submission");
    },
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="bg-card border-border p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to sign in with an admin account to access this dashboard.
          </p>
          <Button
            size="lg"
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
          >
            Sign In
          </Button>
        </Card>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="bg-card border-border p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">
            You do not have permission to access the admin dashboard.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Contact Submissions</h1>
          <p className="text-muted-foreground">
            Manage and review all contact form submissions from your website.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading submissions...</p>
          </div>
        ) : !submissions || submissions.length === 0 ? (
          <Card className="bg-card border-border p-12 text-center">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No contact submissions yet.</p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {submissions.map((submission) => (
              <Card
                key={submission.id}
                className="bg-card border-border p-6 hover:border-accent transition-colors cursor-pointer"
                onClick={() =>
                  setSelectedSubmission(
                    selectedSubmission === submission.id ? null : submission.id
                  )
                }
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{submission.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <a href={`mailto:${submission.email}`} className="hover:text-accent">
                          {submission.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        {submission.company}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(submission.createdAt).toLocaleDateString()} at{" "}
                        {new Date(submission.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to delete this submission?")) {
                        deleteMutation.mutate({ id: submission.id });
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {selectedSubmission === submission.id && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-start gap-2 mb-4">
                      <MessageSquare className="w-4 h-4 text-accent mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Message</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                          {submission.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
