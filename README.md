## AI Search Assistant (Frontend)

 <img width="1126" height="665" alt="Screen Shot 2025-10-02 at 9 47 13 PM" src="https://github.com/user-attachments/assets/44081236-0dae-442d-b71f-53f04ba17f10" />

Demo: https://claudia-teng.github.io/ai-search-frontend/

Backend: [https://github.com/Claudia-teng/ai-search-backend](https://github.com/Claudia-teng/ai-search-backend)

![Screen Recording 2025-10-02 at 9 48 12 PM mov](https://github.com/user-attachments/assets/0d0d81b8-0e07-46df-a2b4-c9a12295e257)



### 📱 Mobile light / dark mode

<img width="212" height="453" alt="Screen Shot 2025-10-02 at 9 17 37 PM" src="https://github.com/user-attachments/assets/ef4d71c7-0c3b-4a25-af23-f2b656cfd1d0" />
<img width="208" height="457" alt="Screen Shot 2025-10-02 at 9 17 51 PM" src="https://github.com/user-attachments/assets/9d5bb2b3-576a-4cec-b6cd-217511dd7a59" />


### ▶️ Getting Started

- **Prerequisites**
  - Node.js
  - npm

- **Install**
  - npm: `npm install`

- **Environment variables**
  - The app expects a WebSocket endpoint `VITE_WS_URL` exposed to the browser.

- **Run (dev)**
  - `npm run dev`
  - Open the URL printed by Vite (usually `http://localhost:5173`).

- **Build & Preview**
  - Build: `npm run build`

- **Lint & Format**
  - Lint: `npm run lint`
  - Format: `npm run format`

### 🔧 Architecture Overview

- **Tech stack**: Vite + React + TypeScript, CSS Modules, ESLint + Prettier.

- **Key files/directories**
  - `src/pages/Search/Search.tsx`: main page; manages WebSocket lifecycle, state, and composition of child components.
  - `src/components/SearchInput`: search form (input + button) with CSS module.
  - `src/components/Card`: reusable card container with title/body styles.
  - `src/components/Chip`: reusable link chip for source URLs.

- **WebSocket flow**
  - Connect on submit to `VITE_WS_URL`.
  - Server sends:
    - Sources (e.g., `{"urls":["https://…"]}`) → update the Sources list.
    - Streaming summary chunks (e.g., `{ type: "stream", content: { content: "…" } }`) → append to Summary.
    - Termination message (e.g., `{ type: "terminate" }`) → stop streaming/close socket.

- **Styling**
  - CSS Modules.
  - Light/dark styling.

### 🌐 Deployment

<img width="729" height="528" alt="Screen Shot 2025-10-02 at 8 42 27 PM" src="https://github.com/user-attachments/assets/8402de49-5823-4329-87b5-534377ddc1a7" />

The project is automatically built and deployed to GitHub Pages through a GitHub Actions CI/CD pipeline
