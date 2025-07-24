import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Parse allowed frontend URLs from environment variable, trimming trailing slashes and ignoring empty strings
const frontendUrls = (process.env.FRONTEND_URLS || '')
  .split(',')
  .map(url => url.trim().replace(/\/+$/, ''))
  .filter(Boolean);

console.log('Allowed frontend URLs:', frontendUrls);

app.use(cors({
  origin: function (origin, callback) {
    console.log('Incoming request origin:', origin);
    // Allow requests with no origin (like curl, Postman) OR from allowed URLs only
    if (!origin || frontendUrls.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());

// Example route to test server is running
app.get('/', (req, res) => {
  res.send('Newari Traditional Backend is running!');
});

// Example API route
app.get('/api/product/top', (req, res) => {
  // Example response
  res.json([
    { name: "Men’s Newari Waistcoat – Dhaka Fusion", averageRating: 3, reviewCount: 1, score: 3.04 }
  ]);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
