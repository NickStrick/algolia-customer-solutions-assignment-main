// upload-data.js

// Import standard Node.js utilities for reading files
const fs = require('fs');
const path = require('path');

// Import the official Algolia Search client library
const algoliasearch = require('algoliasearch');

// Import dotenv to read variables safely from our local .env file
const dotenv = require('dotenv');

// -------------------------------------------------------------------------
// 1. ENVIRONMENT SETUP
// -------------------------------------------------------------------------

// Load the environment variables from the .env file into process.env
dotenv.config();

// Retrieve our keys from the environment configuration
const APP_ID = process.env.ALGOLIA_APP_ID;
const INDEX_NAME = process.env.ALGOLIA_INDEX;

// CRUCIAL: We use the ADMIN API Key here because we are pushing data.
// The search-only key used in the frontend doesn't have write permissions.
const ADMIN_KEY = process.env.ALGOLIA_ADMIN_API_KEY;

// Safeguard: Halt execution immediately if any required configurations are missing
if (!APP_ID || !ADMIN_KEY || !INDEX_NAME) {
  console.error(
    'Error: Missing required environment variables in your .env file.'
  );
  process.exit(1);
}

// -------------------------------------------------------------------------
// 2. INITIALIZE ALGOLIA CLIENT
// -------------------------------------------------------------------------

// Create an authenticated connection to the Algolia API
const client = algoliasearch(APP_ID, ADMIN_KEY);

// Target the specific index where our product data will be stored
const index = client.initIndex(INDEX_NAME);

// -------------------------------------------------------------------------
// 3. READ & TRANSFORM PRODUCT DATA
// -------------------------------------------------------------------------

// Read the raw text file using a direct relative path.
const productsPath = path.join(__dirname, 'data', 'products.json');
const rawData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

// Iterate through every single product record to perform our business logic
const transformedProducts = rawData.map((product) => {
  // Create a shallow copy of the product object to prevent mutating the source array
  const updatedProduct = { ...product };

  // REQUIREMENT CHECK: Algolia relies on a unique string/integer identifier named 'objectID'.
  // If the dataset provides a different key like 'id' or 'sku', we map it to 'objectID'.
  if (updatedProduct.id && !updatedProduct.objectID) {
    updatedProduct.objectID = updatedProduct.id.toString();
  }

  // BUSINESS LOGIC: Determine if this item belongs to the camera collection.
  // In this dataset, the category is represented by `categories` (array) and/or
  // `hierarchicalCategories.lvl0` (top-level category), not `category`.
  const categories = Array.isArray(updatedProduct.categories)
    ? updatedProduct.categories
    : [];

  const topLevelCategory =
    updatedProduct.hierarchicalCategories &&
    typeof updatedProduct.hierarchicalCategories.lvl0 === 'string'
      ? updatedProduct.hierarchicalCategories.lvl0
      : '';

  const isCamera =
    topLevelCategory.toLowerCase() === 'cameras & camcorders' ||
    categories.some((c) => typeof c === 'string' && c.toLowerCase().includes('camera'));

  // If it's a camera, apply the 20% discount structure requested by Spencer and Williams
  if (isCamera && updatedProduct.price) {
    // Math.floor rounds DOWN to the lowest full integer.
    updatedProduct.price = Math.floor(updatedProduct.price * 0.8);
  }

  return updatedProduct;
});

// -------------------------------------------------------------------------
// 4. BATCH UPLOAD TO ALGOLIA
// -------------------------------------------------------------------------

async function uploadData() {
  try {
    // saveObjects automatically chunks data into optimized network payloads.
    // Pushing all records in a single execution minimizes network overhead.
    const response = await index.saveObjects(transformedProducts);
    console.log(
      `Uploaded ${transformedProducts.length} records to index "${INDEX_NAME}".`,
      response
    );
  } catch (error) {
    // Catch any network, authentication, or validation errors thrown by Algolia's API
    console.error('Error uploading data to Algolia:', error);
  }
}

// Fire off the upload routine
uploadData();
