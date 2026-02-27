require('dotenv').config();
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB before accepting requests (avoids buffering timeout)
let dbReady = null;
if (process.env.MONGODB_URI) {
  dbReady = connectDB().catch(err => {
    console.error('DB connection failed:', err.message);
    throw err;
  });
}

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static files (Vercel serves public/ via CDN; this helps local dev)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home - institute details + verify student form (single page)
app.get('/', (req, res) => {
  res.render('home', {
    error: req.query.error || null,
    enrollmentId: req.query.enrollmentId || ''
  });
});

// Ensure DB is connected before running queries
const ensureDb = async (req, res, next) => {
  if (dbReady) {
    try {
      await dbReady;
    } catch (err) {
      return res.render('home', { error: 'Database connection failed. Please try again later.', enrollmentId: req.query?.enrollmentId || req.body?.enrollmentId || '' });
    }
  }
  next();
};

// GET /verify with no enrollmentId → redirect to home; with enrollmentId → lookup and show result or home with error
app.get('/verify', ensureDb, async (req, res) => {
  const enrollmentId = (req.query.enrollmentId || '').trim().toUpperCase();
  if (!enrollmentId) {
    return res.redirect('/#verify-student');
  }
  try {
    const student = await Student.findOne({ enrollmentNumber: enrollmentId });
    if (student) return res.render('result', { student, valid: true });
    return res.redirect('/?error=' + encodeURIComponent('No student found with this Enrollment Number.') + '&enrollmentId=' + encodeURIComponent(enrollmentId) + '#verify-student');
  } catch (err) {
    console.error('Verify error:', err);
    return res.redirect('/?error=' + encodeURIComponent('Something went wrong. Please try again.') + '&enrollmentId=' + encodeURIComponent(enrollmentId) + '#verify-student');
  }
});

app.post('/verify', ensureDb, async (req, res) => {
  const enrollmentId = (req.body.enrollmentId || '').trim().toUpperCase();
  if (!enrollmentId) {
    return res.render('home', { error: 'Please enter an Enrollment Number.', enrollmentId: '' });
  }
  try {
    const student = await Student.findOne({
      enrollmentNumber: enrollmentId
    });
    if (student) {
      return res.render('result', { student, valid: true });
    }
    return res.render('home', {
      error: 'No student found with this Enrollment Number.',
      enrollmentId: enrollmentId
    });
  } catch (err) {
    console.error('Verify error:', err);
    return res.render('home', {
      error: 'Something went wrong. Please try again.',
      enrollmentId: enrollmentId
    });
  }
});

// Health check for Vercel
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404
app.use((req, res) => {
  res.status(404).render('not-found');
});

// Start server locally only after DB is ready (Vercel uses the exported app)
if (!process.env.VERCEL) {
  (async () => {
    if (dbReady) await dbReady;
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })().catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = app;
