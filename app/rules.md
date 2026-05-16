Features of this project : 
- AI-Powered Fitness Coach- basically a chatbot to ask about stuff
- Real-time form analysis - camera feed correcting form using mediapipe
- Personalized training plans - training plans to choose from and adapt
- AI-driven fitness guidance - detailed information on each muscle where you can click on each muscle and get a detialed review
-Voice Coach - recordings for each exercise which user can play and figure out what to do 
dashboard page - where calories and workouts are tracked 
ai insights tab - where random insights are shown 



-
 
## Project Design & Aesthetics
 
### 1. Theme: "System Terminal / Brutalist Tech"
The application follows a high-tech, terminal-inspired aesthetic characterized by:
- **Core Palette**: 
  - **Background**: Pure Black (`#000000`)
  - **Accent**: Neon Blue (`#00f2ff`) / Cyan
  - **Primary**: Stark White (`#ffffff`)
- **Typography**: 
  - `Geist Mono` for all technical data, labels, and terminal text.
  - `Geist Sans` for UI readability.
- **Visual Elements**:
  - **Glassmorphism**: Heavy use of `backdrop-blur` for overlays and cards.
  - **Technical Notations**: GPS coordinates, system status logs, and "Start Sequence" terminology.
  - **Patterns**: Dithered textures, dot grids, and minimalist 1px borders.
- **Key Files**: 
  - `styles/globals.css`: Global theme variables and base styles.
  - `app/page.tsx`: Landing page layout and structure.
 
### 2. Animations & Interactions
- **The Scanner (Stage 1)**: 
  - An interactive 3D Vitruvian man (WebGL) that triggers a "system scan" on interaction.
  - A horizontal neon scan-line animation moving top-to-bottom.
- **Transitions**: 
  - Smooth page-to-page fade transitions using `AnimatePresence`.
  - Dark mode screen overlays for loading sequences.
- **Micro-Animations**:
  - **Hover Effects**: Icon scaling, border inversions, and neon glow pulses.
  - **Status Indicators**: Pulsing dots for "System Active" and "Rendering" states.
  - **Dithered Accents**: Subtle background animations using CSS repeating gradients.
- **Key Files**:
  - `components/ui/hero-ascii.tsx`: Handles WebGL integration, scan logic, and complex CSS patterns.
  - `components/ui/dock-two.tsx`: Animated navigation dock with interaction states.
 
### 3. Core Functionality Implementation
 
- **AI-Powered Training Plans**: 
  - **Matrix Initialization**: Personalized workout generation based on user goals (Muscle Gain, Fat Loss, Strength, Endurance), fitness level, and focus areas.
  - **Dynamic Protocol**: Customizable duration (weeks) and frequency (sessions/week).
  - **Key Files**: `components/plan-generator.tsx`, `components/training-plans.tsx`, `components/plan-card.tsx`.

- **Neural AI Insights**: 
  - **Performance Telemetry**: Analyzes user data to provide feedback on kinematics, form optimization, and fatigue levels.
  - **Execution Protocols**: Actionable AI-generated suggestions for future training sessions (e.g., "Initiate optical scan", "Schedule system standby").
  - **Key Files**: `components/ai-insights.tsx`, `components/ai-recommendations.tsx`.

- **Real-Time Form Analysis**: 
  - **Optical Scanning**: Uses **MediaPipe Pose** for real-time kinematic analysis. Automatically initializes WASM models and calibrates to the user's optical sensor.
  - **Exercise Protocols**: Supported modules include **BICEP CURLS**, **SQUATS**, and **PUSH-UPS**, each with unique joint landmark mapping (Shoulder-Elbow-Wrist for upper body, Hip-Knee-Ankle for lower body).
  - **Rep Counting Logic**: Implements a dual-stage state machine (UP/DOWN) based on joint angle thresholds mirrored from specialized kinematic research (MediaPipe Python Notebook implementation).
  - **Kinematic HUD**: Real-time geometric overlays showing:
    - **Angle Tracking**: Vertex-anchored joint angle display.
    - **Stage Tracking**: Real-time phase detection (PREP/UP/DOWN).
    - **Form Feedback**: Dynamic diagnostic messages (e.g., "PERFECT!", "NOT DEEP ENOUGH", "OVER EXTENDED").
  - **Key Files**: 
    - `components/live-form-analyzer.tsx`: Core logic, state machine, and MediaPipe integration.
    - `app/dashboard/form-check/page.tsx`: Protocol selection and module entry point.
    - `components/form-analyzer.tsx`: Legacy analysis module.

- **Interactive Muscle Explorer**: 
  - **System Mapping**: SVG-based interactive body map (Front/Back) for targeted muscle analysis and guidance.
  - **Muscle Matrix**: Clickable zones that provide detailed insights into specific muscle groups.
  - **Key Files**: `components/muscle-explorer.tsx`, `components/svg-body-front.tsx`, `components/svg-body-back.tsx`.

- **AI Voice Coaching**: 
  - **Audio Guidance**: Real-time motivational and instructional audio feedback during workout sessions.
  - **Session Management**: Customizable voice settings and session tracking.
  - **Key Files**: `components/voice-coach-session.tsx`, `components/voice-coach.tsx`, `components/voice-settings.tsx`.

- **Analytics & Dashboard**:
  - **System Telemetry**: Tracking calories, workouts, and progress goals with high-tech data visualizations.
  - **Key Files**: `components/progress-dashboard.tsx`, `components/progress-goals.tsx`, `components/workout-history.tsx`.
