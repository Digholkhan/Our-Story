# Firebase setup

## 1. Create the Firebase project

1. Create a project at https://console.firebase.google.com.
2. Add a Web App and copy its configuration values.
3. Enable Authentication providers: Email/Password and Google.
4. Enable email verification by using Firebase Authentication email templates.
5. Create a Firestore database in production mode.
6. Create a Realtime Database and choose a region. It is used for presence only.
7. Create a Storage bucket.
8. In Authentication > Settings > Authorized domains, add `weeding-gift.vercel.app` and your local host.

## 2. Configure the app

Copy `.env.example` to `.env.local` and fill in the Web App values:

```text
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_COUPLE_ID=
```

`VITE_FIREBASE_COUPLE_ID` is the ID of the one couple document used by this wedding site. Create `couples/{id}` with `memberIds: []`, then after each user registers set their `users/{uid}.coupleId` to that ID in the Firebase console. Add both UIDs to `memberIds`. This manual bootstrap prevents a new user from choosing another couple.

## 3. Deploy rules

Install the Firebase CLI, log in, select the project, and deploy rules:

```bash
npm install -g firebase-tools
firebase login
firebase use <your-project-id>
firebase deploy --only firestore:rules,storage,database
```

The rules intentionally deny private couple data until the user's profile has the matching `coupleId`. Public timeline, public memories, and approved guest messages remain readable for the landing experience. Memories and all other couple content are stored in **Firestore** under `couples/{coupleId}/...`; uploaded files are stored in **Storage**. The Realtime Database contains presence data under `status/{uid}`.

## 4. Run locally

```bash
npm install
npm run dev
```

Configure Email/Password and Google in the Firebase console before testing sign-in. A configured Firebase project is required for production; with no environment variables the existing local demo fallback is used.

## 5. Deploy to Vercel

1. Import the repository into Vercel.
2. Add all `.env.example` variables in Project Settings > Environment Variables, including `VITE_FIREBASE_COUPLE_ID`.
3. Redeploy after saving the variables. Vite variables are compiled into the deployment, so changing a Vercel variable without a new deployment does not change the running app.
4. Confirm `weeding-gift.vercel.app` is an authorized Firebase domain.

When testing a memory upload, open the browser console. A failed Firestore or Storage write is reported there and the memory save now waits for the metadata write before completing. Check Firestore, not Realtime Database, for the memory document.

The Firebase Web config is not an admin credential. Never add service-account JSON or Admin SDK credentials to this frontend repository.

## Data model

- `users/{uid}`: profile, provider, verification state, role, and couple membership.
- `couples/{coupleId}/settings/profile`: couple profile.
- `couples/{coupleId}/{collection}/{id}`: albums, memories, timeline, letters, calendar events, date ideas, goals, bucket list, future memories, love reasons, notes, songs, surprises, guest messages, and chat messages.
- `status/{uid}` in Realtime Database: online/offline presence.
- `couples/{coupleId}/...` in Storage: authenticated image/audio media and metadata references.

## Spark plan notes

The app limits Firestore subscriptions to 200 records and rejects uploads over 25 MB. Storage, Firestore reads/writes, Authentication, and Realtime Database remain subject to Firebase Spark quotas. Large galleries and audio libraries should be kept small; media compression and pagination can be added as the collection grows.
