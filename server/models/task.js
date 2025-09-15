const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  dueDate: { type: Date },
  priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
  category: { type: String, default: "Others" },
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model("Task", TaskSchema);
