// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  APPLIED: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
  INTERVIEWING: "bg-yellow-500/10 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400",
  OFFERED: "bg-green-500/10 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  REJECTED: "bg-red-500/10 text-red-700 dark:bg-red-500/20 dark:text-red-400",
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
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
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

  async function fetchJobs() {
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
  }

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

    await fetch("/api/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ text: noteText, jobId }),
    });

    setNoteText("");
    setAddingNote(false);
    fetchJobs();
  }

  async function deleteNote(noteId: string) {
    await fetch(`/api/notes/${noteId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    fetchJobs();
  }

  // Filter and search jobs
  useEffect(() => {
    let filtered = jobs;

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    // Search by title or company
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredJobs(filtered);
  }, [jobs, searchQuery, statusFilter]);

  // Calculate statistics
  const stats = {
    total: jobs.length,
    applied: jobs.filter((j) => j.status === "APPLIED").length,
    interviewing: jobs.filter((j) => j.status === "INTERVIEWING").length,
    offered: jobs.filter((j) => j.status === "OFFERED").length,
    rejected: jobs.filter((j) => j.status === "REJECTED").length,
  };

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  // add this function inside Dashboard component
  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-neutral-100 dark:to-neutral-400 bg-clip-text text-transparent">
              Jedi
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Track every application. Land your dream job.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button size="sm" suppressHydrationWarning>
                  + Add Application
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Application</DialogTitle>
                </DialogHeader>
                <form onSubmit={addJob} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Job Title</Label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Frontend Engineer"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Razorpay"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Job URL (optional)</Label>
                    <Input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Adding..." : "Add Application"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
            <Button variant="ghost" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        {/* Statistics */}
        {jobs.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <Card className="border-2">
              <CardContent className="p-4">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.applied}
                </div>
                <div className="text-xs text-muted-foreground">Applied</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-yellow-200 dark:border-yellow-800">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
                  {stats.interviewing}
                </div>
                <div className="text-xs text-muted-foreground">Interviewing</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  {stats.offered}
                </div>
                <div className="text-xs text-muted-foreground">Offered</div>
              </CardContent>
            </Card>
            <Card className="border-2 border-red-200 dark:border-red-800">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-700 dark:text-red-400">
                  {stats.rejected}
                </div>
                <div className="text-xs text-muted-foreground">Rejected</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filter */}
        {jobs.length > 0 && (
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <Input
              placeholder="Search by title or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="md:flex-1"
            />
            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
              <SelectTrigger className="md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="APPLIED">Applied</SelectItem>
                <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
                <SelectItem value="OFFERED">Offered</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Job Cards */}
        <div className="space-y-4">
          {filteredJobs.length === 0 && jobs.length === 0 && (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Start tracking your job applications today!
                </p>
                <Button onClick={() => setOpen(true)}>Add Your First Application</Button>
              </CardContent>
            </Card>
          )}
          {filteredJobs.length === 0 && jobs.length > 0 && (
            <Card className="border-dashed border-2">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-muted-foreground">
                  No applications match your search or filter
                </p>
              </CardContent>
            </Card>
          )}
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">{job.title}</CardTitle>
                        <p className="text-sm text-muted-foreground font-medium">
                          {job.company}
                        </p>
                      </div>
                      <Badge className={statusColors[job.status]}>
                        {statusLabels[job.status]}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <span>Added {formatDate(job.createdAt)}</span>
                      {job.updatedAt !== job.createdAt && (
                        <>
                          <span>•</span>
                          <span>Updated {formatDate(job.updatedAt)}</span>
                        </>
                      )}
                      {job.notes.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{job.notes.length} note{job.notes.length > 1 ? 's' : ''}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Select
                    value={job.status}
                    onValueChange={(val) => updateStatus(job.id, val as string)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APPLIED">Applied</SelectItem>
                      <SelectItem value="INTERVIEWING">Interviewing</SelectItem>
                      <SelectItem value="OFFERED">Offered</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View posting ↗
                    </a>
                  )}
                  <div className="ml-auto flex gap-2">
                    <Dialog>
                      <DialogTrigger>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedJob(job)}
                        >
                          Notes ({job.notes.length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Notes for {job.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Add Note Form */}
                          <div className="space-y-2">
                            <Label>Add a note</Label>
                            <Textarea
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="Record interview details, follow-up reminders, or any other notes..."
                              rows={3}
                            />
                            <Button
                              onClick={() => addNote(job.id)}
                              disabled={addingNote || !noteText.trim()}
                              size="sm"
                            >
                              {addingNote ? "Adding..." : "Add Note"}
                            </Button>
                          </div>

                          {/* Notes List */}
                          {job.notes.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                              No notes yet. Add one above!
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm">All Notes</h4>
                              {job.notes.map((note) => (
                                <Card key={note.id} size="sm">
                                  <CardContent className="p-3">
                                    <div className="flex justify-between items-start gap-3">
                                      <div className="flex-1">
                                        <p className="text-sm whitespace-pre-wrap">{note.text}</p>
                                        <p className="text-xs text-muted-foreground mt-2">
                                          {formatDate(note.createdAt)}
                                        </p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="xs"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => deleteNote(note.id)}
                                      >
                                        Delete
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        if (confirm("Delete this application?")) {
                          deleteJob(job.id);
                        }
                      }}
                    >
                      Delete
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
