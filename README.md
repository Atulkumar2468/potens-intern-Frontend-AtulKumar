# Operations Cockpit Dashboard

An elegant, high-performance, and mission-critical operations cockpit dashboard designed for senior managers and dispatch leads. Built using **React (TypeScript), Vite, and Tailwind CSS v4**.

---

## 🚀 Key Architectural & Design Defenses

### 1. The Ticking Metric Choices
Operations rooms thrive on time-sensitive milestones. Rather than a generic counter, we implemented two ticking metrics:
- **SLA Batch Dispatch Cutoff (Countdown)**: Operates dynamically relative to the local time, counting down to the top of the next hour (simulating hourly truck rollouts). This establishes a high-urgency, countdown ticking action.
- **Average Critical Queue Age (Live Ticking Upward)**: A metrics stream that ticks dynamically in real-time, representing the exact duration shipments have been waiting. Ticking triggers visual urgency, drawing direct operational focus to queue bottlenecks.

### 2. High-Density, Low-Bandwidth Mode
Logistics nodes often operate in warehouses, cargo terminals, or regions with poor 3G/LTE signals. 
- When **Low-Bandwidth Mode** is enabled, the dashboard drops all SVG animations, icons, colored glow filters, and card structures.
- It switches to an ultra-dense, high-contrast monospace **Tabular Grid Layout**. This drops rendering computation overhead and minimizes layout shifts, presenting maximum information in the sparsest weight possible.

### 3. VIM-Inspired Keyboard Shortcuts
Power users working 10+ hours a day prefer keyboards over mice to avoid operational fatigue.
- We implemented classic VIM navigation keys: `j` to move the cursor down, and `k` to move it up.
- `a` immediately approves the selected high-priority item, while `h` places it on hold.
- Keyboard highlights feature high-contrast indigo visual boundaries.
- Users can press `?` to toggle a cheat-sheet modal or `Esc` to clear selection or exit overlays.

### 4. Non-Cosmetic Dark Mode
Early morning at 9:00 AM, operators might be in poorly-lit warehousing offices. Standard dark modes are often purely cosmetic black. Our **True Dark Mode** utilizes low-glare Slate/Zinc hued gradients. High-priority statuses (Critical, Warning) use carefully tuned HSL emerald/rose colors that contrast safely under standard light limits to prevent severe visual fatigue.

### 5. Perfect Bilingual localization (English / हिन्दी)
For Indian shipping and supply terminals, multi-lingual accessibility is crucial. We implemented a complete dictionary in Hindi (**हिन्दी**). Rather than translating only card headers, we translated **every piece of UI data**, including action item contexts, anomaly descriptions, countdown timers, helper overlays, and status tags.

### 6. Interactive Database & Storage Audit Ledger (Where are my actions stored?)
To provide complete operational transparency and address where actions and states are persisted:
- **Physical HTML5 Storage Telemetry**: We built a dedicated, high-fidelity ledger terminal that hooks directly into the browser's `window.localStorage` engine.
- **Real-time Byte Sizer**: Displays active storage utilization in bytes across all monitored operational keys (`cockpit_actions`, `cockpit_anomalies`, `cockpit_lang`, `cockpit_dark_mode`, `cockpit_low_bw`, `cockpit_audit_logs`).
- **Live Session Transaction Logs**: Real-time terminal output logs with precise timestamps logging every operator transaction (e.g., approvals, holds, undos, muted/resolved anomalies, database sync triggers, and factory resets). These logs are fully bilingual and align with the active language state!
- **Raw JSON Payload Inspector**: A collapsible command-line style terminal allowing operators to examine the exact raw state representations of active databases with a single-click "Copy Payload" command.
- **Factory Reset Purger**: Allows operators to safely wipe all local sandbox overrides, clear local storage keys, and re-hydrate default templates seamlessly.

---

## 🛠️ Tech Stack & Setup

- **Core**: React v19, TypeScript
- **Bundler**: Vite v6
- **Styles**: Tailwind CSS v4, PostCSS, Autoprefixer, Lucide Icons

### Installation & Run

1. Navigate to the project directory:
   ```bash
   cd operations-cockpit
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the local development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

---

## ⌨️ Operational Shortcuts Cheat-Sheet

| Key | Action |
|:---:|:---|
| `j` | Move selection down (Top 5 Actions) |
| `k` | Move selection up (Top 5 Actions) |
| `a` | Approve highlighted item |
| `h` | Put highlighted item on Hold |
| `?` | Toggle keyboard shortcuts help guide |
| `Esc` | Cancel selection or close help dialog |
