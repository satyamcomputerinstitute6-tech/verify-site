# Student Verification Portal

Node.js + EJS app that connects to **MongoDB Atlas** to verify students by enrollment ID. Deployable on **Vercel**.

## Features

- Enter enrollment number to verify if a student is valid
- View full student info: name, father/mother name, session, gender, Aadhaar, registration number, exam centre
- View marksheet (subjects, marks, total)
- Placeholder links for Marksheet / Certificate download

## Setup

### 1. MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and note username/password.
3. In Network Access, allow access from anywhere (or add Vercel IPs if you prefer).
4. Get connection string: **Connect → Drivers → Node.js** and copy the URI. It looks like:
   ```text
   mongodb+srv://USER:PASSWORD@cluster.xxxxx.mongodb.net/DATABASE?retryWrites=true&w=majority
   ```
5. Replace `USER`, `PASSWORD`, and `DATABASE` with your values.

### 2. Local development

```bash
# Install dependencies
npm install

# Create .env (copy from .env.example)
# Add: MONGODB_URI=your_mongodb_atlas_uri

# Seed one sample student (Enrollment: E64953)
npm run seed

# Run server
npm start
```

Open **http://localhost:3000**, enter **E64953** and submit to see the sample student.

### 3. Deploy on Vercel

1. Push the project to a Git repo (GitHub/GitLab/Bitbucket).

2. In [Vercel Dashboard](https://vercel.com/new), import the repo.

3. Add **Environment Variable**:
   - **Name:** `MONGODB_URI`
   - **Value:** your MongoDB Atlas connection string  
   Apply to Production (and Preview if you want).

4. Deploy. Vercel will detect the Express app and use `server.js` automatically.

5. After first deploy, run the seed script **once** against the same database so the sample student exists:
   ```bash
   MONGODB_URI="your_atlas_uri" npm run seed
   ```

### Optional: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel link
# Set MONGODB_URI in Vercel project settings or: vercel env add MONGODB_URI
vercel --prod
```

## Project structure

- `server.js` – Express app, MongoDB connection, routes, EJS views
- `config/db.js` – MongoDB connection
- `models/Student.js` – Student schema
- `views/` – EJS templates (index, result, not-found)
- `public/css/style.css` – Styles (served from `public/` on Vercel)
- `scripts/seed.js` – Seed one sample student

## Routes

- `GET /` – Form to enter enrollment number
- `POST /verify` – Verify by enrollment ID and show result or error
- `GET /verify?enrollmentId=E64953` – Same via query string
- `GET /api/health` – Health check

## Adding more students

Use MongoDB Compass or Atlas UI, or create a small script that uses the same `Student` model and `Student.create()` with the same field names as in `scripts/seed.js`.
