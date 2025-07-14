import mongoose from 'mongoose';

const ConfigSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'Astrology Reports'
  },
  companyEmail: {
    type: String,
    default: 'info@astrologyreports.com'
  },
  companyPhone: {
    type: String,
    default: '+91-9876543210'
  },
  companyAddress: {
    type: String,
    default: '123 Astrology Street, Mumbai, Maharashtra, India'
  },
  companyLogo: {
    type: String,
    default: ''
  },
  
  // Payment Gateway Settings
  razorpayKeyId: {
    type: String,
    default: 'rzp_test_key'
  },
  razorpayKeySecret: {
    type: String,
    default: 'test_secret'
  },
  
  // Email Settings
  emailProvider: {
    type: String,
    enum: ['smtp', 'sendgrid'],
    default: 'smtp'
  },
  smtpHost: {
    type: String,
    default: 'smtp.gmail.com'
  },
  smtpPort: {
    type: Number,
    default: 587
  },
  smtpUser: { //email
    type: String,
    default: ''
  },
  smtpPassword: { //password
    type: String,
    default: ''
  },
  sendgridApiKey: {
    type: String,
    default: ''
  },
  
  // API Keys
  astrologyApiKey: {
    type: String,
    default: ''
  },
  divineApiKey: {
    type: String,
    default: ''
  },
  googleMapsApiKey: {
    type: String,
    default: ''
  },
  
  // Report Settings
  reportDeliveryHours: {
    type: Number,
    default: 12
  }
}, { timestamps: true });



export default mongoose.model('Config', ConfigSchema);