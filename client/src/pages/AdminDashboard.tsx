import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Trash2, Mail, Building2, MessageSquare, Calendar, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);
  const [password, setPassword] = useState("");

  const utils = trpc.useUtils();

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

  const loginMutation = trpc.auth.loginAdmin.useMutation({
    onSuccess: () => {
      toast.success("Logged in successfully");
      utils.auth.me.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "Invalid password");
    }
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground animate-pulse">Verifying credentials...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="bg-card border-border p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
          <p className="text-muted-foreground mb-6">
            Please enter the admin password to access this dashboard.
          </p>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              loginMutation.mutate({ password });
            }}
            className="space-y-4"
          >
            <Input 
              type="password" 
              placeholder="Enter admin password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
            />
            <Button
              type="submit"
              size="lg"
              className="w-full bg-primary hover:bg-primary/90"
              disabled={loginMutation.isPending || !password}
            >
              {loginMutation.isPending ? "Authenticating..." : "Unlock Dashboard"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-8 p-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold mb-2">Contact Submissions</h1>
            <p className="text-muted-foreground">
              Manage and review all contact form submissions from your website.
            </p>
          </div>
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
