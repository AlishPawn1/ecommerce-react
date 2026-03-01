import mongoose from 'mongoose';
import 'dotenv/config';

const checkDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(`${process.env.MONGODB_URL}/newariDress`);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log(`📁 Found ${collections.length} collections:\n`);
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();
      console.log(`  ${collectionName}: ${count} documents`);
      
      // For products collection, show sample data
      if (collectionName === 'products' && count > 0) {
        const sample = await db.collection(collectionName).find({}).limit(3).toArray();
        console.log(`\n  Sample products:`);
        sample.forEach((product, index) => {
          console.log(`    ${index + 1}. ${product.name || 'Unnamed'}`);
          console.log(`       - ID: ${product._id}`);
          console.log(`       - Price: ${product.price}`);
          console.log(`       - Stock: ${product.stock}`);
          console.log(`       - Reviews: ${product.reviewCount || 0}`);
          console.log(`       - Avg Rating: ${product.averageRating || 0}`);
          console.log(`       - View Count: ${product.viewCount || 0}`);
        });
        console.log();
      }
    }
    
    // Check if products have the required fields
    const productsWithIssues = await db.collection('products').find({
      $or: [
        { reviewCount: { $exists: false } },
        { averageRating: { $exists: false } },
        { viewCount: { $exists: false } }
      ]
    }).toArray();
    
    if (productsWithIssues.length > 0) {
      console.log(`\n⚠️  Warning: ${productsWithIssues.length} products missing required fields:`);
      productsWithIssues.forEach(p => {
        console.log(`  - ${p.name}`);
        console.log(`    Missing: ${!p.reviewCount ? 'reviewCount ' : ''}${!p.averageRating ? 'averageRating ' : ''}${!p.viewCount ? 'viewCount' : ''}`);
      });
    } else {
      console.log('\n✅ All products have required fields');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\nConnection closed');
  }
};

checkDatabase();
