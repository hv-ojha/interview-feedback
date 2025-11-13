import { NextRequest, NextResponse } from 'next/server';
import { getFeedbacksByInterviewId, createFeedback } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const feedbacks = await getFeedbacksByInterviewId(id);
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedbacks' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { panelist, content, rating } = body;

    if (!panelist || !content) {
      return NextResponse.json(
        { error: 'Panelist and content are required' },
        { status: 400 }
      );
    }

    const feedback = await createFeedback({
      interviewId: id,
      panelist,
      content,
      rating,
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error('Error creating feedback:', error);
    return NextResponse.json(
      { error: 'Failed to create feedback' },
      { status: 500 }
    );
  }
}
