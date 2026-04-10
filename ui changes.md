# UI/UX Redesign Plan for Mental Buddy

## Emotional Design Goals
- **Safe Space**: UI should feel welcoming, comforting, and non-judgmental.
- **Personal & Friendly**: Mimic the warmth of a virtual friend, not a clinical tool.
- **Emotional Hook**: Homepage should immediately resonate with users’ feelings.

## Visual & Interaction Guidelines
- **Colors**: Use soft pastels, gentle gradients, and warm undertones (peach, lavender, mint, sky blue, blush pink).
- **Typography**: Friendly, rounded fonts (e.g., Quicksand, Nunito, Comfortaa). Avoid harsh, corporate typefaces.
- **Micro-interactions**: Add hover effects, button ripples, card lifts, and smooth transitions.
- **Animations**: Subtle breathing backgrounds, floating icons, gentle fade-ins.

## Feature Redesigns

### 1. AI Chat Section
- **Layout**: Chat bubbles with rounded corners, soft drop shadows, and gradient backgrounds.
- **Avatar**: Friendly animated avatar (e.g., floating, blinking, or breathing effect).
- **Input**: Rounded input bar with animated send button.
- **Micro-interactions**: Bubble pop-in, gentle message fade, avatar reacts to user input.
- **Background**: Soft gradient or animated background (breathing effect).

### 2. Mood Tracker
- **Layout**: Journal-style cards for each entry, with hand-drawn or sticker-like mood icons.
- **Interaction**: Add mood with a floating action button (FAB), animated when hovered.
- **Animation**: Mood icons gently float or bounce in.
- **Colors**: Each mood uses a unique pastel shade.
- **Notes**: Allow users to add a short note or sticker to each entry.

### 3. Homepage
- **Emotional Hook**: Large, friendly headline (e.g., “Hey, you’re not alone here.”)
- **Subtext**: Empathetic message below the headline.
- **Visuals**: Soft illustration or animated background (e.g., floating clouds, gentle waves).
- **Call to Action**: Big, inviting button with a warm color.

## Layout & UX Improvements
- **Spacing**: Generous padding and margin for a breathable layout.
- **Navigation**: Bottom navigation bar for mobile, soft pill-shaped tabs for desktop.
- **Reusable Components**: ChatBubble, MoodCard, AnimatedAvatar, BreathingBackground, FriendlyButton.
- **Accessibility**: High contrast for text, focus states, readable font sizes.
- **Onboarding**: Gentle onboarding modal for first-time users.

## Next Steps
1. Update Tailwind config for custom colors and fonts.
2. Create reusable components (see above).
3. Refactor pages to use new components and layouts.
4. Add animations and micro-interactions.
5. Test for emotional impact and accessibility.

---

## Chat UI Improvements (Latest Update)

### 1. Removed Blur Effects
- Eliminated blur filter from BreathingBackground animation (removed `blur(1.5px)` in keyframe).
- Chat background is now clear and sharp.

### 2. Structured Message Display
- Messages now display in format: [Avatar] NAME: <message>
- AI messages: Left-aligned with AI name and avatar.
- User messages: Right-aligned with user name and avatar.
- Names are bold, avatars are 32px circular.

### 3. Avatar Support
- AI avatar: Fetched from user profile preferences (buddyAvatar).
- User avatar: Fetched from user profile (avatar), fallback to default.
- Avatars aligned with text using flexbox.

### 4. Dynamic AI Name
- AI name fetched from profile preferences (buddyName), default "Mental Buddy".
- Stored in component state, updated on load.

### 5. User Name Handling
- User name: Fetched from profile (name), default "You".
- Displayed before user messages.

### 6. Component Refactoring
- Created `ChatMessage` component: Reusable, takes props (text, sender, name, avatar).
- Updated Chat.jsx to use ChatMessage instead of ChatBubble.
- Added profile fetching logic.

### 7. Styling & Layout
- Flexbox for alignment (AI left, user right).
- Spacing between avatar and text.
- Clean, readable design similar to WhatsApp/ChatGPT.
- Responsive layout maintained.

### 8. Data Flow
- Messages use sender: "ai" | "user".
- Profile data fetched via API on component mount.
- No breaking changes to existing chat logic.

### 9. State Management
- Profile data stored in local component state.
- AI name/avatar, user name/avatar loaded asynchronously.

---

## Buddy Name Feature Implementation

### 1. Profile Page (Frontend)
- Added "Buddy Name" input field in edit mode.
- Pre-fills with existing buddyName from profile.preferences.buddyName.
- Saves on "Save Changes" button via POST /profile.

### 2. State Handling
- Updated profile and editData state to include buddyName in preferences.
- Added handleBuddyNameChange handler for input updates.

### 3. Save to Backend
- POST /profile sends preferences object including buddyName.
- Backend upserts profile with buddyName in preferences.

### 4. Backend Changes
- Profile schema already supports preferences as object.
- POST /profile accepts and saves buddyName in preferences.
- GET /profile returns preferences.buddyName.

### 5. Fetch Profile
- GET /profile returns buddyName in preferences object.

### 6. Chat Page Integration
- Chat.jsx fetches profile on load, extracts preferences.buddyName.
- Sets aiName state, uses in header and messages.
- Fallback to "Mental Buddy" if not set.

### 7. UI Usage
- AI messages display dynamic buddyName: "Alex: Hello..."
- Header shows dynamic name.

### 8. Fallback Handling
- Defaults to "Mental Buddy" if buddyName empty or not set.

### 9. Code Quality
- Modular components maintained.
- No breaking changes to existing logic.
- Error handling preserved.

### 10. Optional Enhancement
- Added localStorage save for buddyName after fetch to reduce API calls.

---

*Buddy Name feature fully integrated across frontend and backend.*
