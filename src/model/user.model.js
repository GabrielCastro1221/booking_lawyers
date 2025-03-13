const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    photo: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ["masculino", "femenino", "otro"],
      default: "otro",
    },
    role: {
      type: String,
      enum: ["usuario", "admin"],
      default: "usuario",
    },
    booking: [
      {
        type: Schema.Types.ObjectId,
        ref: "Bookings",
      },
    ],
    token_reset: { token: String, expire: Date },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = model("User", userSchema);
