"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Interview, Feedback } from "@/lib/types";

export default function InterviewDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    panelist: "",
    content: "",
    rating: "",
  });

  useEffect(() => {
    fetchInterviewDetails();
    fetchFeedbacks();
  }, [params.id]);

  const fetchInterviewDetails = async () => {
    try {
      const response = await fetch(`/api/interviews/${params.id}`);
      if (!response.ok) {
        throw new Error("Interview not found");
      }
      const data = await response.json();
      setInterview(data);
    } catch (error) {
      console.error("Error fetching interview:", error);
      alert("Interview not found");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch(`/api/interviews/${params.id}/feedbacks`);
      const data = await response.json();
      setFeedbacks(data);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/interviews/${params.id}/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          panelist: feedbackForm.panelist,
          content: feedbackForm.content,
          rating: feedbackForm.rating ? parseInt(feedbackForm.rating) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback");
      }

      // Reset form and refresh feedbacks
      setFeedbackForm({ panelist: "", content: "", rating: "" });
      fetchFeedbacks();
      alert("Feedback submitted successfully!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!interview) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost">← Back to All Interviews</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interviewee Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Interviewee Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-500">Name</Label>
                  <p className="text-lg font-medium">{interview.name}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Email</Label>
                  <p className="text-lg">{interview.email}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Added By</Label>
                  <p className="text-lg">{interview.createdBy}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Date Added</Label>
                  <p className="text-lg">
                    {new Date(interview.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {interview.resumePath ? (
                  <div>
                    <a
                      href={interview.resumePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>View Resume</span>
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500">No resume uploaded</p>
                )}

                {interview.jdPath ? (
                  <div>
                    <a
                      href={interview.jdPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>View Job Description</span>
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500">No job description uploaded</p>
                )}
              </CardContent>
            </Card>

            {/* Add Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle>Add Feedback</CardTitle>
                <CardDescription>Share your feedback about this candidate</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitFeedback} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="panelist">Your Name *</Label>
                    <Input
                      id="panelist"
                      value={feedbackForm.panelist}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, panelist: e.target.value })}
                      required
                      placeholder="John Smith"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rating">Rating (1-10)</Label>
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="10"
                      value={feedbackForm.rating}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: e.target.value })}
                      placeholder="8"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Feedback *</Label>
                    <Textarea
                      id="content"
                      value={feedbackForm.content}
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, content: e.target.value })}
                      required
                      placeholder="Share your thoughts about the candidate..."
                      rows={5}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Submitting..." : "Submit Feedback"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Feedbacks List */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Feedback ({feedbacks.length})</CardTitle>
                <CardDescription>
                  Reviews from interview panelists
                </CardDescription>
              </CardHeader>
              <CardContent>
                {feedbacks.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No feedback yet. Be the first to add feedback!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {feedbacks.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">{feedback.panelist}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {feedback.rating && (
                            <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="font-semibold">{feedback.rating}/10</span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 whitespace-pre-wrap">{feedback.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
