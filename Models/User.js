import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user",
    },
    contact: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

export const User = mongoose.model("Ecommerce", userSchema);
