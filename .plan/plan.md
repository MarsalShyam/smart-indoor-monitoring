

# IoT Indoor Position Identification System Dashboard

## Overview
A production-ready, frontend-only dashboard simulating Wi-Fi RSSI fingerprinting-based indoor localization for a hospital/campus environment. Dark cyberpunk aesthetic with neon accents, tracking 10-20 simulated devices in real-time. All backend functionality is mocked locally for seamless future real-backend integration.

---

## Pages & Features

### 1. Authentication (Simulated)
- Login page with dark, techy design — glowing input fields, animated background
- Simulated JWT auth with mocked bcrypt-like password validation (frontend only)
- Two roles: **Admin** (full access) and **User** (limited to own device tracking)
- Tokens stored in localStorage; role determines visible UI sections

### 2. Main Dashboard (Home)
- **Live Stats Bar**: Total active devices, average signal strength, system uptime, alerts count
- **Mini Map Preview**: Thumbnail of the campus with blinking device dots
- **Recent Activity Feed**: Simulated log of device movements, zone entries/exits
- **Quick Analytics**: Small charts showing signal quality trends and device distribution

### 3. Indoor Map Visualization (Core Feature)
- **Hospital/Campus Floor Plan**: SVG-based map with labeled wings, rooms, corridors, departments (ER, ICU, Lobby, Labs, etc.)
- **Pixel-to-Grid Coordinate Mapping**: Defined grid overlay for precise positioning
- **Real-Time Moving Markers**: 10-20 animated device markers with smooth transitions, each color-coded by device type (staff, patient, equipment)
- **Zoom & Pan**: Smooth scroll-to-zoom and drag-to-pan with minimap navigator
- **Movement Path Lines**: Toggle-able trail lines showing each device's recent path history
- **Zone Highlighting**: Hover/click zones to see occupancy info
- **Multi-floor Tabs**: Switch between simulated campus floors

### 4. Analytics Dashboard
- **RSSI Signal Charts**: Line charts showing simulated RSSI values over time per access point
- **Signal Strength Heatmap**: Color-coded overlay on the map showing signal coverage
- **Comparison Charts**: Bar/radar charts comparing signal strength across access points for selected devices
- **Location Accuracy Metrics**: Estimated error radius, confidence percentage, positioning method indicator
- **Device Activity Summary**: Time spent per zone, movement frequency, idle detection

### 5. Movement History
- **Timeline View**: Scrollable timeline of a selected device's movement throughout the day
- **Path Replay**: Animated playback of a device's movement on the map
- **Data Table**: Paginated, sortable table with timestamp, coordinates, zone, signal strength
- **Multi-level Pagination**: Professional pagination with page size selector, jump-to-page, showing entry ranges
- **PDF Export**: Download movement history and analytics summaries as formatted PDF reports

### 6. Device Management (Admin Only)
- List of all tracked devices with status, last seen location, battery simulation
- Add/edit/remove simulated devices
- Assign devices to users or categories

### 7. Settings
- Environment config display (API base URL from .env)
- Theme toggle (dark mode primary, light mode secondary)
- Language/locale stub for future i18n
- Connection status indicator (mock WebSocket health)

---

## Architecture & Technical Approach

### State Management
- **Redux Toolkit** with slices for: auth, devices, map, analytics, UI settings
- RTK Query-like pattern for mock API calls

### Mock Backend System
- Local JSON files containing: RSSI fingerprint datasets, device profiles, floor plan metadata, user accounts
- Mock API service layer with simulated latency and error responses
- Interval-based streaming (setInterval) simulating WebSocket real-time updates — devices move along randomized but map-constrained paths
- Graceful error handling with toast notifications for simulated API failures

### Data & Simulation
- Sample RSSI fingerprint dataset with access point IDs, signal values, and mapped coordinates
- Randomized device movement constrained within hospital floor plan boundaries
- Simulated trilateration results with configurable accuracy noise

### Design System
- Dark background (#0a0a1a range) with neon cyan, magenta, and green accents
- Glowing borders, subtle grid overlays, scanline effects
- Professional data visualization with Recharts (already installed)
- Fully responsive — works on desktop and tablet views
- Smooth animations for marker movement, chart transitions, and page navigation

### PDF Export
- Client-side PDF generation for movement logs and analytics snapshots

### Scalability for Future Integration
- All mock API calls isolated in a services layer — swap to real HTTP calls by changing one config
- WebSocket simulation structured to be replaced with real socket connection
- Environment-based configuration via .env for API base URL
- Clear separation: components know nothing about data source (mock vs real)

