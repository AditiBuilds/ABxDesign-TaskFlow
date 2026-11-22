# TaskFlow — Live Deployment Guide

This guide provides step-by-step instructions to deploy **TaskFlow** to production for **100% free** with guaranteed database persistence and SSL/HTTPS.

---

## 🏗️ Recommended Production Architecture

| Component | Platform | Plan | Key Benefits |
| :--- | :--- | :--- | :--- |
| **Database** | [Neon](https://neon.tech) or [Supabase](https://supabase.com) | Free Tier | Serverless PostgreSQL with guaranteed persistence (no data loss on sleep/restart), instant setup, zero credit card required. |
| **Backend API** | [Render](https://render.com) | Free Web Service | Automated deployments from GitHub, free custom domain/SSL, environment variables management. |
| **Frontend UI** | [Vercel](https://vercel.com) | Free Hobby | Instant global CDN, fast edge deployment, zero configuration for Vite React apps. |

---

## Step 1: Create Free PostgreSQL Database (2 Minutes)

1. Go to **[Neon.tech](https://neon.tech)** (or [Supabase.com](https://supabase.com)) and sign up using your GitHub account.
2. Click **Create Project**:
   - Name: `taskflow-db`
   - Region: Choose the region closest to you (e.g., US East, Europe, or Asia).
   - Postgres Version: Default (v16 or latest).
3. Once created, copy your **Connection String** (`postgres://...` or `postgresql://...`).
   - Example: `postgresql://neondb_owner:npg_xyz@ep-cool-fog-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`

> 💡 **Keep this connection string ready** for Step 2.

---

## Step 2: Deploy Backend to Render (3 Minutes)

1. Go to **[Render.com](https://render.com)** and sign in with GitHub.
2. Click **New +** → **Web Service**.
3. Select your repository: **`AditiBuilds/ABxDesign-TaskFlow`**.
4. Configure the Web Service:
   - **Name**: `taskflow-backend` (or your preferred name)
   - **Region**: Same region as your Neon database (e.g., US East)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**:
     ```bash
     npm install && node scripts/switch-db.js postgresql && npx prisma db push && npm run build
     ```
   - **Start Command**:
     ```bash
     npm start
     ```
   - **Plan**: `Free`
5. Expand **Environment Variables** and add:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `DATABASE_URL` | `<Your Neon/Supabase PostgreSQL Connection String>` | Live database connection |
   | `NODE_ENV` | `production` | Production mode |
   | `CLIENT_URL` | `*` *(or your Vercel URL once created in Step 3)* | Allowed CORS origin |
6. Click **Deploy Web Service**.
7. Wait 2 minutes for Render to build. Once deployed, Render will provide your live backend URL:
   - Example: `https://taskflow-backend.onrender.com`
8. Verify your backend is live by opening:
   - `https://taskflow-backend.onrender.com/api/health` → Should return `{"status":"ok", ...}`

---

## Step 3: Deploy Frontend to Vercel (2 Minutes)

1. Go to **[Vercel.com](https://vercel.com)** and sign in with GitHub.
2. Click **Add New...** → **Project**.
3. Import your repository: **`AditiBuilds/ABxDesign-TaskFlow`**.
4. Configure the Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select **`client`**
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
5. Expand **Environment Variables** and add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | `https://your-backend-name.onrender.com` *(from Step 2)* |
6. Click **Deploy**.
7. In under 1 minute, Vercel will finish and provide your live frontend URL:
   - Example: `https://abxdesign-taskflow.vercel.app`

---

## Step 4: Seed Sample Data into Production Database (Optional, 1 Minute)

To populate the live database with the 8 realistic starter tasks:
In the Render dashboard for your Web Service, open the **Shell** tab and run:
```bash
npm run seed
```
Your live dashboard will instantly populate with tasks and metrics!

---

## Step 5: Final Live Verification Checklist

- [ ] Open `https://<your-backend>.onrender.com/api/health` → returns `{"status":"ok"}`.
- [ ] Open `https://<your-frontend>.vercel.app` → Dashboard displays live metrics.
- [ ] Click **Create Task** → Add a new task → verify toast notification and appearance in list.
- [ ] Click on task → verify detail modal and edit title.
- [ ] Toggle status to **Completed** → verify progress bar updates.
- [ ] Test on your mobile phone / browser responsive mode.
