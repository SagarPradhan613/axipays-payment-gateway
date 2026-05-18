# Axipays Frontend

Axipays is a production-oriented React frontend for a payment gateway assignment. It provides a secure checkout flow for card payments and a responsive analytics dashboard for transaction monitoring, with internationalization, theming, and performance-focused frontend architecture.

The application validates and masks sensitive payment data on the client, generates the required HMAC request signature, handles redirect-based payment status resolution, and visualizes transaction data through charts, summary cards, and an operational history table.

## Links

- Live demo: https://axipays-payment-gateway.vercel.app
- GitHub repository: https://github.com/SagarPradhan613/axipays-payment-gateway

## Tech Stack

| Library / Tool | Purpose | Version |
| --- | --- | --- |
| React | UI library | 19.1.0 |
| React DOM | DOM renderer for React | 19.1.0 |
| Vite | Dev server and production bundler | 6.3.5 |
| TypeScript | Static typing | 5.8.3 |
| React Router DOM | Routing and lazy-loaded page navigation | 6.30.0 |
| Zustand | Global state management | 5.0.4 |
| Axios | API client and interceptors | 1.9.0 |
| React Hook Form | Form state management | 7.56.4 |
| Zod | Schema validation | 3.24.4 |
| @hookform/resolvers | RHF + Zod integration | 5.2.2 |
| CryptoJS | HMAC-SHA256 generation | 4.2.0 |
| Framer Motion | Page, card, modal, and table animations | 12.15.0 |
| Recharts | Dashboard visualizations | 2.15.3 |
| i18next | Internationalization engine | 25.1.2 |
| react-i18next | React bindings for i18next | 15.5.3 |
| Tailwind CSS | Utility-first styling | 3.4.17 |
| clsx | Conditional class composition | 2.1.1 |
| tailwind-merge | Tailwind class conflict resolution | 3.3.0 |
| lucide-react | Icons | 0.511.0 |
| PostCSS | CSS processing pipeline | 8.5.4 |
| Autoprefixer | Vendor prefixing | 10.4.21 |
| @vitejs/plugin-react-swc | Fast React transform for Vite | 3.8.0 |

## Project Architecture

```text
.
├── public/                 # Static assets such as favicon
├── src/
│   ├── assets/             # Asset barrel and future static frontend assets
│   ├── components/         # Reusable UI, layout, and shared stateful view components
│   │   ├── layout/         # Navbar, route wrapper, theme toggle, language toggle
│   │   ├── shared/         # Empty, error, and loading states
│   │   └── ui/             # Button, Badge, Card, Modal, Spinner, Toast viewport
│   ├── constants/          # Config, API constants, and text key maps
│   ├── hooks/              # Custom hooks for bootstrap, payment, cards, and transactions
│   ├── locales/            # English and Hindi translation resources
│   ├── pages/              # Route-level pages: Checkout, Dashboard, NotFound
│   ├── services/           # Axios instance plus payment and transaction API adapters
│   ├── store/              # Zustand stores for theme, language, checkout, toast, transactions
│   ├── styles/             # Global CSS, theme tokens, transitions, shimmer utilities
│   ├── types/              # Shared TypeScript models and API response contracts
│   ├── utils/              # Hashing, masking, order ID generation, formatters, Luhn validation
│   ├── App.tsx             # Router configuration, lazy routes, toast viewport, app shell
│   ├── i18n.ts             # i18next bootstrapping
│   └── main.tsx            # Application entrypoint
├── index.html              # HTML shell and favicon wiring
├── package.json            # Scripts and dependencies
├── tailwind.config.ts      # Tailwind theme, color tokens, dark mode strategy
├── tsconfig.json           # TypeScript configuration and path aliases
└── vite.config.ts          # Vite config, aliases, and manual chunk splitting
```

## Setup & Installation

1. Clone the repository:

```bash
git clone https://github.com/SagarPradhan613/axipays-payment-gateway.git
cd axipays
```

2. Install dependencies:

```bash
npm install
```

3. Create a local environment file:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
```

5. Optional quality checks:

```bash
npm run type-check
npm run build
```

## Environment Variables

Create a `.env` file using the following template:

```bash
VITE_API_BASE_URL=https://payment-assignment.onrender.com
VITE_AXI_SECRET_KEY=AXI2026
```

Notes:

- `VITE_API_BASE_URL` points to the payment assignment backend.
- `VITE_AXI_SECRET_KEY` is used for client-side HMAC generation required by the assignment API.

## Security Decisions

### HMAC-SHA256 Request Hash

The checkout request includes a `Hash` header generated with HMAC-SHA256 using the assignment secret key. The frontend:

1. Strips non-digit characters from the card number.
2. Extracts the first 6 and last 4 digits.
3. Reverses the concatenated 10-digit fragment.
4. Reverses the email address.
5. Builds the message as `reverse(email) + AXIPAYS + reverse(first6+last4)`.
6. Uppercases the message.
7. Signs it with HMAC-SHA256 using `AXI2026`.
8. Sends the uppercase hexadecimal digest in the `Hash` request header.

This logic lives in `src/utils/hash.ts`.

### Card Data Masking

Sensitive card fields are never shown raw in the UI once rendered:

- Card numbers are masked to first 6 digits + hidden middle + last 4 digits.
- Dashboard history always shows masked card values.
- CVV/CVC is always displayed as `***` in the dashboard and card preview back face.

Masking helpers live in `src/utils/masking.ts`.

### CVV Never Persisted

The CVV is intentionally treated as transient input:

- The field is rendered as `type="password"`.
- The raw CVV is used only to build the payment initiation request payload.
- It is cleared immediately after submission handling.
- It is not persisted to local storage, Zustand persistence, analytics state, or UI history.

### Luhn Validation

Card numbers are validated client-side using the Luhn checksum algorithm before submission. This reduces preventable API requests for structurally invalid card numbers and mirrors common payment UX expectations.

The implementation lives in `src/utils/luhn.ts`.

## Key Implementation Decisions & Assumptions

- The checkout request body is mapped explicitly at the API boundary to match backend field names, including `cardCVC` and `orderId`.
- `orderId` is generated client-side using `timestamp + random string` in the format `AXI-<timestamp>-<random>` to ensure uniqueness per request.
- Payment status is determined by fetching `redirect_url` client-side because the redirect endpoint returns the final status as JSON.
- Dashboard table pagination is API-driven with centralized `page` and `limit` state in Zustand.
- Dashboard charts and summary metrics use a full analytics dataset because the provided API does not expose aggregate endpoints.
- Client-side filtering, sorting, and CSV export operate on the analytics dataset when advanced table interactions are active.
- API errors are normalized into user-friendly messages rather than surfacing raw error objects.
- Dev logging is wrapped behind `import.meta.env.DEV`.

## API Flow Diagram

```text
+------------------+
| Checkout Form    |
| RHF + Zod        |
+---------+--------+
          |
          v
+------------------+
| Validate Card    |
| Luhn + masking   |
+---------+--------+
          |
          v
+------------------+
| Generate Hash    |
| HMAC-SHA256      |
+---------+--------+
          |
          v
+------------------------------+
| POST /initiate-payment       |
| body + Hash header           |
+---------+--------------------+
          |
          v
+------------------------------+
| Receive redirect_url         |
| + generated orderId          |
+---------+--------------------+
          |
     +----+----+
     |         |
     v         v
+---------+  +----------------------+
| new tab  |  | iframe container     |
| open     |  | embedded redirect    |
+---------+  +----------------------+
     |
     v
+------------------------------+
| fetch(redirect_url)          |
| read JSON status             |
+---------+--------------------+
          |
          v
+------------------------------+
| Update store status          |
| success / failed / pending   |
+---------+--------------------+
          |
          v
+------------------------------+
| Animated status modal        |
+------------------------------+
```

## Features Implemented

- ✅ Secure checkout form with React Hook Form + Zod validation
- ✅ Client-side Luhn validation for card numbers
- ✅ Live credit card preview with flip animation for CVV focus
- ✅ HMAC-SHA256 hash generation for payment initiation
- ✅ Client-generated `orderId` per request
- ✅ Redirect flow handling in both new tab and iframe
- ✅ Client-side `redirect_url` fetch to determine final payment status
- ✅ Success / failed / pending modal states
- ✅ Light / dark theme with persisted preference
- ✅ English / Hindi language switching with persisted preference
- ✅ Dashboard summary cards with animated counters
- ✅ Transaction status, volume-over-time, and currency charts
- ✅ API-driven table pagination with centralized pagination state
- ✅ Search, sort, and filter behavior for transaction history
- ✅ CSV export for filtered transactions
- ✅ Copy to clipboard on Order IDs
- ✅ Toast notification system
- ✅ 404 page
- ✅ Mobile hamburger navigation
- ✅ Code splitting (11 JS chunks, largest approximately 437 kB in the latest verified build)

## Bonus Features Implemented

- ✅ Responsive checkout and dashboard layouts
- ✅ Lazy-loaded route pages with Suspense fallback
- ✅ Reusable toast feedback layer
- ✅ Mobile-safe table behavior with conditional sticky order column
- ✅ Shimmer loading skeletons
- ✅ Theme-aware charts and UI surfaces
- ✅ Copy/export success and error feedback
- ✅ Favicon, route titles, and polished app shell transitions

## Bundle Splitting Strategy

The project uses manual chunking in `vite.config.ts` to keep the production bundle manageable and improve route boot performance. Key vendor groups are split into dedicated chunks:

- `vendor-react`
- `vendor-ui`
- `vendor-forms`
- `vendor-state`
- `vendor-i18n`

Route-level pages are also lazy loaded with `React.lazy()` and `Suspense`, so checkout and dashboard code are not forced into the initial route bundle. In the latest verified build, the app emits 11 JavaScript chunks, and the largest chunk is approximately 437 kB, keeping the build under the 500 kB target.

## Known Limitations / Future Improvements

- The dashboard currently fetches the full transaction dataset for analytics because the provided backend does not expose aggregate endpoints.
- Client-side search, sort, and filter use the analytics dataset instead of backend query parameters.
- CSV export currently reflects the filtered client-visible analytics result, not a backend-generated export.
- Copy-to-clipboard feedback assumes browser clipboard permissions are available.
- Payment redirect status depends on the redirect endpoint being directly fetchable as JSON from the browser.
- A backend aggregate endpoint would reduce the need for fetching all transactions for charts and summary cards.
- Server-side filtering and sorting would scale better for very large transaction volumes.

## Screenshots

> Screenshots will be added after deployment.
> Live demo available at the link above.
