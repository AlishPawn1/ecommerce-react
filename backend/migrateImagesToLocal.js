import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import productModel from './models/productModel.js';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Download image from URL
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filepath = path.join(uploadsDir, filename);
    const file = fs.createWriteStream(filepath);
    
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${filename}`);
        resolve(filepath);
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
};

// Migrate images for all products
const migrateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL + '/newariDress');
    console.log('Connected to MongoDB');

    const products = await productModel.find({});
    console.log(`Found ${products.length} products to migrate`);

    const baseUrl = process.env.BACKEND_URL || 'http://localhost:4000';

    for (const product of products) {
      console.log(`\nMigrating images for: ${product.name}`);
      const newImageUrls = [];

      for (let i = 0; i < product.image.length; i++) {
        const imageUrl = product.image[i];
        
        // Skip if already a local URL
        if (imageUrl.includes('localhost') || imageUrl.includes('127.0.0.1')) {
          console.log(`⊘ Already local: ${imageUrl}`);
          newImageUrls.push(imageUrl);
          continue;
        }

        try {
          // Extract file extension from URL
          const ext = path.extname(new URL(imageUrl).pathname) || '.jpg';
          const filename = `${product._id}_${i}${ext}`;
          
          // Download image
          await downloadImage(imageUrl, filename);
          
          // Create new local URL
          const localUrl = `${baseUrl}/uploads/${filename}`;
          newImageUrls.push(localUrl);
        } catch (error) {
          console.error(`✗ Failed to download image: ${error.message}`);
          newImageUrls.push(imageUrl); // Keep original URL on error
        }
      }

      // Update product with new image URLs
      product.image = newImageUrls;
      await product.save();
      console.log(`✓ Updated product: ${product.name}`);
    }

    console.log('\n✅ Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

migrateImages();
