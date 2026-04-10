# UI/UX Redesign Plan for Mental Buddy

## Emotional Design Goals
- **Safe Space**: UI should feel welcoming, comforting, and non-judgmental.
- **Personal & Friendly**: Mimic the warmth of a virtual friend, not a clinical tool.
- **Emotional Hook**: Homepage should immediately resonate with users’ feelings.

## Visual & Interaction Guidelines
- **Colors**: Use soft pastels, gentle gradients, and warm undertones (peach, lavender, mint, sky blue, blush pink). Updated to green theme for a more calming effect (mint greens, teal accents).
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

## Color Theme Update (Latest Changes)
- **Theme Change**: Switched from pink/red theme to green theme for a more calming and soothing user experience.
- **Files Updated**:
  - Home.jsx: Gradients, shadows, text colors, benefit cards
  - MoodEntry.jsx: Container gradient and shadow
  - FriendlyButton.jsx: Button gradient from pink-yellow to green-teal
  - Chat.jsx: Header shadow
  - ChatBubble.jsx: User message gradient from pink to green
  - Progress.jsx: Chart colors for Sad and Anxious moods changed to green shades
  - OnboardingModal.jsx: Title color and button gradient
  - BreathingBackground.css: Background gradient
  - MoodEntry.jsx: Happy mood border color changed to green
- **Rationale**: Green is associated with calmness, nature, and healing, making it more appropriate for a mental wellness app than the previous pink/red theme which could be seen as more energetic or stressful.

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

## Chat Message UI Fixes

### 1. Avatar Size Fix
- Reduced avatar size to 35px (width and height).
- Made circular with border-radius: 50%.
- Used object-fit: cover to prevent stretching.
- Added margin: 0 8px for spacing.

### 2. Message Alignment
- AI messages: Left-aligned with avatar on left.
- User messages: Right-aligned with avatar on right, flex-direction: row-reverse.

### 3. Layout Structure
- Used flexbox: .message with display: flex.
- AI: justify-content: flex-start.
- User: justify-content: flex-end, flex-direction: row-reverse.

### 4. ChatMessage Component Update
- Refactored to new structure:
  - <div className={`message ${sender}`}>
    - <img className="avatar" />
    - <div className="message-content">
      - <span className="name">{name}</span>
      - <p>{text}</p>
    - </div>
  - </div>

### 5. CSS Changes
- Added styles for .message, .avatar, .message-content, .name.
- Background colors: AI #f1f1f1, User #d1e7ff.
- Max-width 60% for message-content.
- Name: bold, 12px, margin-bottom 2px.

### 6. Ensure
- Messages resemble WhatsApp/Chat apps.
- No overlapping or oversized images.
- Responsive layout maintained.

---

## Home Page Enhancement & Depression Test Overhaul

### TASK 1: Home Page Enhancement
- Added new section below hero with app description.
- Benefits section with 4 bullet points: 24/7 support, safe space, personalized buddy, insights.
- Contact page link for feature requests.
- "Start Depression Test" button navigating to /depression-test.
- Clean, modern styling with cards, centered, mobile responsive.

### TASK 2: Depression Test Page
- Replaced single textbox with structured questionnaire (7 questions).
- Questions: Sadness, interest, sleep, energy, concentration, hopelessness, anxiety.
- Options: Never, Sometimes, Often, Always (radio buttons).
- Optional additional text input.
- Combines answers into structured string for backend.
- Sends to same POST /depression/analyze-text API.
- Displays results exactly as before (percentage, severity, explanation).
- Form validation: All questions required.
- Loading state, error handling.
- UI: Clean layout with sections, submit button disabled if incomplete.

### Code Quality
- Modular code maintained.
- Existing API and routing preserved.
- No breaking changes to chat or profile.

---

*Home page now informative and engaging; Depression test now structured and user-friendly.*
