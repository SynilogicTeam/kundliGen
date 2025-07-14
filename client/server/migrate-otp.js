// Migration script to clean up legacy email verification token fields
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration function
const migrateToOTP = async () => {
  try {
    console.log('🔄 Starting migration to OTP-based verification...\n');

    // Get the User collection
    const db = mongoose.connection.db;
    const userCollection = db.collection('users');

    // Find users with legacy fields
    const usersWithLegacyFields = await userCollection.find({
      $or: [
        { emailVerificationToken: { $exists: true } },
        { emailVerificationExpires: { $exists: true } },
        { resetPasswordToken: { $exists: true } },
        { resetPasswordExpires: { $exists: true } },
        { otp: { $exists: true } },
        { otpExpires: { $exists: true } }
      ]
    }).toArray();

    console.log(`📊 Found ${usersWithLegacyFields.length} users with legacy fields`);

    if (usersWithLegacyFields.length === 0) {
      console.log('✅ No users with legacy fields found. Migration complete!');
      return;
    }

    // Update each user to remove legacy fields
    let updatedCount = 0;
    for (const user of usersWithLegacyFields) {
      try {
        await userCollection.updateOne(
          { _id: user._id },
          {
            $unset: {
              emailVerificationToken: "",
              emailVerificationExpires: "",
              resetPasswordToken: "",
              resetPasswordExpires: "",
              otp: "",
              otpExpires: ""
            }
          }
        );
        updatedCount++;
        console.log(`✅ Updated user: ${user.email || user._id}`);
      } catch (error) {
        console.error(`❌ Error updating user ${user._id}:`, error.message);
      }
    }

    console.log(`\n🎉 Migration completed!`);
    console.log(`📈 Updated ${updatedCount} users`);
    console.log(`📋 Legacy fields removed: emailVerificationToken, emailVerificationExpires, resetPasswordToken, resetPasswordExpires, otp, otpExpires`);

    // Verify migration
    const remainingLegacyUsers = await userCollection.find({
      $or: [
        { emailVerificationToken: { $exists: true } },
        { emailVerificationExpires: { $exists: true } },
        { resetPasswordToken: { $exists: true } },
        { resetPasswordExpires: { $exists: true } },
        { otp: { $exists: true } },
        { otpExpires: { $exists: true } }
      ]
    }).toArray();

    if (remainingLegacyUsers.length === 0) {
      console.log('✅ Verification: All legacy fields have been successfully removed!');
    } else {
      console.log(`⚠️  Warning: ${remainingLegacyUsers.length} users still have legacy fields`);
    }

  } catch (error) {
    console.error('❌ Migration error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Database connection closed');
  }
};

// Run migration
const runMigration = async () => {
  await connectDB();
  await migrateToOTP();
  process.exit(0);
};

runMigration().catch(console.error); 