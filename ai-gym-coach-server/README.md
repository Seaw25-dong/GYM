# AI Gym Coach Server

Node.js + Express + MongoDB backend for the AI Gym Coach app.

## What It Stores

- User profile / assessment:
  - age, sex, height, weight, bodyFat
  - activity, gymDays, sportDays, experience
  - goal: `fat_loss`, `muscle_gain`, `recomp`
- Workout logs:
  - workout name
  - exercise sets, weight, reps
- AI generated plans:
  - calculated plan snapshot
  - generated workout plan
  - generated nutrition plan
  - coach notes
- Users:
  - email
  - password hash
  - email verification token with 10-minute expiry

## What It Calculates

- BMI
- BMR using Mifflin-St Jeor
- TDEE using activity multiplier and weekly gym/sport adjustment
- Target calories by goal
- Protein, carbs, fat
- Workout split
- Meal plan

## Local Setup

```bash
cd ai-gym-coach-server
npm install
copy .env.example .env
npm run dev
```

Set `MONGODB_URI` in `.env` to a MongoDB Atlas connection string.

## Environment Variables

```bash
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/ai-gym-coach?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:3000
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_MODEL=gpt-4.1-mini
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
MAIL_FROM=AI Gym Coach <no-reply@example.com>
```

For production, set `CORS_ORIGIN` to your deployed frontend URL. Multiple origins can be comma-separated.

## API

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Password must be longer than 8 characters. The server sends a verification email with a link that expires in 10 minutes. If SMTP is not configured, the verification link is printed in the server console for local testing.

### Verify Email

```http
GET /api/auth/verify-email?token=TOKEN_FROM_EMAIL
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Returns a JWT token.

### Current User

```http
GET /api/auth/me
Authorization: Bearer JWT_TOKEN
```

### Health

```http
GET /api/health
```

### Create Profile And Plan

```http
POST /api/profiles
Content-Type: application/json

{
  "displayName": "Athlete",
  "age": 25,
  "sex": "male",
  "height": 175,
  "weight": 75,
  "bodyFat": 15,
  "activity": "light",
  "gymDays": 4,
  "sportDays": 1,
  "experience": "intermediate",
  "goal": "muscle_gain"
}
```

### Get Profile And Plan

```http
GET /api/profiles/:profileId
```

### Calculate Plan Without Saving

```http
POST /api/plans/calculate
Content-Type: application/json
```

Uses the same body shape as profile creation.

### Get Nutrition

```http
GET /api/plans/:profileId/nutrition
```

### Get Workouts

```http
GET /api/plans/:profileId/workouts
```

### Save Workout Log

```http
POST /api/workouts/:profileId/logs
Content-Type: application/json

{
  "workoutName": "Push",
  "sets": [
    {
      "exerciseName": "Bench Press",
      "weight": 80,
      "reps": 8
    }
  ]
}
```

### Generate AI Plan

Generate from an existing saved profile:

```http
POST /api/ai/plans/generate
Content-Type: application/json

{
  "profileId": "PROFILE_ID"
}
```

Generate from raw profile data without saving the profile:

```http
POST /api/ai/plans/generate
Content-Type: application/json

{
  "age": 25,
  "sex": "male",
  "height": 175,
  "weight": 75,
  "bodyFat": 15,
  "activity": "light",
  "gymDays": 4,
  "sportDays": 1,
  "experience": "intermediate",
  "goal": "muscle_gain"
}
```

Generate from raw profile data and save the profile first:

```http
POST /api/ai/plans/generate
Content-Type: application/json

{
  "saveProfile": true,
  "profile": {
    "displayName": "Athlete",
    "age": 25,
    "sex": "male",
    "height": 175,
    "weight": 75,
    "bodyFat": 15,
    "activity": "light",
    "gymDays": 4,
    "sportDays": 1,
    "experience": "intermediate",
    "goal": "muscle_gain"
  }
}
```

The response includes:

- `calculatedPlan`: deterministic BMI/BMR/TDEE/calories/macros
- `generatedPlan`: AI-generated workout plan, meal plan and coach notes
- `savedPlan`: MongoDB document when a saved profile is used

AI workout plan constraints:

- Each training day has 5-6 exercises.
- Each exercise includes `muscleGroup`, `sets`, `reps`, `restSeconds`, `note`, and `mediaSearchQuery`.

AI nutrition plan constraints:

- Each meal includes `calories`.
- Each food item includes `name` and `grams`.

### Get Latest AI Plan

```http
GET /api/ai/plans/:profileId/latest
```

## Render Deploy

1. Create a MongoDB Atlas cluster.
2. Add your Render outbound IPs to Atlas Network Access, or allow access from anywhere for early testing.
3. Create a Render Web Service from this folder.
4. Use:
   - Build command: `npm install`
   - Start command: `npm start`
5. Add env vars:
   - `MONGODB_URI`
   - `CORS_ORIGIN`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `FRONTEND_URL`
   - SMTP variables if sending real email
   - `NODE_ENV=production`

## Exercise Media APIs

The current app stores `mediaSearchQuery` for each exercise so a media provider can be added later.

Useful options:

- API Ninjas Exercises API: provides exercise name, type, muscle, difficulty, instructions, equipment and safety info.
- ExerciseDB/RapidAPI-style datasets: often provide animated GIF URLs, body part, target muscle and equipment, but availability/pricing depends on the provider.
- A self-hosted media library: best if you want stable Vietnamese explanations, anatomy overlays, and no third-party quota risk.
