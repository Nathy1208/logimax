import mongoose, { Schema, models } from "mongoose";

const driverSchema = new Schema({
  name: { type: String, required: true },
  license: { type: String, required: true },
  phone: { type: String },
}, { timestamps: true });

const Driver = models.Driver || mongoose.model("Driver", driverSchema);
export default Driver;
