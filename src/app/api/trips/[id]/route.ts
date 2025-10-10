import { NextResponse } from "next/server";
import { getTrip, updateTrip, deleteTrip, finalizeTrip } from "@/controllers/TripController";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const t = await getTrip(params.id);
  if (!t) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(t);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();

  if (body.finalize) {
    await finalizeTrip(params.id, body.kmAtEnd);
    return NextResponse.json({ ok: true, finalized: true });
  }

  await updateTrip(params.id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await deleteTrip(params.id);
  return NextResponse.json({ ok: true });
}
