# Business Listing App
## How To Run

```bash
npm install
npx expo start
```

Then choose a platform from the Expo CLI:

- Press `i` for iOS simulator
- Press `a` for Android emulator

To run on a physical phone, install Expo Go from [Expo](https://expo.dev/) and scan the QR code shown in the terminal.

## Decisions Made

- Built the app around two focused screens: one for creating a listing and one for viewing and searching listings. This keeps the user flow simple.
- Used React Context for in-app listing state so both screens share one source of truth without adding Redux.
- Used AsyncStorage for simple local persistence because the challenge does not require a backend API.
- Small validation: business name and description are required and category has default value.
- Minimal UI design, easy for user to use, simple cards and categories badge.
- Separated shared styles into `styles/` and listing state into `context/` for cleaner code and reusability in the future.

## Trade-Offs

- Did not add a backend and any authentication.
- Used a predefined category list to make listing creation faster and keep categories consistent.
- Used AsyncStorage as a simple local data layer instead of adding a backend API.
- Kept the UI simple with shared style tokens and did not add animations or complex visual states.

## V2 Ideas

- Add a listing details screen with edit/delete actions so users can manage each business separately from the list view.
- Add stronger discovery tools, such as category filters or sorting, once the list grows.
- Add backend support if listings need to sync across devices or be shared between users.

## Project Structure

```text
app/
  _layout.tsx
  index.tsx
  (tabs)/
    _layout.tsx
    create-listing.tsx
    view-listings.tsx
context/
  listings-context.tsx
styles/
  colors.ts
  spacing.ts
  typography.ts
```
