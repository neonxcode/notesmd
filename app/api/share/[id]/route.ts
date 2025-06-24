import { NextRequest, NextResponse } from 'next/server';

// This is a mock database. In a real application, you'd use a proper database.
const mockDb = new Map<string, { id: string; title: string; description: string }>();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const note = mockDb.get(id);

  if (note) {
    return NextResponse.json(note);
  } else {
    return NextResponse.json({ message: 'Note not found' }, { status: 404 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const note = await request.json();

  mockDb.set(id, note);
  return NextResponse.json({ message: 'Note saved for sharing' });
}