import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  pdfReportType: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  divineReportType: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Report', ReportSchema);