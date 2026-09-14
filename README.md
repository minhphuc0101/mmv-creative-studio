# MMV Creative Studio - Dealer Marketing AI Platform
### Powered by Nano Banana Pro 2 & Gemini | Mitsubishi Motors Vietnam Brand Compliant

A corporate web application designed for Mitsubishi Motors Vietnam (MMV) dealership sales consultants to produce high-resolution, brand-certified marketing campaign visuals.

![Creative Studio UI](https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85)

---

## 🌟 Key Features

1. **Creative Studio UI**:
   - Clean, professional dealer marketing studio mirroring enterprise creative tooling.
   - Model integration with **`🍌 Nano Banana Pro 2 🍌`**.
   - Multiple aspect ratios: `Square (1:1)`, `Landscape (16:9)`, `Portrait (9:16)`, `Banner (4:3)`.
   - Resolution presets: `1K` preview and `2K` commercial high-definition.
   - Reference image conditioning with official MMV vehicle lineup (*Xforce, Xpander Cross, All-New Triton, Outlander*).

2. **✨ Prompt Enhancement (Automated Gemini GEM)**:
   - One-click prompt enhancement powered by Google Gemini.
   - Uses the **AID Prompt Hybrid** formula tuned for Nano Banana Pro 2.
   - Automatically translates briefs into official MMV design language (*Dynamic Shield front face, T-shape LED lights, Energetic Yellow, Red Diamond*).

3. **Enterprise IAM, Token & Quota Control**:
   - Live daily credit quota countdown per sales consultant.
   - Dealership branch monthly budget pooling.
   - Prevents runaway generation loops.

4. **Process Logging & Observability (Show Recent)**:
   - Complete audit trail drawer logging timestamps, dealership branch, user prompt, enhanced prompt, execution latency, and credits deducted.

5. **HQ Brand Governance Center (`/admin/brand`)**:
   - Manage the MMV vehicle catalog, color finishes, and design cues.
   - Edit the master Gemini system instruction and AID Prompt formula.
   - Manage negative prompt guardrails and competitor blacklists with live publishing.

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd AGV_AIGenMMV
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file:
```env
# Optional: Google Gemini API Key for live prompt enhancement
GEMINI_API_KEY=your_gemini_api_key_here

# Optional: Nano Banana Pro 2 Endpoint & API Key
NANO_BANANA_API_KEY=your_nano_banana_api_key_here
NANO_BANANA_API_URL=https://api.internal-studio.corp/v1/nano-banana-pro-2/generate
```
*(Note: If no API keys are provided, the studio runs with intelligent mock fallback assets and simulated prompt enhancements so you can test all features immediately).*

### 3. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Add your Environment Variables (`GEMINI_API_KEY`, etc.) in the Vercel project settings.
5. Click **Deploy**. Vercel will build and host the application globally.
