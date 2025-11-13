"use client"

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddInterviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddInterviewDialog({ open, onOpenChange, onSuccess }: AddInterviewDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    createdBy: "",
  });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let resumePath = "";
      let jdPath = "";

      // Upload resume if provided
      if (resumeFile) {
        const resumeFormData = new FormData();
        resumeFormData.append("file", resumeFile);
        const resumeResponse = await fetch("/api/upload", {
          method: "POST",
          body: resumeFormData,
        });
        const resumeData = await resumeResponse.json();
        resumePath = resumeData.path;
      }

      // Upload JD if provided
      if (jdFile) {
        const jdFormData = new FormData();
        jdFormData.append("file", jdFile);
        const jdResponse = await fetch("/api/upload", {
          method: "POST",
          body: jdFormData,
        });
        const jdData = await jdResponse.json();
        jdPath = jdData.path;
      }

      // Create interview
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          resumePath: resumePath || undefined,
          jdPath: jdPath || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create interview");
      }

      // Reset form
      setFormData({ name: "", email: "", createdBy: "" });
      setResumeFile(null);
      setJdFile(null);

      onSuccess();
    } catch (error) {
      console.error("Error creating interview:", error);
      alert("Failed to create interview. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Interviewee</DialogTitle>
          <DialogDescription>
            Enter the details of the interviewee and upload their resume and job description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="createdBy">Your Name *</Label>
            <Input
              id="createdBy"
              value={formData.createdBy}
              onChange={(e) => setFormData({ ...formData, createdBy: e.target.value })}
              required
              placeholder="Jane Smith"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resume">Resume (PDF)</Label>
            <Input
              id="resume"
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jd">Job Description (PDF)</Label>
            <Input
              id="jd"
              type="file"
              accept=".pdf"
              onChange={(e) => setJdFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Interviewee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
