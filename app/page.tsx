"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddInterviewDialog } from "@/components/add-interview-dialog";
import { Interview } from "@/lib/types";

export default function Home() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await fetch("/api/interviews");
      const data = await response.json();
      setInterviews(data);
    } catch (error) {
      console.error("Error fetching interviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterviewAdded = () => {
    fetchInterviews();
    setShowAddDialog(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interview Management System</h1>
            <p className="text-gray-600 mt-2">Manage interviews and collect feedback from panelists</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            Add Interviewee
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading interviews...</p>
          </div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No interviews yet. Add your first interviewee to get started.</p>
            <Button onClick={() => setShowAddDialog(true)}>
              Add First Interviewee
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviews.map((interview) => (
              <Link key={interview.id} href={`/interview/${interview.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-xl">{interview.name}</CardTitle>
                    <CardDescription>{interview.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-500">Added by:</span>
                        <span className="ml-2 font-medium">{interview.createdBy}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <span className="ml-2">
                          {new Date(interview.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {interview.resumePath && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Resume attached</span>
                        </div>
                      )}
                      {interview.jdPath && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>JD attached</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <AddInterviewDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={handleInterviewAdded}
        />
      </div>
    </div>
  );
}
