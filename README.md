# buildor2.0-frontend

## Prerequisites
- Node.js (v18 or later recommended)
- npm or yarn

## Steps to Run
- Navigate to the src directory (where {}package.json is located):
- *cd src*

## Install dependencies:
- *npm install*

## Run the development server:
- *npm run dev*

## Open your browser and navigate to:
- *http://localhost:3000*

# FINAL API FLOW

## Registration:

- register → supabase auth → insert profile → insert settings


## Profile Page:

- page.tsx → settings-api.ts → /api/profile → Supabase


## Settings Page:

- page.tsx → settings-api.ts → /api/profile-settings → Supabase
