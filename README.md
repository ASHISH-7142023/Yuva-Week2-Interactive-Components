# Nova UI Toolkit — Interactive Web Components Suite
### Yuva Intern: Junior Frontend Developer Internship — Week 2 Task

[![Internship Track](https://img.shields.io/badge/Yuva%20Intern-Junior%20Frontend%20Developer-indigo.svg)](https://yuvaintern.com/my-internships)
[![Week](https://img.shields.io/badge/Task-Week%202%20Deliverable-cyan.svg)](#)
[![Stack](https://img.shields.io/badge/Stack-Vanilla%20ES6%20%7C%20CSS3%20%7C%20HTML5-emerald.svg)](#)
[![Accessibility](https://img.shields.io/badge/Accessibility-WAI--ARIA%201.2%20%26%20WCAG%20AA-blue.svg)](#)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

---

## 📌 Executive Summary & Objective

This repository contains the complete submission for **Week 2: Developing Interactive UI Components** of the **Junior Frontend Developer Internship** at **Yuva Intern** (`https://yuvaintern.com/my-internships`).

The primary objective is to architect and develop a reusable, production-ready suite of interactive frontend UI components (**Nova UI Toolkit**) using native Vanilla JavaScript (ES6+), modern CSS3, and strict WAI-ARIA 1.2 authoring practices—with **zero third-party libraries or CSS frameworks**.

* **Internship Period:** 5 Weeks (07-Jul-2026 to 11-Aug-2026)
* **Student Name:** Ashish Ranjan Singh
* **Repository:** [https://github.com/ASHISH-7142023/Yuva-Week2-Interactive-Components](https://github.com/ASHISH-7142023/Yuva-Week2-Interactive-Components)

---

## 🧩 Component Suite Architecture

Nova UI Toolkit implements 4 modular, class-based component controllers in pure ES6:

```text
Nova UI Toolkit/
├── ModalManager            -> Keyboard Focus Trap, Backdrop Click, Escape Key, Focus Restoration
├── TabsManager             -> WAI-ARIA 1.2 Arrow Navigation, Auto Panel Activation, Home/End
├── AccordionManager        -> CSS Grid Row Expansion, Single vs Multi-Expand Mode, Arrow Navigation
└── ToastNotificationService-> Stackable Toasts, Countdown Timers, Screen Reader Live Regions
```

---

## 🚀 Detailed Component Breakdown

### 1. Accessible Modal Dialog (`ModalManager`)
* **Focus Trapping:** Intercepts `Tab` and `Shift+Tab` to cycle exclusively among interactive elements inside the active dialog, preventing focus leakage to background content.
* **Escape Key & Backdrop Dismissal:** Instantly closes on `Escape` keypress or clicking the ambient backdrop.
* **Focus Restoration:** Automatically remembers the initiating element (`document.activeElement`) and restores focus back to it upon closure.
* **Scroll Locking:** Applies `body.modal-open` (`overflow: hidden`) to prevent background page jumping.
* **ARIA Semantics:** Proper bindings for `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `aria-describedby`.

### 2. WAI-ARIA Tabbed Content Switcher (`TabsManager`)
* **Keyboard Arrow Navigation:** Seamlessly cycles active tabs with `ArrowRight` / `ArrowLeft` (and `ArrowDown` / `ArrowUp`).
* **Home & End Shortcuts:** Instantly jumps to the first tab via `Home` or the last tab via `End`.
* **Dynamic Tabindex Management:** Only the active tab carries `tabindex="0"`; inactive tabs carry `tabindex="-1"` ensuring standard, accessible Tab key navigation.
* **ARIA Semantics:** Fully bound `role="tablist"`, `role="tab"`, `role="tabpanel"`, and `aria-selected="true/false"`.

### 3. Interactive Accordion System (`AccordionManager`)
* **Fluid CSS Grid Transition:** Interpolates `grid-template-rows: 0fr` to `grid-template-rows: 1fr` for 60 FPS smooth opening without hardcoded pixel heights.
* **Configurable Expansion Mode:** Supports runtime switching between **Single-Expand Mode** (auto-collapsing sibling panels) and **Multi-Expand Mode**.
* **Global Controls:** Features "Expand All" and "Collapse All" programmatic triggers.
* **Keyboard Navigation:** `Enter`/`Space` toggles state; `ArrowDown`/`ArrowUp` cycles focus between accordion triggers.

### 4. Dynamic Toast Notification System (`ToastNotificationService`)
* **Stackable Alerts:** Dynamically generates toast alerts in the bottom-right corner with smooth entrance and exit transitions.
* **Timed Auto-Dismiss & Visual Countdown:** Includes a visual CSS progress bar matching the exact countdown duration (4500ms).
* **Hover to Pause:** Automatically pauses auto-dismiss countdown when the user hovers over the notification.
* **Assistive Technology Voice:** Screen readers announce alerts via `role="status"` and `aria-live="polite"`.

---

## ⌨️ Comprehensive Keyboard Accessibility Matrix

| Component | Keyboard Shortcut | Behavior & Functional Outcome |
| :--- | :--- | :--- |
| **Modal Dialog** | <kbd>Tab</kbd> / <kbd>Shift + Tab</kbd> | Cycles focus strictly within modal focusable elements. |
| **Modal Dialog** | <kbd>Escape</kbd> | Closes the modal and restores focus to initiating trigger button. |
| **Tab Switcher** | <kbd>&rarr;</kbd> / <kbd>&darr;</kbd> | Moves focus and activates the next tab (wraps around). |
| **Tab Switcher** | <kbd>&larr;</kbd> / <kbd>&uarr;</kbd> | Moves focus and activates the previous tab (wraps around). |
| **Tab Switcher** | <kbd>Home</kbd> / <kbd>End</kbd> | Jumps focus directly to the first or last tab. |
| **Accordion** | <kbd>Enter</kbd> / <kbd>Space</kbd> | Toggles active panel open or closed. |
| **Accordion** | <kbd>&darr;</kbd> / <kbd>&uarr;</kbd> | Moves focus to next / previous accordion trigger button. |
| **Toast Alerts** | <kbd>Escape</kbd> | Dismisses the notification when container is focused. |

---

## 📁 Repository Structure

```text
Yuva-Week2-Interactive-Components/
├── index.html                  # Component Showcase & Interactive Playground
├── components.css              # Custom Properties, Transitions, and Layouts
├── components.js               # Modular ES6 Classes (Modal, Tabs, Accordion, Toast)
├── README.md                   # Technical Documentation & Keyboard Matrix
├── submission_description.txt  # Portal Submission Text (>= 200 words)
└── report/
    └── report_week2.docx       # Formal Word Document Report for Evaluator
```

---

## 🛠️ How to Run Locally

1. Clone or download this repository:
   ```bash
   git clone https://github.com/ASHISH-7142023/Yuva-Week2-Interactive-Components.git
   cd Yuva-Week2-Interactive-Components
   ```
2. Open `index.html` in your browser:
   ```bash
   # On Windows PowerShell
   Start-Process index.html
   ```

---

## 📜 Evaluation Checklist & Deliverables

- [x] **Modal Dialog:** Accessible modal with keyboard focus trap, backdrop dismissal, and focus restoration.
- [x] **Accordion System:** Multi-panel collapsible accordion with smooth height transition and keyboard navigation.
- [x] **Tabbed Switcher:** WAI-ARIA tab list with arrow key navigation and automatic panel activation.
- [x] **Toast Notifications:** Stackable feedback notifications with auto-dismiss timers and progress bars.
- [x] **Word Document Report:** Formal report compiled as `.docx` inside `report/report_week2.docx`.
- [x] **Detailed Description:** >= 200 words technical writeup inside `submission_description.txt`.
- [x] **GitHub Repository:** Available at [https://github.com/ASHISH-7142023/Yuva-Week2-Interactive-Components](https://github.com/ASHISH-7142023/Yuva-Week2-Interactive-Components).
