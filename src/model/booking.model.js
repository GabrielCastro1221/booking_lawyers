const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    lawyer: { type: Schema.Types.ObjectId, ref: "Lawyer", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appointment_date: { type: Date, required: true },
    is_paid: {
      type: String,
      enum: ["Pagada", "No pagada"],
      default: "No pagada",
    },
    ticket_price: { type: Number, required: true },
    type: {
      type: String,
      enum: ["presencial", "online"],
      default: "presencial",
    },
    status: {
      type: String,
      enum: ["pendiente", "aprobada", "cancelada"],
      default: "pendiente",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Bookings", schema);
