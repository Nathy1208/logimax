import Trip from "@/models/Trip";
import { connectDB } from "@/services/mongoose";
import { Types } from "mongoose";
import Vehicle from "@/models/Vehicle";

export async function listTrips() {
  await connectDB();
  return Trip.find().lean();
}

export async function getTrip(id: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return null;
  return Trip.findById(id).lean();
}

export async function createTrip(data: any) {
  await connectDB();
  const t = new Trip(data);
  await t.save();
  return t;
}

export async function updateTrip(id: string, data: any) {
  await connectDB();
  return Trip.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function finalizeTrip(id: string, kmAtEnd?: number) {
  await connectDB();
  const t = await Trip.findById(id);
  if (!t) throw new Error("Viagem não encontrada");
  t.status = "Finalizada";
  t.finishedAt = new Date();
  if (kmAtEnd !== undefined) t.kmAtEnd = kmAtEnd;
  await t.save();

  // Atualiza veículo km
  if (kmAtEnd !== undefined) {
    const vehicle = await Vehicle.findById(t.vehicleId);
    if (vehicle) {
      vehicle.km = Math.max(vehicle.km, kmAtEnd);
      await vehicle.save();
    }
  }
  return t;
}

export async function deleteTrip(id: string) {
  await connectDB();
  return Trip.findByIdAndDelete(id);
}
