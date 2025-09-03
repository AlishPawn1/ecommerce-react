import userModel from "../models/userModel.js";

// Add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    // Retrieve the user data and initialize cartData if it doesn't exist
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {}; // Default to empty object if cartData doesn't exist

    // Check if the item already exists in the cart
    if (cartData[itemId]) {
      // If the item exists, check if the size exists
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1; // Increment the quantity if size already exists
      } else {
        cartData[itemId][size] = 1; // Set quantity to 1 if size doesn't exist
      }
    } else {
      // If the item doesn't exist, initialize it with the size and quantity
      cartData[itemId] = { [size]: 1 };
    }

    // Update the user's cart in the database
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update product quantity in user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    // Retrieve the user data
    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {}; // Default to empty object if cartData doesn't exist

    // Ensure the item and size exist before updating
    if (cartData[itemId] && cartData[itemId][size]) {
      cartData[itemId][size] = quantity; // Update the quantity for the specified item and size
    } else {
      return res.json({
        success: false,
        message: "Item or size not found in cart",
      });
    }

    // Update the user's cart in the database
    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Cart updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Get user cart with total item count
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Retrieve the user data and get the cart
    const userData = await userModel.findById(userId);
    const cartData = userData.cartData || {}; // Default to empty object if cartData doesn't exist

    // Calculate total count of items in the cart
    let totalCount = 0;
    for (const itemId in cartData) {
      for (const size in cartData[itemId]) {
        totalCount += cartData[itemId][size]; // Sum up the quantities
      }
    }

    res.json({ success: true, cartData, totalCount }); // Include totalCount in the response
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
