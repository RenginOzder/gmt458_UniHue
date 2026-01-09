// server/models/Event.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, min: 3 },
    description: { type: String, required: true, min: 3 },
    type: {
      type: String,
      required: true,
      // YENİ LİSTEN: study, coffee, eat, concert, theater, cinema, opera, cso
      enum: ['study', 'coffee', 'eat', 'concert', 'theater', 'opera', 'cso', 'cinema'], 
    },
    date: { type: Date, required: true },
    universityScope: { type: String, default: 'All' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    location: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
  },
  { timestamps: true }
);

EventSchema.index({ location: "2dsphere" });


module.exports = mongoose.model("Event", EventSchema);