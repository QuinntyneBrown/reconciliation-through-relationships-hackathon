import { NextResponse } from "next/server";
import { getRepository } from "@/data";
import { participantIntakeSchema } from "@/domain/schema";

/**
 * Reference API route — copy this pattern for other resources.
 * Validate with the shared zod schema, then hand off to the repository.
 */
export async function GET() {
  const repo = getRepository();
  const participants = await repo.listParticipants();
  return NextResponse.json({ participants });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = participantIntakeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const repo = getRepository();
  const participant = await repo.createParticipant(parsed.data);
  return NextResponse.json({ participant }, { status: 201 });
}
