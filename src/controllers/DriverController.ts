import Driver from "@/models/Driver";
import { connectDB } from "@/services/mongoose";
import { Types } from "mongoose";

export async function listDrivers() {
  await connectDB();
  return Driver.find().lean();
}

export async function getDriver(id: string) {
  await connectDB();
  if (!Types.ObjectId.isValid(id)) return null;
  return Driver.findById(id).lean();
}

export async function createDriver(data: any) {
  await connectDB();
  const d = new Driver(data);
  await d.save();
  return d;
}

export async function updateDriver(id: string, data: any) {
  await connectDB();
  return Driver.findByIdAndUpdate(id, data, { new: true }).lean();
}

export async function deleteDriver(id: string) {
  await connectDB();
  return Driver.findByIdAndDelete(id);
}
