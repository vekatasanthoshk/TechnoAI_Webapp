import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import TechnoAILogo from "@/components/TechnoAILogo";
import { trpc } from "@/lib/trpc";
import {
  Trash2,
  Mail,
  Building2,
  MessageSquare,
  CalendarClock,
  ChevronDown,
  Lock,
  Users,
  Activity,
  TrendingUp,
  Search,
  RefreshCw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

/** Bookings are stored as messages prefixed by the appointment stamp. */
const APPOINTMENT_RE = /^\[Appointment requested: (.+?) at (.+?)\]\s*/;

function parseMessage(message: string): {
  appointment: { date: string; time: string } | null;
  body: string;
} {
  const m = message.match(APPOINTMENT_RE);
  if (!m) return { appointment: null, body: message };
  return { appointment: { date: m[1], time: m[2] }, body: message.slice(m[0].length) };
}

const dateTimeFmt = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});
const apptDateFmt = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
});

function formatApptDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime()) ? iso : apptDateFmt.format(d);
}

type Filter = "all" | "appointments" | "messages";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const utils = trpc.useUtils();

  const {
    data: submissions,
    isLoading,
    isFetching,
    refetch,
  } = trpc.contact.list.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
  });

  const deleteMutation = trpc.contact.delete.useMutation({
    onSuccess: () => {
      toast.success("Submission deleted");
      refetch();
    },
    onError: () => toast.error("Failed to delete submission"),
  });

  const loginMutation = trpc.auth.loginAdmin.useMutation({
    onSuccess: () => {
      toast.success("Logged in successfully");
      utils.auth.me.invalidate();
    },
    onError: (err) => toast.error(err.message || "Invalid password"),
  });

  const parsed = useMemo(
    () =>
      (submissions ?? []).map((s) => ({
        ...s,
        ...parseMessage(s.message),
      })),
    [submissions],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parsed.filter((s) => {
      if (filter === "appointments" && !s.appointment) return false;
      if (filter === "messages" && s.appointment) return false;
      if (!q) return true;
      return [s.name, s.email, s.company, s.body]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [parsed, query, filter]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground animate-pulse">Verifying credentials…</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="bg-card border-border p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-5">
            <TechnoAILogo size={64} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Admin Access Required</h2>
          <p className="text-muted-foreground mb-6">
            Enter the admin password to open the dashboard.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loginMutation.mutate({ password });
            }}
            className="space-y-4"
          >
            <label htmlFor="admin-password" className="sr-only">
              Admin password
            </label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Admin password"
              autoComplete="current-password"
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
              <Lock className="w-4 h-4 mr-2" />
              {loginMutation.isPending ? "Authenticating…" : "Unlock Dashboard"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const total = parsed.length;
  const appointments = parsed.filter((s) => s.appointment).length;
  const now = new Date();
  const today = parsed.filter((s) => {
    const d = new Date(s.createdAt);
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;
  const week = parsed.filter(
    (s) => now.getTime() - new Date(s.createdAt).getTime() <= 7 * 24 * 60 * 60 * 1000,
  ).length;

  const stats = [
    { icon: Users, label: "Total Submissions", value: total, cls: "bg-primary/10 text-primary" },
    { icon: CalendarClock, label: "Appointments", value: appointments, cls: "bg-teal-500/10 text-teal-600" },
    { icon: Activity, label: "Today", value: today, cls: "bg-blue-500/10 text-blue-500" },
    { icon: TrendingUp, label: "Past 7 Days", value: week, cls: "bg-green-500/10 text-green-600" },
  ];

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: `All (${total})` },
    { key: "appointments", label: `Appointments (${appointments})` },
    { key: "messages", label: `Messages (${total - appointments})` },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-muted-foreground">
              Contact messages and consultation bookings from the website.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            {isFetching ? "Refreshing…" : "Refresh"}
          </Button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Card key={s.label} className="p-5 bg-card border-border">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${s.cls}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
                  <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-56 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <label htmlFor="submission-search" className="sr-only">
              Search submissions
            </label>
            <Input
              id="submission-search"
              type="search"
              placeholder="Search name, email, company…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex rounded-lg border border-border p-0.5 bg-muted/40">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
                  filter === f.key
                    ? "bg-background shadow-sm font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground animate-pulse">Loading submissions…</p>
          </div>
        ) : visible.length === 0 ? (
          <Card className="bg-card border-border p-12 text-center">
            <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              {total === 0
                ? "No contact submissions yet."
                : "Nothing matches your search or filter."}
            </p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {visible.map((s) => {
              const expanded = expandedId === s.id;
              return (
                <Card key={s.id} className="bg-card border-border p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{s.name}</h3>
                        {s.appointment && (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 text-teal-700 border border-teal-500/30 px-2.5 py-0.5 text-xs font-medium">
                            <CalendarClock className="w-3.5 h-3.5" />
                            {formatApptDate(s.appointment.date)} · {s.appointment.time}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5 min-w-0">
                          <Mail className="w-4 h-4 shrink-0" />
                          <a
                            href={`mailto:${s.email}`}
                            className="truncate hover:text-accent-foreground underline-offset-2 hover:underline"
                          >
                            {s.email}
                          </a>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 shrink-0" />
                          {s.company}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Activity className="w-4 h-4 shrink-0" />
                          {dateTimeFmt.format(new Date(s.createdAt))}
                        </span>
                      </div>
                      {!expanded && (
                        <p className="mt-2 text-sm text-muted-foreground truncate">{s.body}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-expanded={expanded}
                        aria-label={expanded ? "Collapse message" : "Expand message"}
                        onClick={() => setExpandedId(expanded ? null : s.id)}
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        aria-label={`Delete submission from ${s.name}`}
                        onClick={() => {
                          if (confirm(`Delete the submission from ${s.name}? This cannot be undone.`)) {
                            deleteMutation.mutate({ id: s.id });
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {expanded && (
                    <div className="mt-4 pt-4 border-t border-border flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                      <p className="flex-1 text-sm text-muted-foreground whitespace-pre-wrap">
                        {s.body}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
