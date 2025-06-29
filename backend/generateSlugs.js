// generateSlugs.js

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import slugify from 'slugify';
import productModel from './models/productModel.js'; // Adjust path if needed

const generateSlugs = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) throw new Error("❌ MONGODB_URL not found in .env file");

    await mongoose.connect(mongoUrl);
    console.log('✅ Connected to MongoDB');

    // Optional: Confirm database name
    console.log('📂 Using DB:', mongoose.connection.name);

    const totalProducts = await productModel.countDocuments();
    console.log('📦 Total products:', totalProducts);

    const productsWithoutSlug = await productModel.find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
      ]
    });

    console.log('❓ Products missing slug:', productsWithoutSlug.length);

    if (productsWithoutSlug.length === 0) {
      console.log('✅ All products already have slugs');
      await mongoose.disconnect();
      process.exit(0);
    }

    for (const product of productsWithoutSlug) {
      const baseSlug = slugify(product.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;

      // Ensure uniqueness by excluding the current product's _id
      while (await productModel.findOne({ slug, _id: { $ne: product._id } })) {
        slug = `${baseSlug}-${counter++}`;
      }

      product.slug = slug;
      await product.save();

      console.log(`✅ Generated slug for "${product.name}": ${slug}`);
    }

    console.log('🎉 Slug generation completed');
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error generating slugs:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

generateSlugs();
