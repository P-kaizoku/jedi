// app/dashboard/page.tsx
"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Note = {
  id: string;
  text: string;
  createdAt: string;
};

type Job = {
  id: string;
  title: string;
  company: string;
  url?: string;
  status: "APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  notes: Note[];
};

const statusColors = {
  APPLIED: "bg-blue-500/5 text-blue-500 border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-400/20",
  INTERVIEWING: "bg-amber-500/5 text-amber-600 border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-400/20",
  OFFERED: "bg-emerald-500/5 text-emerald-600 border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-400/20",
  REJECTED: "bg-rose-500/5 text-rose-600 border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-400/20",
};

const statusLabels = {
  APPLIED: "Applied",
  INTERVIEWING: "Interviewing",
  OFFERED: "Offered",
  REJECTED: "Rejected",
};

export default function Dashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [noteText, setNoteText] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  function getToken() {
    return localStorage.getItem("token");
  }

  const fetchJobs = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    const res = await fetch("/api/jobs", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    const data = await res.json();
    setJobs(data);
  }, [router]);

  async function addJob(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ title, company, url }),
    });

    if (res.ok) {
      setOpen(false);
      setTitle("");
      setCompany("");
      setUrl("");
      fetchJobs();
    }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/jobs/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ status }),
    });
    fetchJobs();
  }

  async function deleteJob(id: string) {
    await fetch(`/api/jobs/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchJobs();
  }

  async function addNote(jobId: string) {
    if (!noteText.trim()) return;
    setAddingNote(true);

    const res = await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ text: noteText, jobId }),
    });

    if (res.ok) {
      setNoteText("");
      fetchJobs();
      // Keep selectedJob notes list updated
      const updatedJobsRes = await fetch("/api/jobs", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (updatedJobsRes.ok) {
        const updatedJobs = await updatedJobsRes.json();
        setJobs(updatedJobs);
        const currentJob = updatedJobs.find((j: Job) => j.id === jobId);
        if (currentJob) {
          setSelectedJob(currentJob);
        }
      }
    }
    setAddingNote(false);
  }

  async function deleteNote(noteId: string) {
    const res = await fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    if (res.ok) {
      fetchJobs();
      if (selectedJob) {
        // Keep selectedJob notes list updated
        const updatedJobsRes = await fetch("/api/jobs", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (updatedJobsRes.ok) {
          const updatedJobs = await updatedJobsRes.json();
          setJobs(updatedJobs);
          const currentJob = updatedJobs.find((j: Job) => j.id === selectedJob.id);
          if (currentJob) {
            setSelectedJob(currentJob);
          }
        }
      }
    }
  }

  // Filter and search jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesStatus = statusFilter === "ALL" || job.status === statusFilter;
    const matchesQuery = !searchQuery || 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  // Calculate statistics
  const stats = [
    { label: "Total", value: jobs.length, color: "text-foreground", borderColor: "border-border" },
    { label: "Applied", value: jobs.filter((j) => j.status === "APPLIED").length, color: "text-blue-500", borderColor: "border-border" },
    { label: "Interviewing", value: jobs.filter((j) => j.status === "INTERVIEWING").length, color: "text-amber-500", borderColor: "border-border" },
    { label: "Offered", value: jobs.filter((j) => j.status === "OFFERED").length, color: "text-emerald-500", borderColor: "border-border" },
    { label: "Rejected", value: jobs.filter((j) => j.status === "REJECTED").length, color: "text-rose-500", borderColor: "border-border" },
  ];

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} wks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} mos ago`;
    return date.toLocaleDateString();
  }

  useEffect(() => {
    const load = async () => {
      await fetchJobs();
    };
    load();
  }, [fetchJobs]);

  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-foreground selection:text-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-border">
          <div>
            <Link href="/" className="flex items-center gap-2 hover:opacity-85 transition-opacity">
              <span className="font-mono text-[10px] bg-foreground/10 text-foreground px-2 py-0.5 border border-border rounded-sm uppercase tracking-wider font-semibold">
                SYSTEM_LIVE
              </span>
              <h1 className="font-mono font-bold text-xl tracking-tight uppercase">
                Jedi<span className="text-muted-foreground">/</span>Dashboard<span className="animate-pulse">_</span>
              </h1>
            </Link>
            <p className="text-[11px] font-mono text-muted-foreground mt-1.5 uppercase tracking-wider">
              [PIPELINE_MONITOR // STATUS: ONLINE]
            </p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto font-mono">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger render={
                <Button size="sm" className="font-mono text-xs rounded-sm border border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-all cursor-pointer" suppressHydrationWarning>
                  + ADD_APPLICATION
                </Button>
              } />
              <DialogContent className="border border-border bg-card rounded-sm shadow-none max-w-md font-sans">
                <DialogHeader className="border-b border-border/80 pb-3">
                  <DialogTitle className="font-mono text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>Initialize Entry</span>
                    <span className="text-muted-foreground text-[10px] font-medium tracking-normal">[DB // ADD_RECORD]</span>
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={addJob} className="space-y-4 pt-4">
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Job Title</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Frontend Engineer"
                      required
                      className="rounded-sm border-border bg-background/50 focus-visible:border-foreground/30 focus-visible:ring-3 focus-visible:ring-foreground/10 font-mono text-sm placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Company</Label>
                    <Input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="e.g. Stripe"
                      required
                      className="rounded-sm border-border bg-background/50 focus-visible:border-foreground/30 focus-visible:ring-3 focus-visible:ring-foreground/10 font-mono text-sm placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Job URL (optional)</Label>
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://..."
                      className="rounded-sm border-border bg-background/50 focus-visible:border-foreground/30 focus-visible:ring-3 focus-visible:ring-foreground/10 font-mono text-sm placeholder:text-muted-foreground/40"
                    />
                  </div>
                  <Button type="submit" className="w-full font-mono text-sm rounded-sm py-2 hover:bg-background hover:text-foreground border border-foreground bg-foreground text-background transition-all duration-150 cursor-pointer" disabled={loading}>
                    {loading ? "SAVING..." : "COMMIT_ENTRY"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" className="text-xs rounded-sm border border-transparent hover:border-border hover:bg-foreground/[0.02] cursor-pointer" onClick={logout}>
              [LOGOUT]
            </Button>
          </div>
        </div>

        {/* Statistics */}
        {jobs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.label} className="border border-border bg-card/20 rounded-sm shadow-none">
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                    [{stat.label}]
                  </span>
                  <div className={`text-2xl md:text-3xl font-mono font-bold mt-2 tracking-tight ${stat.color}`}>
                    {String(stat.value).padStart(2, "0")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Search and Filter */}
        {jobs.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="SEARCH_BY_TITLE_OR_COMPANY..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="sm:flex-1 rounded-sm border-border bg-background/50 focus-visible:border-foreground/30 focus-visible:ring-3 focus-visible:ring-foreground/10 font-mono text-sm placeholder:text-muted-foreground/40"
            />
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
              <SelectTrigger className="sm:w-48 font-mono text-xs rounded-sm border-border bg-background/50 hover:bg-foreground/[0.02]">
                <SelectValue placeholder="FILTER_BY_STATUS" />
              </SelectTrigger>
              <SelectContent className="font-mono text-xs rounded-sm">
                <SelectItem value="ALL">ALL STATUSES</SelectItem>
                <SelectItem value="APPLIED">APPLIED</SelectItem>
                <SelectItem value="INTERVIEWING">INTERVIEWING</SelectItem>
                <SelectItem value="OFFERED">OFFERED</SelectItem>
                <SelectItem value="REJECTED">REJECTED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Job Cards */}
        <div className="space-y-4">
          {filteredJobs.length === 0 && jobs.length === 0 && (
            <Card className="border-dashed border border-border bg-card/10 rounded-sm shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="font-mono text-3xl mb-4 text-muted-foreground/60">[NO_RECORDS]</div>
                <h3 className="text-base font-mono font-bold mb-2">DATABASE IS EMPTY</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                  No active applications found. Initialize tracking by creating your first entry.
                </p>
                <Button onClick={() => setOpen(true)} className="font-mono rounded-sm text-xs border border-foreground bg-foreground text-background hover:bg-background hover:text-foreground cursor-pointer">
                  CREATE_FIRST_RECORD
                </Button>
              </CardContent>
            </Card>
          )}
          {filteredJobs.length === 0 && jobs.length > 0 && (
            <Card className="border-dashed border border-border bg-card/10 rounded-sm shadow-none">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="font-mono text-2xl mb-2 text-muted-foreground/60">[NO_MATCHES]</div>
                <p className="text-sm font-mono text-muted-foreground">
                  Query returned 0 results. Refine search criteria.
                </p>
              </CardContent>
            </Card>
          )}
          {filteredJobs.map((job) => (
            <Card key={job.id} className="border border-border hover:border-foreground/30 hover:bg-foreground/[0.01] transition-all rounded-sm shadow-none">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex-1">
                        <CardTitle className="text-lg font-bold tracking-tight text-foreground">{job.title}</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium mt-0.5">
                          {job.company}
                        </p>
                      </div>
                      <Badge variant="outline" className={`${statusColors[job.status]} font-mono text-[10px] rounded-sm uppercase px-2 py-0.5 tracking-wider border`}>
                        {statusLabels[job.status]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-mono text-muted-foreground uppercase">
                      <span>ADDED: {formatDate(job.createdAt)}</span>
                      {job.updatedAt !== job.createdAt && (
                        <>
                          <span>•</span>
                          <span>UPDATED: {formatDate(job.updatedAt)}</span>
                        </>
                      )}
                      {job.notes.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-foreground/70 font-bold">[{job.notes.length} NOTE{job.notes.length > 1 ? 'S' : ''}]</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 w-full">
                  <Select
                    value={job.status}
                    onValueChange={(val) => updateStatus(job.id, val as string)}
                  >
                    <SelectTrigger className="w-36 font-mono text-xs rounded-sm border-border bg-background/30 hover:bg-foreground/[0.02]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="font-mono text-xs rounded-sm">
                      <SelectItem value="APPLIED">APPLIED</SelectItem>
                      <SelectItem value="INTERVIEWING">INTERVIEWING</SelectItem>
                      <SelectItem value="OFFERED">OFFERED</SelectItem>
                      <SelectItem value="REJECTED">REJECTED</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-mono text-blue-500 hover:text-blue-600 hover:underline flex items-center gap-1 decoration-blue-500/30"
                    >
                      VIEW_POSTING ↗
                    </a>
                  )}
                  
                  <div className="ml-auto flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger render={
                        <Button
                          variant="outline"
                          size="sm"
                          className="font-mono text-xs rounded-sm border-border hover:bg-foreground/[0.02] cursor-pointer"
                          onClick={() => setSelectedJob(job)}
                        >
                          LOGS ({job.notes.length})
                        </Button>
                      } />
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto border border-border bg-card rounded-sm shadow-none font-sans">
                        <DialogHeader className="border-b border-border/80 pb-3">
                          <DialogTitle className="font-mono text-sm font-bold uppercase tracking-wider flex items-center justify-between">
                            <span>Application Notes</span>
                            <span className="text-muted-foreground text-[10px] font-medium tracking-normal">[DB // READ_NOTES]</span>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-5 pt-4">
                          {/* Add Note Form */}
                          <div className="space-y-2">
                            <Label className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Add a new log entry</Label>
                            <Textarea
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Record interview status, recruiter communications, or code test feedback..."
                              rows={3}
                              className="rounded-sm border border-input bg-background/50 focus-visible:border-foreground/30 focus-visible:ring-3 focus-visible:ring-foreground/10 p-2 text-sm placeholder:text-muted-foreground/40"
                            />
                            <Button
                              onClick={() => addNote(job.id)}
                              disabled={addingNote || !noteText.trim()}
                              size="sm"
                              className="font-mono text-xs rounded-sm border border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-all cursor-pointer"
                            >
                              {addingNote ? "APPENDING..." : "APPEND_LOG_ENTRY"}
                            </Button>
                          </div>

                          {/* Notes List */}
                          <div className="space-y-3 pt-2">
                            <h4 className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-bold">
                              Log Stream ({selectedJob?.id === job.id ? selectedJob.notes.length : job.notes.length})
                            </h4>
                            {(selectedJob?.id === job.id ? selectedJob.notes : job.notes).length === 0 ? (
                              <div className="text-center py-8 font-mono text-xs text-muted-foreground border border-dashed border-border rounded-sm bg-background/10">
                                [STREAM_EMPTY: NO NOTES REGISTERED]
                              </div>
                            ) : (
                              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-1">
                                {(selectedJob?.id === job.id ? selectedJob.notes : job.notes).map((note) => (
                                  <Card key={note.id} size="sm" className="border border-border bg-background/30 rounded-sm shadow-none">
                                    <CardContent className="p-3">
                                      <div className="flex justify-between items-start gap-3">
                                        <div className="flex-1">
                                          <p className="text-sm whitespace-pre-wrap text-foreground/90 font-sans leading-relaxed">{note.text}</p>
                                          <p className="text-[10px] font-mono text-muted-foreground mt-2 uppercase">
                                            TIMESTAMP: {formatDate(note.createdAt)}
                                          </p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="xs"
                                          className="font-mono text-[10px] text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer rounded-sm"
                                          onClick={() => deleteNote(note.id)}
                                        >
                                          [DELETE]
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-mono text-xs rounded-sm text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 cursor-pointer"
                      onClick={() => {
                        if (confirm("Delete this application?")) {
                          deleteJob(job.id);
                        }
                      }}
                    >
                      [DELETE]
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
