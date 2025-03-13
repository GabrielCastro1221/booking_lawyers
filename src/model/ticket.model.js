const { Schema, model } = require("mongoose");

const schema = new Schema(
  {
    code: { type: String, required: true },
    amount: { type: Number, required: true },
    appointment_date: { type: Date, required: true },
    lawyer: { type: Schema.Types.ObjectId, ref: "Lawyer", required: true },
    users: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bookings: { type: Schema.Types.ObjectId, ref: "Bookings", required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("Tickets", schema);
