const mongoose = require("mongoose");
const axios = require("axios");
const Place = require("./models/Place");
require("dotenv").config();

const SERPAPI_KEY = process.env.SERPAPI_KEY;
const CENTER_LAT = 13.3525;
const CENTER_LON = 74.7934;

const MOOD_QUERIES = {
  study: "cafes with wifi near Manipal",
  hangout: "casual restaurants cafes near Manipal",
  "quick-bite": "fast food restaurants near Manipal",
  budget: "cheap restaurants near Manipal",
  nightlife: "bars pubs nightclubs near Manipal",
  gaming: "gaming cafes arcades near Manipal",
  fitness: "gyms fitness centers near Manipal",
  rentals: "bike car rental shops near Manipal",
  "hidden-gems": "unique local hidden spots near Manipal",
  beaches: "beaches near Manipal Udupi",
  movies: "movie theatres cinemas near Manipal",
};

async function fetchPlacesForMood(mood, query) {
  const res = await axios.get("https://serpapi.com/search", {
    params: {
      engine: "google_maps",
      q: query,
      ll: `@${CENTER_LAT},${CENTER_LON},14z`,
      type: "search",
      api_key: SERPAPI_KEY,
    },
  });

  const results = res.data.local_results || [];

  return results.map((r) => ({
    title: r.title,
    type: r.type || mood,
    address: r.address || "",
    lat: r.gps_coordinates?.latitude || CENTER_LAT,
    lon: r.gps_coordinates?.longitude || CENTER_LON,
    rating: r.rating || 0,
    reviews: r.reviews || 0,
    price_level: r.price || "",
    open_now: r.operating_hours?.open_now ?? true,
    image: r.thumbnail || "",
    phone: r.phone || "",

    mood_tags: [mood],
    city: "manipal",
  }));
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  let allPlaces = [];

  for (const [mood, query] of Object.entries(MOOD_QUERIES)) {
    console.log(`Fetching for mood: ${mood}...`);
    try {
      const places = await fetchPlacesForMood(mood, query);
      console.log(`  Got ${places.length} places`);
      allPlaces = allPlaces.concat(places);
    } catch (err) {
      console.error(`  Error fetching ${mood}:`, err.message);
    }

    // avoid hitting rate limits
    await new Promise((r) => setTimeout(r, 1000));
  }

  await Place.deleteMany({});
  await Place.insertMany(allPlaces);
  console.log(`Seeded ${allPlaces.length} real places!`);
  process.exit();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});