import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["active","completed"],
            default: "active"
        },
        CompleteAt: {
            type: Date,
            default: null
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true, // createAt and updateAt automaticially
    }
);

const Task = mongoose.model("Task", TaskSchema);
export default Task;