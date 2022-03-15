import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  isVirtual: {
    type: Boolean,
    required: true,
  },
  address: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Event = mongoose.model("Event", eventSchema);

export default Event;
