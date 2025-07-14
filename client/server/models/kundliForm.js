import mongoose from 'mongoose';

const kundliFormSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
},
{ timestamps: true }
);

// Create a 2dsphere index on the location field
kundliFormSchema.index({ location: "2dsphere" });

const KundliForm = mongoose.model("KundliForm", kundliFormSchema);

export default KundliForm;
