# CloudCash - Fintech Web Application & CSS Architecture

A pixel-perfect, modern, responsive financial dashboard web application built from Figma design specifications and CSS design tokens.

---

## 🎨 Design System & CSS Token Mapping

All absolute coordinates and fragmented Figma CSS declarations have been refactored into a scalable, semantic, and maintainable CSS architecture with CSS Custom Properties:

### Colors
| Token Name | Hex Value | Role / Usage |
|---|---|---|
| `--primary` | `#197BBD` | Main brand blue, interactive elements, highlights |
| `--primary-accent` | `#1F78D1` | Active navigation pill, badges, action buttons |
| `--primary-light` | `#EFF6FF` | Soft blue backgrounds for active nav & icons |
| `--bg-page` | `#F2F5F8` | Canvas background and filter bars |
| `--bg-card` | `#FFFFFF` | Main card background surfaces |
| `--text-primary` | `#1F2C3F` | High-contrast body and title typography |
| `--text-heading` | `#404040` | Secondary headers and card numbers |
| `--text-secondary` | `#8292A1` | Subtitles, labels, and helper text |
| `--text-muted` | `#AEAEAE` | Disabled states and table column labels |
| `--color-green` | `#439A86` | Positive income amounts and "Completed" / "Paid" badges |
| `--color-red` | `#BB4430` | Outcome amounts and "Failed" / "Overdue" badges |
| `--color-orange` | `#F79042` | Pending transactions and shopping categories |
| `--color-amber` | `#FFC145` | Promo accents, loan coins, and quick transfer action |

### Typography
- **Headings & Title Hierarchy**: `Plus Jakarta Sans` / `Suprema` (Weights 600, 700, 800)
- **Body & Data Tables**: `Lato` (Weights 300, 400, 500, 600, 700)
- **Brand & Numerical Displays**: `Quicksand` (Weights 500, 600, 700)

### Elevation & Border Radii
- **App Container**: `border-radius: 32px; box-shadow: 0px 20px 60px rgba(15, 66, 100, 0.08);`
- **Dashboard Cards**: `border-radius: 20px - 28px; box-shadow: 0px 16px 24px rgba(0, 0, 0, 0.06);`
- **Badges & Inputs**: `border-radius: 8px - 12px;`

---

## 📱 Screen Catalog & Features

### 1. Overview Screen (`#view-overview`)
- **Interactive Credit Card**: Blue gradient card with embossed numbers, Mike Smith cardholder, expiry, and carousel arrow toggles (`<` and `>`) to flip between cards.
- **Weekly Payment Limit**: Progress meter with `$350.60 / $4000` limit readout and live "Deactivate card" toggle switch.
- **Financial KPIs**: Current balance `$2,850.75`, Income `$1,500.50`, Outcome `$350.60`.
- **Mini Goals Carousel**: Quick previews for Holidays (`$550`), Renovation (`$200`), and Xbox (`$820`).
- **Outcome Statistics**: Horizontal progress gauges for Shopping (52%), Electronics (21%), and Travels (74%).
- **Transaction History**: Formatted table with merchant icons, categories, dates, and amounts.
- **Quick Transfer & Loan Banner**: Contact avatars, amount input with instant transfer simulation, and coral-gradient loan promo card.

### 2. Transactions Screen (`#view-transactions`)
- **Filter Bar**: Real-time search by merchant or category, plus filter dropdowns by date, category, and status.
- **Transactions Data Table**: Full table with status pills (`Completed`, `Pending`, `Failed`) and pagination controls.
- **Monthly Summary Sidebar**:
  - Total Spent `$1,452.88` KPI.
  - Pure SVG Spending categories Donut Chart with legend.
  - Total Received `$4,250.00` KPI.
  - Pure SVG Income sources Donut Chart with legend.
  - Net Cash Flow card (`+$2,797.12`).

### 3. My Cards Screen (`#view-cards`)
- **Card Deck**: Blue Premium Card & Black Metal Card with metallic gradient finishes.
- **Quick Actions**: `Freeze`, `Limits`, and `PIN` security management modals.
- **Spending by Category**: Category progress bars with monthly totals.
- **Recent Card Transactions**: Sidebar mini feed with "View All Card History" navigation.

### 4. Invoices Screen (`#view-invoices`)
- **KPI Metrics Bar**: Total Invoices ($12,450.00), Paid ($9,250.00), Pending ($2,100.00), Overdue ($1,100.00).
- **Invoice Management Table**: Clickable invoices with live row selection.
- **Selected Invoice Inspector Drawer**: Client profile, due dates, total calculation, "Send Reminder", and "Download PDF".
- **Invoice Generator Modal**: "+ Create New Invoice" modal with automatic table addition.

### 5. My Goals Screen (`#view-goals`)
- **Hero Metrics**: Total Saved Hero Card (`$49,600`), Monthly Target (`$2,450`), Goals Completed (`8 Milestones`), Active Goals (`5 Active`).
- **2x3 Active Goals Grid**: Dream Vacation, Home Renovation, New Sports Car, Emergency Fund, Executive MBA, and "+ Add New Goal" interactive card.
- **6-Month Savings Progress Chart**: Interactive SVG area/line chart with dynamic hover tooltips for Nov-Apr.

---

## 🚀 How to Run the Project

1. Open `index.html` directly in any modern web browser (Chrome, Edge, Firefox, Safari).
2. Or serve it via a lightweight local server:
   ```bash
   npx serve .
   # or
   python -m http.server 8000
   ```
