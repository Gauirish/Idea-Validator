# Complete Deployment Guide

Before we begin the step-by-step guide, there is a very important detail about your architecture that you need to know.

> [!WARNING]
> **You do NOT need Railway for this project!** 
> 
> Even though you have a folder named `backend/`, you are not actually running a separate Node.js server (like Express.js or Python Django). Your files like `groqClient.js` and `supabaseClient.js` are currently being directly imported into your React components (like `FormPage.jsx`) and run entirely inside the user's browser. 
> 
> Because this is a **100% Frontend Single Page Application (SPA)**, the entire project can be hosted completely on **Vercel** for free!

Here are the step-by-step instructions to get your website live on Vercel:

## Step 1: Push Your Code to GitHub
Vercel needs a place to pull your code from.
1. Open your terminal in VS Code and stop the local server by pressing `Ctrl + C`.
2. Ensure you have Git initialized. Run: `git init`
3. Add all your files: `git add .`
4. Commit your files: `git commit -m "Ready for deployment"`
5. Go to [GitHub.com](https://github.com/) and create a new, empty repository.
6. Copy the commands GitHub gives you to "push an existing repository from the command line" and run them in your terminal. This will upload your code.

## Step 2: Connect to Vercel
1. Go to [Vercel.com](https://vercel.com/) and create an account or log in using your GitHub account.
2. Click the **"Add New..."** button and select **"Project"**.
3. You will see a list of your GitHub repositories. Find the one you just created and click **"Import"**.

## Step 3: Configure Vercel Settings
Vercel will ask you to configure the project. Because you are using Vite, Vercel will automatically detect almost everything, but you must manually configure your Environment Variables!

1. **Framework Preset**: Ensure Vercel detects this as **Vite**.
2. **Root Directory**: Since your `package.json` is in the main folder, leave this as `./`.
3. **Environment Variables**: Expand the "Environment Variables" section. You **MUST** add the exact keys from your local `.env` file here.
   - Name: `VITE_SUPABASE_URL` / Value: `(paste your url)` -> Click **Add**
   - Name: `VITE_SUPABASE_ANON_KEY` / Value: `(paste your key)` -> Click **Add**
   - Name: `VITE_GROQ_API_KEY` / Value: `(paste your key)` -> Click **Add**

> [!IMPORTANT]
> If you skip adding these Environment Variables on the Vercel dashboard, your app will deploy successfully but it will instantly crash on the login screen because it cannot talk to Supabase or Groq!

## Step 4: Deploy!
Once your environment variables are added, click the blue **"Deploy"** button. 
- Vercel will run `npm install` and `npm run build` on its own servers. 
- In about 1 to 2 minutes, your screen will explode in confetti, and you will be provided a live, public URL for your startup validator!

---

### Future Security Note
In a professional production setting, exposing your `VITE_GROQ_API_KEY` directly to the frontend browser means technically anyone who visits your site could find your Groq key and use it. Once you want to scale this beyond a portfolio project, you *would* build a separate Express.js server (which you would host on Railway) to hide that Groq API key securely. But for now, since you are just showcasing the application, Vercel is all you need!
