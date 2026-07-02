require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const csvFilePath = __dirname + '/../MTTF_2021_Members.csv';

// Helper function to extract string from PHP serialized array like 'a:1:{i:0;s:13:"Master Degree";}'
function extractPhpString(str) {
  if (!str) return '';
  const match = str.match(/s:\d+:"([^"]+)"/);
  return match ? match[1] : str;
}

const importData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    const usersToInsert = [];
    let count = 0;
    
    // Hash a common default password once to save time
    console.log('Hashing default password (MTTF2021!)...');
    const defaultPassword = await bcrypt.hash('MTTF2021!', 12);

    console.log('Reading CSV file...');
    
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Skip rows without an email
        if (!row['User Email']) return;

        const firstName = row['First Name'] || row['first_name'] || '';
        const lastName = row['Last Name'] || '';
        const fullName = `${firstName} ${lastName}`.trim() || 'Unknown Member';
        
        let phoneStr = extractPhpString(row['phone_number']).replace(/\D/g, ''); // Extract only digits
        if (phoneStr.length < 5) phoneStr = undefined; // Don't save invalid phones to avoid unique index conflict

        const userObj = {
          email: row['User Email'].trim().toLowerCase(),
          name: fullName,
          password: defaultPassword,
          membershipType: 'individual', // Default
          isEmailVerified: true,
          isMembershipPaid: !!row['MTTF Member ID'], // True if they have an ID
          membershipId: row['MTTF Member ID'] || undefined,
          phone: phoneStr,
          legacyRegisteredDate: row['User Registered'] ? new Date(row['User Registered']) : undefined,
          legacyUniversity: extractPhpString(row['billing_university']),
          legacyDepartment: extractPhpString(row['department_name']),
          legacyJobTitle: extractPhpString(row['job_title']),
          legacyEducationLevel: extractPhpString(row['education_level'])
        };

        usersToInsert.push(userObj);
        count++;
      })
      .on('end', async () => {
        console.log(`Finished reading CSV. Extracted ${count} members.`);
        console.log('Saving to database in bulk... This may take a few seconds.');
        
        let successCount = 0;
        let failCount = 0;

        for (const user of usersToInsert) {
          try {
            const existing = await User.findOne({ email: user.email });
            if (!existing) {
              await User.create(user);
              successCount++;
            } else {
              // Update existing user with legacy data if found
              existing.isMembershipPaid = true;
              existing.isEmailVerified = true;
              if (user.membershipId && !existing.membershipId) existing.membershipId = user.membershipId;
              existing.legacyUniversity = user.legacyUniversity;
              existing.legacyJobTitle = user.legacyJobTitle;
              existing.legacyDepartment = user.legacyDepartment;
              await existing.save();
              successCount++;
            }
          } catch (err) {
            failCount++;
            console.error(`Error saving user ${user.email}:`, err.message);
          }
        }

        console.log(`Migration Complete! Successfully imported/updated ${successCount} members. Failed: ${failCount}`);
        process.exit(0);
      });
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

importData();
