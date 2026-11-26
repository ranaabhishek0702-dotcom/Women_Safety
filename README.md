# Women Safety Analytics – Protecting Women from Safety Threats
### Mobile Application (React Native / Expo)
**Organisation:** Bharat Electronics Limited (BEL)  
**Department:** SBU-BEL  
**Year:** 2024  
**Category:** Software / Artificial Intelligence Surveillance  
**Domain:** Public Safety, Computer Vision, Geospatial Analytics  

---

## 📌 Project Overview
The **Women Safety Analytics Mobile Application** is an advanced surveillance and analytical solution designed to protect women from safety threats in public and semi-public spaces. Built specifically to address the problem statement by **Bharat Electronics Limited (BEL)**, this solution provides proactive anomaly detection, real-time threat alarms, gender ratio monitoring, distress gesture recognition, and predictive geospatial hotspot mapping.

The application operates in two distinct, synchronized operational modes:
1. **Citizen Safety Companion Mode:** Equips individual women with real-time camera AI scanning, safe-corridor navigation, automated distress gesture recognition, and an instant 1-touch emergency SOS broadcast with GPS coordinates.
2. **BEL Command & Patrol Mode:** Enables BEL security control rooms and police PCR (Police Control Room) patrol units to receive prioritized threat dispatches, review live CCTV video analytics feeds, inspect gender imbalance telemetry, and deploy mobile interceptor vans to vulnerable hotspots.

---

## 🎯 Expected Solution Functionalities & Implementation

### 1. Person Detection along with Gender Classification
* **Implementation:** Located in [`src/services/visionAnalyticsEngine.ts`](file:///Users/abhishekrana/[AD]Final_Major_project/src/services/visionAnalyticsEngine.ts) and visual HUD in [`src/components/CameraVisionOverlay.tsx`](file:///Users/abhishekrana/[AD]Final_Major_project/src/components/CameraVisionOverlay.tsx).
* **Capabilities:**
  * Real-time bounding box tracking for every individual in the camera/video frame.
  * Gender classification tagging with confidence score (e.g. `WOMAN 96%` in hot pink, `MAN 94%` in tech blue).
  * High-tech CCTV viewfinder HUD with night-vision infrared simulation, live recording telemetry, and targeting reticles.

### 2. Gender Distribution & Real-time Scene Analytics
* **Implementation:** Located in [`src/components/GenderDistributionBar.tsx`](file:///Users/abhishekrana/[AD]Final_Major_project/src/components/GenderDistributionBar.tsx).
* **Capabilities:**
  * Dynamic counter displaying the exact number of men and women present.
  * Proportional split progress bar displaying gender percentage ratio in real time.
  * Male-to-Female ratio indicator (e.g. `4.0 : 1.0 M/F`).
  * Safety Score algorithm evaluating environmental safety from 0 to 100 with dynamic risk categorization (`SAFE`, `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).

### 3. Identifying a Lone Woman at Night Time
* **Implementation:** Located in [`src/services/visionAnalyticsEngine.ts`](file:///Users/abhishekrana/[AD]Final_Major_project/src/services/visionAnalyticsEngine.ts).
* **Criteria:**
  * Detects solitary female pedestrian in low-density or isolated environments.
  * Evaluates temporal criteria (night-time hours e.g., 20:00 - 05:00, with an interactive Day/Night toggle for testing).
  * Flags proactive tracking alert: `"LONE WOMAN (NIGHT)"` with amber bounding box highlight and notification to nearby police aid posts.

### 4. Detection of a Woman Surrounded by Men
* **Implementation:** Located in [`src/services/visionAnalyticsEngine.ts`](file:///Users/abhishekrana/[AD]Final_Major_project/src/services/visionAnalyticsEngine.ts) and visual threat links in [`src/components/CameraVisionOverlay.tsx`](file:///Users/abhishekrana/[AD]Final_Major_project/src/components/CameraVisionOverlay.tsx).
* **Spatial Proximity Algorithm:**
  * Computes relative Euclidean distances between female centroids and surrounding male centroids:
    $$d(f, m) = \sqrt{(cx_f - cx_m)^2 + (cy_f - cy_m)^2}$$
  * Detects tight clusters where $\ge 3$ men surround a lone female within danger radius ($d \le 26\%$).
  * Generates an immediate **CRITICAL THREAT ALERT** with pulsing red encirclement bounding boxes, visual threat vector lines connecting the men to the woman, audio alert sirens, and automatic PCR van dispatch.

### 5. Recognizing SOS Situation Through Gesture Analytics
* **Implementation:** Located in [`src/services/gestureAnalyticsEngine.ts`](file:///Users/abhishekrana/[AD]Final_Major_project/src/services/gestureAnalyticsEngine.ts) and [`src/components/GestureRecognitionHUD.tsx`](file:///Users/abhishekrana/[AD]Final_Major_project/src/components/GestureRecognitionHUD.tsx).
* **Supported Distress Signals:**
  * **Universal Signal for Help (3-step gesture):**
    1. *Stage 1:* Open palm facing the camera (fingers upright, thumb extended).
    2. *Stage 2:* Thumb tucked inside palm.
    3. *Stage 3:* Four fingers folded down over thumb into a fist.
  * **Raised Both Hands / Surrender distress posture.**
* **Safeguard & Dispatch Workflow:**
  * High-confidence stage-3 confirmation starts a **3-second safeguard countdown** to prevent accidental triggers.
  * Upon confirmation: Sounds emergency alarm, triggers device haptics, broadcasts live GPS coordinates to BEL Central Command and emergency contacts (112, 1091, family).

### 6. Identifying Hotspots Where Incidents Are More Likely to Occur
* **Implementation:** Located in [`src/services/hotspotAnalytics.ts`](file:///Users/abhishekrana/[AD]Final_Major_project/src/services/hotspotAnalytics.ts) and [`src/components/HotspotMapCard.tsx`](file:///Users/abhishekrana/[AD]Final_Major_project/src/components/HotspotMapCard.tsx).
* **Capabilities:**
  * **Interactive GIS Hotspot Map:** Visualizes high-risk, medium-risk, and safe zones with heat radii circles and incident pins.
  * **Historical Incident Intelligence:** Displays historical alert count, peak vulnerable hours (e.g. 22:00 - 02:30), primary threat category, and nearest safe shelters (booths, all-night pharmacies).
  * **AI Safe Route Navigator:** Compares the fastest shortcut against the recommended **Smart Safe-Corridor** (100% street lighting, continuous BEL CCTV coverage, active police patrols).
  * **Patrol Deployment Recommender:** Suggests optimal PCR mobile interceptor van positioning for BEL SBU security squads based on incident density.

---

## 📱 Application Screens & Navigation Architecture

```
App.tsx (Root Provider & Header)
└── TabNavigator
    ├── 1. Live Vision Screen (CameraVisionOverlay + GenderDistributionBar + CCTV Simulator)
    ├── 2. Gesture SOS Screen (Hand Gesture HUD + Universal Signal Guide + Emergency Dispatch Log)
    ├── 3. Hotspots Analytics Screen (GIS Map + Safe Route Navigator + Patrol Deployment Planner)
    ├── 4. Incident Alerts Screen (Audit Trail + Status Filters: Active, Dispatched, Resolved)
    └── 5. Settings & Config Screen (Threshold Sliders + Emergency Contact Manager + BEL Compliance)
```

---

## 🛠️ Technology Stack
* **Framework:** React Native with Expo SDK 52
* **Language:** TypeScript
* **State Management:** React Context API (`SafetyAppContext`)
* **Vector Graphics & HUD:** `react-native-svg`
* **Icons:** `@expo/vector-icons` (Ionicons)
* **Feedback:** `expo-haptics`
* **Sensors & Location:** `expo-location`

---

## 🚀 How to Run the Application

### Prerequisites
* Node.js (v18+ recommended)
* npm or yarn
* Expo Go app on your iOS or Android device, or an iOS Simulator / Android Emulator

### Installation & Launch Steps
```bash
# 1. Navigate to the project directory
cd "[AD]Final_Major_project"

# 2. Install dependencies
npm install

# 3. Start the Expo development server
npx expo start
```

### Testing on Devices
* **iOS / Android:** Scan the QR code displayed in the terminal using the Expo Go app or Camera app.
* **Web Browser:** Press `w` in the terminal to run in your local web browser.

---

## 🧪 Interactive Scenario Presets
The app features built-in CCTV test scenarios to immediately verify every requirement:
* **Scenario A:** *Woman Surrounded by Men* &rarr; Triggers Critical surrounded alert with threat vectors.
* **Scenario B:** *Lone Woman at Night* &rarr; Triggers High warning with night vision tracking.
* **Scenario C:** *SOS Distress Hand Signal* &rarr; Evaluates 3-stage Signal for Help gesture.
* **Scenario D:** *Daylight Balanced Crowd* &rarr; Validates normal safe gender distribution.
* **Scenario E:** *Moderate Night Loitering* &rarr; Tests spatial proximity threshold boundaries.

---
**Developed for Bharat Electronics Limited (BEL) • SBU-BEL Women Safety Analytics 2024**
