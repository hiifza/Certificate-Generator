
# 🎓 Certificate Generator  
**Internship Project at Codec Technologies (Summer 2025)**  
*A responsive, visually dynamic, and fully customizable digital certificate system — no backend required.*

---

## 📌 Project Overview

This project was developed during my internship at **Codec Technologies** as part of a real-world assignment to design a certificate issuance platform from the ground up. The goal was to provide a secure, theme-rich tool for organizations to manage certification processes efficiently — from user registration to final PDF export.

It blends thoughtful UI/UX design with robust frontend logic to create a seamless experience for administrators and recipients alike.

---

## 💼 Internship Context

- **Company:** Codec Technologies  
- **Duration:** June–July 2025  
- **Role:** App Development Intern  
- **Focus Areas:**  
  - Modular SPA architecture  
  - Dynamic certificate templates  
  - Glassmorphism UI  
  - Secure local admin management  
  - Client-side export & preview handling  

---

## 🛠️ Tech Stack

| Layer      | Tools & Technologies |
|------------|----------------------|
| Markup     | HTML5                |
| Styling    | CSS3 (Glassmorphism, Animations, Print Styles) |
| Logic      | JavaScript (ES6+)   |
| Data Store | localStorage         |
| Libraries  | jsPDF, html2canvas, QRCode.js |

---

## ✨ Core Features

- 🔐 Admin login, register, and verification panel  
- 🎨 Certificate Generator with 11 predefined & custom templates  
- 💡 Live, real-time WYSIWYG certificate preview  
- 📑 Dynamic layout control — font, size, spacing, colors, alignment  
- 📦 Local certificate storage & admin management via browser  
- 🔍 Certificate verification by ID (Verified, Waiting, Rejected)  
- 📊 Dashboard with stats, quick actions & graphical insights  
- 🖨️ PDF + JPG export, print-safe layout (A4 landscape)  
- 🌐 Offline-first with responsive mobile & desktop compatibility  
- ⚙️ Backup, restore, and app-reset functionality  

---

## 🧩 Folder Architecture

📁 Certificate Generator ├── cg.html → Semantic UI layout & routing screens 
                        ├── cg.css → Theme design, layout structure, animation, media styles 
                        └── cg.js → Application logic (render, route, verify, export, store)

---

## 🧬 Design System

- **Theme:** Teal ↔ Rose gradient with animated SVG overlays  
- **Effect:** Glassmorphism (blur, transparency, rounded corners)  
- **Fonts:**  
  - Certificate: *Cormorant Garamond*  
  - UI: *Inter* / *Sora*  
  - Codes/IDs: *Roboto Mono*  
- **Animations:** Entry/exit transitions, hover ripples, floating ribbons  
- **Layout Aesthetic:** Soft shadows, pastel panels, intuitive spacing  

---

## 🗂️ Navigation Dock (Always Floating)

| Icon | Section         | Purpose                             |
|------|------------------|--------------------------------------|
| 🏠   | Welcome          | Splash screen & CTA to start        |
| 🔐   | Entry Panel      | Admin login, register, verify cert  |
| 📊   | Dashboard        | Stats, summaries, charts            |
| 🛠️   | Certificate Tool | Step-by-step certificate creation   |
| 📁   | Manager          | Edit, preview, delete certs         |
| ⚙️   | Settings         | App config & data control           |

---

## 📝 Generator Workflow

1. **Candidate Info** — Name, Email, Internship Type, Organization  
2. **Certificate Type** — Auto-filled templates for 10+ categories  
3. **Template Selection** — Visual card grid with tooltips  
4. **Design Customizer** — Fonts, colors, logos, signatures, alignments  
5. **Live Preview + Export** — PDF, JPG, Print-ready view  

---

## 🎨 Available Templates

| Template         | Visual Style & Use Case                      |
|------------------|----------------------------------------------|
| Regal Gold       | Ornate serif, academia                      |
| Minimalist Dark  | High contrast, tech/startups                |
| Watercolor Art   | Organic, artistic, NGO                      |
| Geometric Teal   | Abstract, engineering, IT                   |
| Corporate Blue   | Clean, business-style layout                |
| Classic Frame    | Formal framed legacy                        |
| Soft Pastel      | Pastel-friendly, online learning            |
| Gradient Flow    | Innovative, floating layout                 |
| Borderless Bold  | Frameless, crisp, mono-style                |
| Infographic Panel| Left ID + content blocks                    |
| Upload Custom    | Use your own design                         |

---

## ✅ Verification System

- Users can enter a **Certificate ID** on the public panel to verify authenticity.  
- System checks `localStorage.certificates[]` and returns:

  | Status       | Display                  |
  |--------------|--------------------------|
  | ✅ Verified   | Read-only preview        |
  | ⏳ Waiting    | Info card with progress  |
  | ❌ Not Found  | Danger alert card        |

- **Admin Panel** includes control to update each certificate’s status.  
- Real-time updates reflect immediately on the public verification screen.

---

## 💾 Data Management

- All data is persistently stored in the browser using `localStorage`.  
- Admin credentials are securely stored in `admins[]` as `{ email, password }` objects (client-side encryption).  
- Each certificate is saved in `certificates[]` with a unique schema (see JSON sample).  
- JSON-based **Import/Export** allows easy transfer and backup:
  - Export all certs and settings as JSON
  - Import JSON to restore app state
- **Reset Options:**
  - Soft Reset → Clear certificates only
  - Hard Reset → Full app wipe (admins, certs, settings)

---

## 📤 Export Options

| Format | Details                                         |
|--------|--------------------------------------------------|
| 📄 PDF  | A4 landscape, styled, margin-safe via `jsPDF`    |
| 🖼️ JPG  | High-resolution image (300dpi) via `html2canvas` |
| 🖨️ Print | Landscape layout optimized for print-ready view |

---

## 🧠 Skills Applied

- Semantic HTML5 markup and SPA-style navigation  
- Responsive design with advanced CSS (media queries, animations)  
- Modular JavaScript with DOM binding and local persistence  
- UI/UX design using pastel gradients, transitions, and modern typography  
- Integration with client-side libraries for export (jsPDF, QRCode.js)  
- Form validation, secure password handling, and real-time user feedback

---

## 🙌 Acknowledgments

Grateful to **Codec Technologies** for providing the platform to explore frontend engineering through hands-on project delivery. The mentorship and freedom offered during the internship fueled both creative expression and technical growth.

---

## 🚀 How to Use

1. Clone/download this repo  
2. Open `cg.html` in any modern browser (Chrome, Edge, Firefox, etc.)  
3. No installation required — works offline  
4. Create an admin account and begin generating certificates

---

## 📂 Repository Structure

📦 root/ ├── cg.html → HTML structure and routing views
          ├── cg.css → Theme, layout, transitions, responsiveness 
          └── cg.js → App logic, routing, rendering, localStorage operations

---

## 🧾 License

This project is open-source and available for educational, nonprofit, and personal use. Attribution is appreciated.

---
          
