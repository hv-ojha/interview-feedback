import { promises as fs } from 'fs';
import path from 'path';
import { Database, Interview, Feedback } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

const defaultDb: Database = {
  interviews: [],
  feedbacks: [],
};

async function ensureDbExists() {
  try {
    await fs.access(DB_PATH);
  } catch {
    const dir = path.dirname(DB_PATH);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(defaultDb, null, 2));
  }
}

export async function readDb(): Promise<Database> {
  await ensureDbExists();
  const data = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

export async function writeDb(db: Database): Promise<void> {
  await ensureDbExists();
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

// Interview operations
export async function getAllInterviews(): Promise<Interview[]> {
  const db = await readDb();
  return db.interviews.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function getInterviewById(id: string): Promise<Interview | null> {
  const db = await readDb();
  return db.interviews.find(i => i.id === id) || null;
}

export async function createInterview(
  data: Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Interview> {
  const db = await readDb();
  const interview: Interview = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.interviews.push(interview);
  await writeDb(db);
  return interview;
}

export async function updateInterview(
  id: string,
  data: Partial<Omit<Interview, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Interview | null> {
  const db = await readDb();
  const index = db.interviews.findIndex(i => i.id === id);
  if (index === -1) return null;

  db.interviews[index] = {
    ...db.interviews[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await writeDb(db);
  return db.interviews[index];
}

export async function deleteInterview(id: string): Promise<boolean> {
  const db = await readDb();
  const index = db.interviews.findIndex(i => i.id === id);
  if (index === -1) return false;

  db.interviews.splice(index, 1);
  db.feedbacks = db.feedbacks.filter(f => f.interviewId !== id);
  await writeDb(db);
  return true;
}

// Feedback operations
export async function getFeedbacksByInterviewId(interviewId: string): Promise<Feedback[]> {
  const db = await readDb();
  return db.feedbacks
    .filter(f => f.interviewId === interviewId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function createFeedback(
  data: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Feedback> {
  const db = await readDb();
  const feedback: Feedback = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  db.feedbacks.push(feedback);
  await writeDb(db);
  return feedback;
}

export async function updateFeedback(
  id: string,
  data: Partial<Omit<Feedback, 'id' | 'createdAt' | 'updatedAt' | 'interviewId'>>
): Promise<Feedback | null> {
  const db = await readDb();
  const index = db.feedbacks.findIndex(f => f.id === id);
  if (index === -1) return null;

  db.feedbacks[index] = {
    ...db.feedbacks[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };
  await writeDb(db);
  return db.feedbacks[index];
}

export async function deleteFeedback(id: string): Promise<boolean> {
  const db = await readDb();
  const index = db.feedbacks.findIndex(f => f.id === id);
  if (index === -1) return false;

  db.feedbacks.splice(index, 1);
  await writeDb(db);
  return true;
}

// Utility function to generate IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
