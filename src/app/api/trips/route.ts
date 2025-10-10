import { NextResponse } from "next/server";
import { listTrips, createTrip } from "@/controllers/TripController";

export async function GET() {
  const list = await listTrips();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const body = await req.json();
  const required = ["vehicleId", "driverId", "origin", "destination"];
  for (const k of required) if (!body[k]) return NextResponse.json({ error: `Falta ${k}` }, { status: 400 });
  const t = await createTrip({
    vehicleId: body.vehicleId,
    driverId: body.driverId,
    origin: body.origin,
    destination: body.destination,
    status: body.status ?? "Agendada",
    startedAt: body.startedAt,
    finishedAt: body.finishedAt,
    kmAtStart: body.kmAtStart
  });
  return NextResponse.json({ insertedId: t._id.toString() });
}
