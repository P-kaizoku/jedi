// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

type Job = {
  id: string;
  title: string;
  company: string;
  url?: string;
  status: "APPLIED" | "INTERVIEWING" | "OFFERED" | "REJECTED";
  createdAt: string;
};

const statusColors = {
  APPLIED: "bg-blue-100 text-blue-800",
  INTERVIEWING: "bg-yellow-100 text-yellow-800",
  OFFERED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function Dashboard() {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchJobs();
  }, []);

  // add this function inside Dashboard component
  function logout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Jedi</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <div className="flex items-center gap-4">
            <DialogTrigger suppressHydrationWarning>+ Add Job</DialogTrigger>
            <button
              onClick={logout}
              className="text-sm text-muted-foreground hover:text-red-500"
            >
              Logout
            </button>
          </div>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Application</DialogTitle>
            </DialogHeader>
            <form onSubmit={addJob} className="space-y-4">
              <div className="space-y-2">
                <Label>Job Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Frontend Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Razorpay"
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
                {loading ? "Adding..." : "Add"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            No applications yet. Add one!
          </p>
        )}
        {jobs.map((job) => (
          <Card key={job.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500"
                  onClick={() => deleteJob(job.id)}
                >
                  Delete
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
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
                    className="text-sm text-blue-500 hover:underline"
                  >
                    View posting
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
