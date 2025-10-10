import Vehicle from "@/models/Vehicle";
import { connectDB } from "@/services/mongoose";
import { Types } from "mongoose";

const MAINT_INTERVAL = 10000;

export async function listVehicles() {
  await connectDB();
  return Vehicle.find().lean();
}

export async function getVehicle(id: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return null;
  return Vehicle.findById(id).lean();
}

export async function createVehicle(data: any) {
  await connectDB();
  const v = new Vehicle(data);
  await v.save();
  return v;
}

export async function updateVehicle(id: string, data: any) {
  await connectDB();
  return Vehicle.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteVehicle(id: string) {
  await connectDB();
  return Vehicle.findByIdAndDelete(id);
}

export async function needsMaintenance(vehicle: any) {
  const last = vehicle.lastMaintenanceKm ?? 0;
  return (vehicle.km - last) >= MAINT_INTERVAL;
}

export async function setMaintenance(id: string) {
  await connectDB();
  const v = await Vehicle.findById(id);
  if (!v) throw new Error("Veículo não encontrado");
  v.lastMaintenanceKm = v.km;
  await v.save();
  return v;
}
