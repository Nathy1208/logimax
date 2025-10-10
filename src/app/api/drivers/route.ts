import { NextResponse } from "next/server";
import { listDrivers, createDriver } from "@/controllers/DriverController";

export async function GET() {
  const list = await listDrivers();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.name || !body.license) {
    return NextResponse.json({ error: "Campos obrigatórios: name, license" }, { status: 400 });
  }
  const d = await createDriver(body);
  return NextResponse.json({ insertedId: d._id.toString() });
}
