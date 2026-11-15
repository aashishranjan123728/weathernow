# 🌦️ WeatherNow – Live Global Weather Intelligence & Radar Platform

WeatherNow is a production-ready, modern full-stack live weather reporting web application. It delivers hyper-accurate real-time weather observations, interactive 24-hour analytical charts, a 7-day synoptic outlook, GPS location detection, global city autocomplete, city weather comparisons, user authentication, and cloud-synced favorite cities with search history.

Inspired by **Apple Weather** and modern SaaS dashboards, WeatherNow is built with glassmorphism UI, ambient glowing backdrops, and responsive layouts across mobile, tablet, and desktop.

---

## 🌟 Key Features

### 1. Meteorological Telemetry
- **Real-Time Weather**: Live temperature, "feels like" index, min/max values, weather condition descriptions, and dynamic animated icons.
- **Atmospheric Highlights**: UV index with health safety advice, wind speed & directional compass with gust tracking, barometric pressure (hPa), humidity & dew point comfort levels, horizontal visibility (km/m), and solar sunrise/sunset cycles.
- **Hourly 24-Hour Forecast**: Smooth horizontal scrolling timeline tracking hourly temperatures, conditions, and precipitation probability percentages.
- **7-Day Synoptic Outlook**: Normalized Apple Weather-style gradient temperature range indicators with precipitation markers.

### 2. Dual-Engine Meteorological Feeds
- **OpenWeatherMap Integration**: Supported via server-side API routes with `OPENWEATHER_API_KEY`.
- **Zero-Config Global Live Fallback (Open-Meteo)**: Real-time global high-resolution WMO models ensure 100% live uptime and accurate data out of the box even before entering an OpenWeatherMap key.
- **Server-Side In-Memory Caching**: Intelligent 5-minute cache prevents API rate limits and accelerates response times.

### 3. Interactive Analytics & Visualizations
- **Recharts Data Visualizer**: Switch between 24-Hour Temperature Arcs, Precipitation Probability Bars, and Wind/Humidity curves with custom tooltip overlays.
- **Dynamic Weather Backdrops**: Ambient glowing gradients and floating particles that dynamically react to conditions (Clear, Clouds, Rain, Thunderstorm, Snow, Fog, and Night).
- **Global Metropolitan Hubs**: One-click live weather previews for major global cities (Tokyo, London, New York, Paris, Dubai, Sydney).
- **Multi-City Comparison Tool**: Compare atmospheric conditions side-by-side for up to 4 global hubs simultaneously.

### 4. User System & Cloud Persistence
- **Authentication**: Powered by **NextAuth.js** with secure password hashing via **bcryptjs** and JWT sessions.
- **MongoDB Atlas Integration**:
  - `User`: Accounts with encrypted credentials.
  - `FavoriteCity`: User-saved destinations synced to cloud database.
  - `WeatherHistory`: Logged search queries with atmospheric snapshots.
- **Demo Mode**: Instant test login available with pre-configured demo account (`demo@weathernow.com` / `password123`).

### 5. UI/UX & Responsive Controls
- **Unit Switching**: Toggle instantly between Celsius (°C) and Fahrenheit (°F) with persistent storage.
- **Theme Modes**: Dark Mode and Light Mode support with smooth CSS transitions.
- **Geolocation Radar**: Browser GPS integration with permission handling and fallback search.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | Next.js 14 (App Router), React 18, TypeScript |
| **Styling & UI** | Tailwind CSS, Lucide React Icons, Framer Motion |
| **Data Visualization** | Recharts (Responsive vector charts) |
| **Backend & APIs** | Next.js Route Handlers (Edge & Node.js runtime) |
| **Database & ODM** | MongoDB Atlas, Mongoose ODM |
| **Authentication** | NextAuth.js (Auth.js) Credentials Provider, Bcrypt.js |
| **Weather APIs** | OpenWeatherMap API & Open-Meteo Global Feeds |
| **Deployment Targets** | Vercel (Edge & Serverless), GitHub Actions |

---

## 📂 Project Structure

```
├── src/
│   ├── app/                          # Next.js App Router Pages & API Routes
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/   # NextAuth session handlers
│   │   │   ├── auth/register/        # Secure user registration
│   │   │   ├── favorites/            # GET, POST, DELETE favorite hubs
│   │   │   ├── history/              # GET, POST, DELETE search history
│   │   │   └── weather/
│   │   │       ├── compare/          # Multi-city comparison endpoint
│   │   │       ├── current/          # Current live weather endpoint
│   │   │       ├── forecast/         # 24h & 7d forecast bundle
│   │   │       └── search/           # Global city autocomplete
│   │   ├── about/page.tsx            # About & architecture page
│   │   ├── city/[cityName]/page.tsx  # Dynamic city analytics page
│   │   ├── compare/page.tsx          # City comparison tool page
│   │   ├── dashboard/page.tsx        # Interactive weather dashboard
│   │   ├── login/page.tsx            # Glassmorphism login page
│   │   ├── profile/page.tsx          # Protected user favorites & history
│   │   ├── register/page.tsx         # User registration page
│   │   ├── layout.tsx                # Root layout with providers
│   │   ├── page.tsx                  # Landing & Spotlight Home page
│   │   └── globals.css               # Tailwind CSS & animations
│   ├── components/                   # Modular UI components
│   │   ├── CurrentWeatherCard.tsx    # Apple Weather style main card
│   │   ├── DailyForecast.tsx         # 7-day outlook with gradient bars
│   │   ├── DynamicWeatherBackground.tsx # Ambient condition backdrops
│   │   ├── FeaturedCities.tsx        # Major world hubs grid
│   │   ├── Footer.tsx                # SaaS footer with live metrics
│   │   ├── HourlyForecast.tsx        # 24-hour horizontal scrolling strip
│   │   ├── InteractiveWeatherCharts.tsx # Recharts temperature/rain/wind
│   │   ├── Navbar.tsx                # Glassmorphism top navigation
│   │   ├── WeatherHighlightsGrid.tsx # UV, Wind, Solar, Humidity, Pressure
│   │   ├── WeatherSearch.tsx         # Autocomplete & GPS search bar
│   │   └── WeatherSkeleton.tsx       # Shimmer loading placeholders
│   ├── context/                      # React Context providers
│   │   ├── AuthContext.tsx           # NextAuth SessionProvider
│   │   ├── ThemeContext.tsx          # Dark/Light theme manager
│   │   └── UnitContext.tsx           # °C / °F state & formatter
│   ├── lib/
│   │   ├── auth.ts                   # NextAuth credentials options
│   │   ├── mongodb.ts                # Mongoose connection cache
│   │   └── utils.ts                  # Metric converters & class merger
│   ├── models/                       # Mongoose Database Schemas
│   │   ├── FavoriteCity.ts           # Saved user destinations
│   │   ├── User.ts                   # User accounts & hashed passwords
│   │   └── WeatherHistory.ts         # User search history
│   ├── services/
│   │   └── weatherService.ts         # Dual API client & in-memory cache
│   └── types/
│       ├── auth.ts                   # Authentication TypeScript types
│       └── weather.ts                # Weather & Geocoding interfaces
├── .env.example                      # Sample environment variables
├── next.config.mjs                   # Next.js runtime configuration
├── package.json                      # Dependencies and scripts
├── tailwind.config.js                # Tailwind CSS palette & extensions
└── tsconfig.json                     # TypeScript strict configuration
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js**: v18.17.0 or newer (v20+ recommended)
- **npm** or **pnpm**
- **Git**

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/your-username/weathernow.git
cd weathernow
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
# MongoDB Atlas Connection URI
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/weathernow?retryWrites=true&w=majority

# OpenWeatherMap API Key (Get free key at https://openweathermap.org/api)
OPENWEATHER_API_KEY=your_openweather_api_key_here

# NextAuth Secret & URL
AUTH_SECRET=generate_a_random_32_character_secret_key_here
NEXTAUTH_SECRET=generate_a_random_32_character_secret_key_here
NEXTAUTH_URL=http://localhost:3000
```

> **Note on API Keys**: If `OPENWEATHER_API_KEY` is not provided, WeatherNow automatically routes queries through real live global Open-Meteo satellite feeds without any downtime or missing data.

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## ☁️ Deployment Guide

### Deploying to Vercel (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of WeatherNow live weather platform"
   git branch -M main
   git remote add origin https://github.com/your-username/weathernow.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com) and log in.
   - Click **"Add New..."** -> **"Project"**.
   - Import your `weathernow` repository.

3. **Configure Environment Variables in Vercel**:
   In the **Environment Variables** section, add:
   - `MONGODB_URI`: Your MongoDB Atlas connection string.
   - `OPENWEATHER_API_KEY`: Your OpenWeatherMap key (optional, fallback is active).
   - `NEXTAUTH_SECRET`: A secure 32+ character random string.
   - `NEXTAUTH_URL`: Your Vercel production domain (e.g. `https://weathernow.vercel.app`).

4. **Deploy**:
   - Click **Deploy**. Vercel will build the Next.js App Router project and provision global serverless and edge functions.
   - Once deployed, visit your production URL!

---

## 🛡️ Security & Best Practices
- **No Plaintext Passwords**: Uses `bcryptjs` with salt rounds for one-way credential encryption.
- **Zero Client-Side Key Exposure**: API keys (`OPENWEATHER_API_KEY`, `MONGODB_URI`, `AUTH_SECRET`) are strictly kept server-side inside Route Handlers and never sent to the browser.
- **Compound Database Indices**: Prevents duplicate city favorites and accelerates search history queries.
- **Connection Pooling**: Mongoose connection caching prevents pool exhaustion in serverless environments.

---

## 📄 License
This project is open-source under the MIT License.
