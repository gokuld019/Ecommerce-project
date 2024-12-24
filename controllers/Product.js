import { Product } from "../Models/Product.js";
import {Cart} from '../Models/Order.js';
import { User } from "../Models/User.js";
import { BuyNow } from "../Models/BuyNow.js";


export const createProduct = async ( req , res ) => {
    

const{ title , description , category , price , stock ,brand , type } = req.body;
const image = req.file;
if(!image){
    return res.status(400).json({
        message : "please select the image",
    });
}

const product = await Product.create({
    title,
    description,
    category,
    price,
    stock,
    image : image?.path,
    brand,
    type
});
res.status(201).json({
    message : "Product Details Added Successfully",
    product,
}); 

    
};


// Updated fetchProductsByFilters API
export const fetchProductsByCategory = async (req, res) => {
  const { category, brands, priceRanges } = req.query;

  let filterConditions = {};

  // Apply category filter
  if (category) {
      filterConditions.category = category;
  }

  // Apply brand filter (if brands are passed as query params)
  if (brands && brands.length > 0) {
      filterConditions.brand = { $in: brands.split(',') };  // brands is a comma-separated string
  }

  // Apply price range filter
  if (priceRanges && priceRanges.length > 0) {
      const priceRangeConditions = priceRanges.split(',').map(range => {
          const [min, max] = range.split('-').map(Number);
          return { price: { $gte: min, $lte: max } };
      });
      filterConditions.$or = priceRangeConditions;
  }

  try {
      // Find products with the filter conditions
      const products = await Product.find(filterConditions);
      if (products.length > 0) {
          return res.status(200).json({
              message: "Products found",
              products: products,
          });
      } else {
          return res.status(404).json({
              message: "No products found for the given filters",
          });
      }
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: "Error fetching products",
      });
  }
};




export const fetchSingleProduct = async ( req , res ) => {
    try {
        const id = req.params.id;
       const product = await Product.findById(id); 
       return res.status(200).json({
        message : "product details",product
       });
    } catch (error) {
        return res.status(500).json({
            message : error.message,
        });
    }
};


export const addToCart = async (req, res) => {
  const { userId, quantity, selectedSize, selectedColor, title, price, image } = req.body;

  if (!userId || !quantity || !selectedSize || !selectedColor || !title || !price || !image) {
    return res.status(400).json({ message: 'User ID, Quantity, Size, Color, and Image are required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Add the image to the cart item
    const existingItemIndex = cart.items.findIndex(
      (item) => item.selectedSize === selectedSize && item.selectedColor === selectedColor && item.title === title && item.price === price && item.image === image
    );

    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;  // Update the existing item quantity
    } else {
      cart.items.push({ quantity, selectedSize, selectedColor, title, price, image });  // Add new item with image
    }

    await cart.save();
    res.status(200).json({ message: 'Product added to cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding product to cart' });
  }
};

// GET: Get User's Cart
export const getCart = async (req, res) => {
  const { userId } = req.params;  // Use params to get userId

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    // Find the user's cart by userId
    const cart = await Cart.findOne({ userId: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found for the given user' });
    }

    res.status(200).json({ message: 'Cart fetched successfully', cart: cart.items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};


// controllers/cart.js
export const incrementItem = async (req, res) => {
  const { userId, title } = req.body;

  if (!userId || !title) {
    return res.status(400).json({ message: 'User ID, Size, and Color are required' });
  }

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.title === title);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Increment the quantity of the item
    cart.items[itemIndex].quantity += 1;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Item quantity incremented', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error incrementing item' });
  }
};

export const decrementItem = async (req, res) => {
  const { userId, title } = req.body;

  if (!userId || !title) {
    return res.status(400).json({ message: 'User ID, Size, and Color are required' });
  }

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.title === title
        );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // If quantity is greater than 1, decrement it, otherwise remove the item from cart
    if (cart.items[itemIndex].quantity > 1) {
      cart.items[itemIndex].quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1); // Remove the item if quantity is 1
    }

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Item quantity decremented', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error decrementing item' });
  }
};

export const removeItem = async (req, res) => {
  const { userId, title } = req.body;

  if (!userId || !title) {
    return res.status(400).json({ message: 'User ID and Item Title are required' });
  }

  try {
    // Find the user's cart
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      (item) => item.title === title
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove the item from the cart
    cart.items.splice(itemIndex, 1);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};




export const ProductSearch = async (req, res) => {
  const { query, category } = req.query;  // Getting query and category from the request URL
  
  // If query is missing, return an error
  if (!query) {
    return res.status(400).json({ message: 'Search term is required' });
  }

  try {
    // Search for products by title or description and optionally by category
    const searchCriteria = {
      $or: [
        { title: { $regex: query, $options: 'i' } },  // Case-insensitive search by title
        { description: { $regex: query, $options: 'i' } }  // Case-insensitive search by description
      ]
    };

    // If category is provided, add it to the search criteria
    if (category) {
      searchCriteria.category = category;
    }

    // Find products matching the search criteria
    const products = await Product.find(searchCriteria);

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json(products);  // Send the found products
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};


export const deleteProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      
      // Delete the product by its ID
      const deletedProduct = await Product.findByIdAndDelete(productId);
      
      if (!deletedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }

  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  
  
  
  }


 
  // Update product details by ID
export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, image } = req.body;
  
    try {
      // Find and update the product by ID
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, description, price, image },
        { new: true } // Return the updated product
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: 'Product not found' });
      }
      res.json(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  };

  export const getMostPurchasedProducts = async (req, res) => {
    try {
      
      const popularProducts = await Cart.aggregate([
        { $unwind: "$items" }, 
        { $group: { _id: "$items.title", count: { $sum: "$items.quantity" } } }, 
        { $sort: { count: -1 } },
        { $limit: 10 }, 
      ]);
  
      
      const productTitles = popularProducts.map(item => item._id);
      const products = await Product.find({ title: { $in: productTitles } });
  
      res.status(200).json(products); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching most popular products" });
    }
  };


  export const getAllCartsForAdmin = async (req, res) => {
  try {
    const carts = await Cart.find()
      .populate('userId'); // Populate the 'userId' field with username and email from User
    res.status(200).json({ message: 'Carts fetched successfully', carts });
  } catch (error) {
    console.error(error);  // Log the actual error for debugging
    res.status(500).json({ message: 'Error fetching carts', error });
  }
};

export const BuyNowProducts = async (req, res) => {
  try {
    const { name, email, productId } = req.body;

    // Validate required fields
    if (!name || !email || !productId) {
      return res.status(400).send('Name, email, and product ID are required');
    }

    // Find the product by its ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Create a new "Buy Now" order
    const newOrder = new BuyNow({
      userName: name,           
      userEmail: email,         
      product: productId,       
      productName: product.title,  
      productPrice: product.price, 
    });

    // Save the order to the BuyNow collection
    await newOrder.save();

    // Respond with success
    res.status(200).send('Order placed successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error placing order');
  }
  
};

export const getBuyNowOrders = async (req, res) => {
  try {
    const orders = await BuyNow.find().populate('product');  // Populate product data
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching orders');
  }
};

