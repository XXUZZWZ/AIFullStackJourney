import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { error: 'API endpoint not found' },
    { status: 404 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: 'API endpoint not found' },
    { status: 404 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'API endpoint not found' },
    { status: 404 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'API endpoint not found' },
    { status: 404 }
  );
}
