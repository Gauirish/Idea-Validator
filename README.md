# AI-Powered Startup Idea Validator

A modern, full-stack Monorepo web application that dynamically evaluates startup concepts. Users can submit a startup idea, and the platform utilizes Groq's Llama-3 LLM to perform lightning-fast market research, generating a deeply structured JSON report that assesses Risk Level, Competitor Analysis, Customer Personas, and Profitability.

## Tech Stack & Architecture
This project implements a clean **Monorepo Architecture** to ensure maximum API key security and scalability.

* Client (/client): React.js, Vite, React Router DOM, Pure CSS UI.
* Server (/server): Node.js, Express.js REST API.
* Database & Auth: Supabase (PostgreSQL).
* AI Engine: Groq API (Llama-3.3-70b-versatile).

---

## Local Installation Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone the repository
git clone https://github.com/Gauirish/Idea-Validator.git
cd Idea-Validator


### 2. Setup the Express Backend
cd server
npm install
Create a .env file inside the /server folder and add these API Keys:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```
Start the backend server on port 5000:
```bash
npm start
```

### 3. Setup the React Frontend
Open a **new, separate terminal** tab.
```bash
cd client
npm install
```
Create a `.env` file inside the `/client` folder:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```
*(Note: Because of dynamic routing, the frontend defaults to `localhost:5000/api` natively!)*

Start the frontend Vite server:
```bash
npm run dev
```

---

## 🤖 AI Development Methodology (Prompt Engineering Log)

This application was engineered using an **Agentic AI Pair-Programming workflow**. Below is the chronological blueprint of the prompts and directives we issued to the AI to construct this platform from scratch. This serves as verification of the AI-collaborative SDLC (Software Development Life Cycle):

### Phase 1: Core Interface & Authentication
> *"Without touching other files, make a frontend page cloning the layout for authentication and moving to a landing page."*

> *"Implement a ChatGPT-inspired interface. Create a dark sidebar for historical tracking, and a bright main-content area for the form."*

> *"Remove Firebase authentication and completely wire up Supabase Authentication with our custom AuthPage UI."*

### Phase 2: AI Backend Inference
> *"Remove the HuggingFace logic. We are moving with Groq to analyze our inputs instead. Connect the Groq API and prompt it to act as an expert startup consultant."*

> *"When returning the Groq response, force it to return a structured validation report in strict JSON format spanning: problemSummary, customerPersona, marketOverview, competitorList, Risk Level, and Profitability Score."*

> *"When I start a new search and submit, it must be automatically verified by Groq, and then recorded directly into our Supabase 'Ideas' table so historical searches work perfectly."*

### Phase 3: Monorepo Decoupling (Security Enhancements)
> *"Decouple the architecture. Shift from a frontend-only React dashboard into a professional full-stack application. Migrate all Groq SDK logic and Supabase database interactions into a standalone Node.js Express Backend."*

> *"Refactor the `FormPage.jsx` React file so it completely strips out backend SDKs, and instead communicates solely through `fetch()` intercepts targeting our new `localhost:5000/api`."*

### Phase 4: DevOps & Polishing
> *"Arrange every folder properly. Re-architect the filesystem into a clean Monorepo isolating the `client/` code from the `server/` code so the API keys are totally hidden."*

> *"Separate the embedded styling from FormPage directly into a scalable `App.css` global stylesheet."*

> *"Add visual polish. Ensure the Risk and Profit assessment UI renders in centered alignment, and dynamically pull in a lightbulb patterned image to use as the background across the landing and authentication wrappers."*
