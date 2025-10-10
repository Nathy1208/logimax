import { NextResponse } from "next/server";
import { getDriver, updateDriver, deleteDriver } from "@/controllers/DriverController";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const d = await getDriver(params.id);
  if (!d) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(d);
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  await updateDriver(params.id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await deleteDriver(params.id);
  return NextResponse.json({ ok: true });
}
