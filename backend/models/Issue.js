 import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true }, // e.g. "Water", "Electricity", "Roads"
    description: { type: String, required: true },
    location: { type: String, required: true }, // could be 'area'
    images: [{ type: String }],

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" ,required: true}, // citizen
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null }, // staff/admin
    status: {
      type: String,
      enum: ["open", "in progress", "resolved"],
      default: "open",
    },
    urgency: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    type: {
      type: String, // complaint type (e.g. sanitation, road damage)
    },

    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    comments: [
      {
        text: String,
        user: String, // or ObjectId if authenticated users comment
        createdAt: { type: Date, default: Date.now },
      },
    ],
    resolvedAt: { type: Date },
  },
  { timestamps: true },
  
);

export default mongoose.model("Issue", issueSchema);

 
 /*
 import mongoose from "mongoose";
const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    images: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    comments: [
      {
        text: String,
        user: String, // or ObjectId if you have auth
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);
export default mongoose.model("Issue", issueSchema);
*/



