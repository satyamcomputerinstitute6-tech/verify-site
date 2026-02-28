/**
 * Seed script: add sample student to MongoDB Atlas.
 * Run: MONGODB_URI="your-uri" node scripts/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const Student = require('../models/Student');

const sampleStudent = {
  name: 'Manpreet Kaur',
  fatherName: 'Ramkaran Singh',
  motherName: 'Darshana Kaur',
  session: 'Nov 2025 To Jan 2026 (120 Hours)',
  course: 'Diploma in Computer Applications',
  gender: 'Female',
  enrollmentNumber: 'E64953',
  aadhaarNumber: '798268261968',
  registrationNumber: '13',
  examCentre: 'Satyam Computer Institute',
  subjects: [
    { name: 'Knowing Computer', marksObtained: 91, outOf: 100 },
    { name: 'Operating Computer', marksObtained: 90, outOf: 100 },
    { name: 'Word Processing', marksObtained: 88, outOf: 100 },
    { name: 'Spread Sheet', marksObtained: 93, outOf: 100 },
    { name: 'Introduction to Internet', marksObtained: 91, outOf: 100 },
    { name: 'Making Small Presentation', marksObtained: 94, outOf: 100 },
    { name: 'Photoshop', marksObtained: 96, outOf: 100 },
    { name: 'Accounting (Tally)', marksObtained: 90, outOf: 100 }
  ],
  obtainedMarks: 733,
  totalMarks: 800,
  marksheetUrl: '',
  certificateUrl: ''
};

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('Set MONGODB_URI in .env or environment.');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    const existing = await Student.findOne({ enrollmentNumber: sampleStudent.enrollmentNumber });
    if (existing) {
      console.log('Student E64953 already exists. Skipping seed.');
    } else {
      await Student.create(sampleStudent);
      console.log('Sample student (E64953) added successfully.');
    }
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
