import { NextResponse } from "next/server";
import { getVehicle, updateVehicle, deleteVehicle, needsMaintenance, setMaintenance } from "@/controllers/VehicleController";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const v = await getVehicle(params.id);
  if (!v) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ...v, needsMaintenance: await needsMaintenance(v) });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  await updateVehicle(params.id, body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await deleteVehicle(params.id);
  return NextResponse.json({ ok: true });
}

// Endpoint to register maintenance: PATCH /api/vehicles/:id/maintain
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  // Expects body optional, simply sets lastMaintenanceKm = current km
  await setMaintenance(params.id);
  return NextResponse.json({ ok: true });
}
