import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        clerkId: {
            type: String,
            required: true,
        },
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        image: {
            type: String,
            required: true,
        },
        creditBalance: {
            type: Number,
            required: true,
            default: 5,
        },
    }
)

const User = mongoose.model("User", userSchema);
export default User;