import mongoose, { Schema, models } from "mongoose";

const vehicleSchema = new Schema({
  plate: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  km: { type: Number, required: true },
  lastMaintenanceKm: { type: Number, default: 0 },
}, { timestamps: true });

const Vehicle = models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;
