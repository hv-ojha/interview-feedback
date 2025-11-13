export interface Interview {
  id: string;
  name: string;
  email: string;
  resumePath?: string;
  jdPath?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  interviewId: string;
  panelist: string;
  content: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Database {
  interviews: Interview[];
  feedbacks: Feedback[];
}
