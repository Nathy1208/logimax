import mongoose, { Schema, models } from "mongoose";

const tripSchema = new Schema({
  vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
  driverId: { type: Schema.Types.ObjectId, ref: "Driver", required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, enum: ["Agendada","Em Curso","Finalizada"], default: "Agendada" },
  startedAt: { type: Date },
  finishedAt: { type: Date },
  kmAtStart: { type: Number },
  kmAtEnd: { type: Number },
}, { timestamps: true });

const Trip = models.Trip || mongoose.model("Trip", tripSchema);
export default Trip;
