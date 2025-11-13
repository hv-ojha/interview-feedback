import { NextRequest, NextResponse } from 'next/server';
import { getAllInterviews, createInterview } from '@/lib/db';

export async function GET() {
  try {
    const interviews = await getAllInterviews();
    return NextResponse.json(interviews);
  } catch (error) {
    console.error('Error fetching interviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, resumePath, jdPath, createdBy } = body;

    if (!name || !email || !createdBy) {
      return NextResponse.json(
        { error: 'Name, email, and createdBy are required' },
        { status: 400 }
      );
    }

    const interview = await createInterview({
      name,
      email,
      resumePath,
      jdPath,
      createdBy,
    });

    return NextResponse.json(interview, { status: 201 });
  } catch (error) {
    console.error('Error creating interview:', error);
    return NextResponse.json(
      { error: 'Failed to create interview' },
      { status: 500 }
    );
  }
}
