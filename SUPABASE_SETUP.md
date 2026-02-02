# Supabase Storage Setup Guide

## 🎯 Overview

This project uses **Supabase Storage** for all MP3 file uploads.  
**Firebase has been completely removed.**

### Architecture
```
Frontend (Vercel) → Backend API (Render) → Supabase Storage
```

- Frontend sends files to `POST /upload-audio`
- Backend uploads to Supabase (keeps credentials secure)
- Backend returns public URL
- Frontend uses URL to play audio

---

## 📋 Requirements Checklist

### ☑ Step 1: Create Supabase Account & Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Start your project"** → Sign up
3. Click **"New Project"**
4. Fill in:
   - **Name**: `ai-dj-mixing`
   - **Database Password**: Create strong password (save it!)
   - **Region**: Choose closest to you
5. Click **"Create new project"** → Wait 2-3 minutes

---

### ☑ Step 2: Get Your Supabase Credentials

1. In your project, go to **Settings** (gear icon) → **API**
2. Copy these values:

| Credential | Where to Use |
|------------|--------------|
| **Project URL** (`https://xxxxx.supabase.co`) | `SUPABASE_URL` env variable |
| **service_role key** (secret) | `SUPABASE_SERVICE_KEY` env variable |

⚠️ **IMPORTANT**: Use `service_role` key (NOT `anon public` key)  
⚠️ **KEEP SECRET**: Never commit this key to Git or expose it in frontend code

---

### ☑ Step 3: Create Storage Bucket

1. In Supabase Dashboard, click **Storage** (left sidebar)
2. Click **"New bucket"**
3. Configure:
   - **Name**: `audio-files` (must match code)
   - **Public bucket**: ✅ Toggle **ON**
4. Click **"Create bucket"**

---

### ☑ Step 4: Set Storage Policies

1. Click on your `audio-files` bucket
2. Click **"Policies"** tab
3. Click **"New Policy"** → **"For full customization"**

**Policy 1 - Allow Backend Uploads:**
```sql
-- Name: Allow backend uploads
-- Allowed operation: INSERT
-- Policy definition:
true
```

**Policy 2 - Allow Public Read:**
```sql
-- Name: Allow public read
-- Allowed operation: SELECT
-- Policy definition:
true
```

Or use quick template: **"Enable access to anyone"** for testing.

---

### ☑ Step 5: Add Environment Variables to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your backend service (`aidj-backend`)
3. Go to **Environment** tab
4. Add these variables:

```bash
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

5. Click **"Save Changes"**

---

### ☑ Step 6: Install Python Dependency

The backend requires the `supabase` Python package. It's already in `requirements.txt`:

```txt
supabase>=2.0.0
```

If deploying to Render, it will install automatically.

For local development:
```bash
cd backend
pip install -r requirements.txt
```

---

### ☑ Step 7: Deploy Backend

1. Commit all changes:
```bash
git add .
git commit -m "Replace Firebase with Supabase Storage"
git push
```

2. In Render Dashboard:
   - Click **"Manual Deploy"** → **"Deploy latest commit"**
   - Wait for deployment to complete (~2-3 minutes)

---

## 🧪 Step 8: Test the Upload Endpoint

### Test with cURL:

```bash
curl -X POST -F "file=@your-song.mp3" https://aidj-backend.onrender.com/upload-audio
```

**Expected Response:**
```json
{
  "success": true,
  "url": "https://xxxxx.supabase.co/storage/v1/object/public/audio-files/songs/your-song.mp3",
  "filename": "your-song.mp3",
  "message": "File uploaded successfully to Supabase Storage"
}
```

### Test with Postman:

1. Open Postman
2. Create **POST** request to `https://aidj-backend.onrender.com/upload-audio`
3. Go to **Body** tab → Select **form-data**
4. Add key: `file` (change type to **File**)
5. Select an MP3 file
6. Click **Send**
7. Copy the returned `url`
8. Open URL in browser → Audio should play

---

## 🎨 Frontend Integration

The frontend is already configured to use Supabase via the backend API.

### Upload function location:
- `frontend/src/lib/supabaseUpload.ts`

### Usage example:
```typescript
import { uploadToSupabase } from '@/lib/supabaseUpload';

const result = await uploadToSupabase(file, (progress) => {
  console.log(`Upload: ${progress.percent}%`);
});

if (result.success) {
  console.log('File URL:', result.url);
}
```

---

## 📊 What You Should Have

After completing all steps, you should have:

| Artifact | Description |
|----------|-------------|
| ✅ Supabase Project | Created at supabase.com |
| ✅ Project URL | `https://xxxxx.supabase.co` |
| ✅ service_role key | Secret key (64+ characters) |
| ✅ audio-files bucket | Public bucket in Supabase Storage |
| ✅ Storage policies | INSERT and SELECT policies enabled |
| ✅ Render env vars | SUPABASE_URL and SUPABASE_SERVICE_KEY set |
| ✅ Working endpoint | POST /upload-audio returns URL |
| ✅ Test upload | At least one MP3 uploaded successfully |
| ✅ Public URL works | URL opens and plays audio in browser |

---

## 🔍 Troubleshooting

### Error: "Storage service not configured"
- Check that `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` are set in Render
- Redeploy backend after adding env vars

### Error: "Permission denied"
- Check storage policies in Supabase Dashboard
- Ensure bucket is set to **Public**
- Try using the "Enable access to anyone" template

### Error: "File already exists"
- This is normal - Supabase returns the existing URL
- To overwrite, delete the file first via `/api/upload/{filename}` DELETE endpoint

### Upload works but URL doesn't play
- Check that bucket is **Public**
- Verify SELECT policy is enabled
- Try opening URL in incognito/private window

---

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/upload-audio` | POST | Upload MP3 file |
| `/api/upload/files` | GET | List all uploaded files |
| `/api/upload/{filename}` | DELETE | Delete a file |

---

## 🔒 Security Notes

- **service_role key** has full database access - keep it secret
- Never expose Supabase credentials in frontend code
- Backend validates file type (MP3 only) and size (50MB max)
- All uploads go through backend for security

---

## 💰 Supabase Free Tier Limits

| Resource | Free Tier |
|----------|-----------|
| Storage | 1 GB |
| Bandwidth | 2 GB/month |
| Database | 500 MB |

For production, monitor usage and upgrade if needed.

---

## ✅ Final Check

Before considering setup complete, verify:

1. ✅ Upload an MP3 via Postman/cURL → Get URL
2. ✅ Open URL in browser → Audio plays
3. ✅ Check Supabase Dashboard → File appears in `audio-files/songs/`
4. ✅ Frontend upload UI → Works without errors

---

**Setup Complete! 🎉**

Your project now uses Supabase Storage for all file uploads.
Firebase has been completely removed.
