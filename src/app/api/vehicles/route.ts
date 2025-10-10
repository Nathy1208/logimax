import { NextResponse } from "next/server";
import { listVehicles, createVehicle, needsMaintenance } from "@/controllers/VehicleController";

export async function GET() {
  const list = await listVehicles();
  const enriched = await Promise.all(list.map(async (v:any) => ({ ...v, needsMaintenance: await needsMaintenance(v) })));
  return NextResponse.json(enriched);
}

export async function POST(req: Request) {
  const body = await req.json();
  if (!body.plate || !body.model || !body.year || body.km === undefined) {
    return NextResponse.json({ error: "Campos obrigatórios: plate, model, year, km" }, { status: 400 });
  }
  const v = await createVehicle(body);
  return NextResponse.json({ insertedId: v._id.toString() });
}
