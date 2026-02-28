const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  outOf: { type: Number, required: true }
}, { _id: false });

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fatherName: { type: String, required: true },
  motherName: { type: String, required: true },
  session: { type: String, required: true },
  course: { type: String, default: '' },
  gender: { type: String, required: true },
  enrollmentNumber: { type: String, required: true, unique: true },
  aadhaarNumber: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  examCentre: { type: String, required: true },
  subjects: [subjectSchema],
  obtainedMarks: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  marksheetUrl: { type: String, default: '' },
  certificateUrl: { type: String, default: '' }
}, { timestamps: true });

// unique: true on enrollmentNumber already creates an index

module.exports = mongoose.model('Student', studentSchema);
