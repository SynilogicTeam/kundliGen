// Test script for OTP functionality
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Test OTP generation
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Test email configuration
const testEmailConfig = async () => {
  console.log('Testing OTP and Email Configuration...\n');

  // Test OTP generation
  console.log('1. Testing OTP Generation:');
  for (let i = 0; i < 5; i++) {
    const otp = generateOTP();
    console.log(`   OTP ${i + 1}: ${otp} (${otp.length} digits)`);
  }
  console.log('');

  // Test email configuration
  console.log('2. Testing Email Configuration:');
  
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('   ❌ Email configuration missing!');
    console.log('   Please set EMAIL_USER and EMAIL_PASS in your .env file');
    return;
  }

  console.log(`   ✅ EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`   ✅ EMAIL_PASS: ${process.env.EMAIL_PASS ? '***configured***' : '❌ missing'}`);

  // Test email transporter
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    console.log('   ✅ Email transporter created successfully');
    
    // Test email sending (optional - uncomment to test)
    /*
    const testOtp = generateOTP();
    const emailHtml = `
      <h2>Test Email - KundliGen</h2>
      <p>This is a test OTP: <strong>${testOtp}</strong></p>
      <p>If you receive this, email configuration is working!</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: "Test OTP - KundliGen",
      html: emailHtml,
    });

    console.log('   ✅ Test email sent successfully!');
    */
    
  } catch (error) {
    console.log('   ❌ Email configuration error:', error.message);
  }

  console.log('');
  console.log('3. Environment Check:');
  console.log(`   ✅ JWT_SECRET: ${process.env.JWT_SECRET ? 'configured' : '❌ missing'}`);
  console.log(`   ✅ MONGODB_URI: ${process.env.MONGODB_URI ? 'configured' : '❌ missing'}`);
  console.log(`   ✅ PORT: ${process.env.PORT || 5000}`);

  console.log('');
  console.log('🎉 OTP System Test Complete!');
  console.log('');
  console.log('Next Steps:');
  console.log('1. Ensure all environment variables are set');
  console.log('2. Start the server: npm run dev');
  console.log('3. Test registration flow in the frontend');
  console.log('4. Check email for OTP delivery');
};

// Run the test
testEmailConfig().catch(console.error); 