```md
# Weather App

A simple weather application built with Next.js that fetches current and forecast weather data for cities using the Weatherbit API, stores it in a PostgreSQL database via Prisma, and allows exporting data in JSON and CSV.

## Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL database
- Weatherbit API key (sign up at [weatherbit.io](https://www.weatherbit.io/))

## Setup
1. **Clone the Repository**
   ``bash
   git clone https://github.com/your-username/weather-app.git
   cd weather-app
   ```

2. **Install Dependencies**
   ```
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env.local` file in the root directory with:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/weatherdb
   WEATHER_API_KEY=your-weatherbit-api-key
   ```
   - Replace `DATABASE_URL` with your PostgreSQL connection string.
   - Replace `WEATHER_API_KEY` and `NEXT_PUBLIC_WEATHER_API_KEY` with your Weatherbit API key.

4. **Initialize the Database**
   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the App**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.
