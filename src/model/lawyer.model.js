const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String },
    ticket_price: { type: Number },
    bio: { type: String },
    about: { type: String },
    photo: { type: String },
    role: { type: String },
    specialization: { type: String },
    education: { type: Array },
    experiences: { type: Array },
    timeSlots: { type: Array },
    isApproved: {
      type: String,
      enum: ["pendiente", "aprobado", "cancelado"],
      default: "pendiente",
    },
    booking: [{ type: Schema.Types.ObjectId, ref: "Bookings" }],
    token_reset: { token: String, expire: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Lawyer", schema);
