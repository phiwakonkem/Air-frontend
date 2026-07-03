# Air Frontend

The React front-end for an Airbnb-style accommodation booking platform — browse listings on an interactive map, book stays with date selection and Stripe checkout, manage a wishlist, and host your own listings through a dedicated dashboard.

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react) ![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter&logoColor=white) ![Stripe](https://img.shields.io/badge/Stripe-008CDD?style=flat-square&logo=stripe&logoColor=white) ![Leaflet](https://img.shields.io/badge/Leaflet-Maps-199900?style=flat-square&logo=leaflet&logoColor=white)

## Features

- **Listings** — browse accommodations with an interactive Leaflet map
- **Booking flow** — date range picker (`react-datepicker`) and Stripe checkout
- **Reservations** — view and manage "My Reservations"
- **Wishlist** — save favorite listings
- **Host dashboard** — manage your own listed properties
- **Admin panel** — platform-level management
- **Reviews** — leave and view listing reviews
- **Auth** — login/register flow
- **Charts** — booking/earnings visualizations via Recharts
- **Toast notifications** and smooth transitions via Framer Motion

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 (Create React App) |
| Routing | React Router DOM 7 |
| HTTP client | Axios |
| Maps | React Leaflet |
| Payments | Stripe.js |
| Charts | Recharts |
| Animation | Framer Motion |
| Notifications | React Toastify |

## ⚠️ Backend Required

This is the frontend only — pair it with **[Air-Backend](https://github.com/phiwakonkem/Air-Backend)**, the matching Express/MongoDB API.

## Getting Started

### Prerequisites

- Node.js 20+
- [Air-Backend](https://github.com/phiwakonkem/Air-Backend) running (see that repo's README)

### 1. Clone the repository

```bash
git clone https://github.com/phiwakonkem/Air-frontend.git
cd Air-frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Point the app at your backend

Check `src/utils` or `src/context` for the Axios base URL / API constant and set it to wherever Air-Backend is running (e.g. `http://localhost:5000`).

### 4. Run the development server

```bash
npm start
```

Visit [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---|---|
| `npm start` | Start the development server |
| `npm run build` | Production build |
| `npm test` | Run tests |

## Author

**Phiwakonke Mthethwa**
Full-Stack Developer, Centurion, South Africa
GitHub: [@phiwakonkem](https://github.com/phiwakonkem) · LinkedIn: [phiwakonke-mthethwa](https://www.linkedin.com/in/phiwakonke-mthethwa-97aa74331) · Email: phiwakonkem@gmail.com
