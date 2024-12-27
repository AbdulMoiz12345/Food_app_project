const express = require('express');
const connectToMongo = require('./db'); // MongoDB connection
const User = require('./models/User'); // User model
const FoodItem = require('./models/FoodItem'); // FoodItem model (assuming you created it)
const Orders=require('./models/Orders')
const MadeOrder = require('./models/MadeOrder'); // Model for made orders table
const CompletedOrder=require('./models/CompletedOrder')
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // Import multer for file handling
const path = require('path');
const app = express();
const port = 5000;

// Connect to MongoDB
connectToMongo();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Register Route
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, address, phone, role } = req.body;

    // Validate input
    if (!email || !password || !address || !phone || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create new user
    const newUser = new User({ email, password, address, phone, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error.code === 11000) { // Handle duplicate email
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error('Error while registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Find the user with the provided email, password, and role
    const user = await User.findOne({ email, password, role });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      userId: user._id, // Send the user's MongoDB _id as userId
      userAddress:user.address
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Setup Multer for file uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Specify the uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Create unique filenames
  },
});

const upload = multer({ storage });

// Add Food Route
app.post('/api/add-food', upload.single('image'), async (req, res) => {
  const { category, name, options, description, sellerId } = req.body;

  try {
    const newFoodItem = new FoodItem({
      category,
      name,
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`, // Full URL
      options: JSON.parse(options), // Parse options JSON
      description,
      sellerId,
    });

    await newFoodItem.save();
    res.status(200).json({ success: true, message: 'Food item added successfully!' });
  } catch (error) {
    console.error('Error saving food item:', error);
    res.status(500).json({ success: false, message: 'Failed to add food item.' });
  }
});

// Get all food items for a seller
app.get('/api/seller-foods/:sellerId', async (req, res) => {
    try {
      const sellerId = req.params.sellerId;
      console.log(sellerId)
      const foodItems = await FoodItem.find({ sellerId }); // Find items by sellerId
      res.status(200).json(foodItems);
    } catch (error) {
      console.error('Error fetching food items:', error);
      res.status(500).json({ message: 'Failed to fetch food items' });
    }
  });

  // Delete food item
app.delete('/api/delete-food/:id', async (req, res) => {
    try {
      const foodItemId = req.params.id;
      const deletedFoodItem = await FoodItem.findByIdAndDelete(foodItemId);
  
      if (!deletedFoodItem) {
        return res.status(404).json({ message: 'Food item not found' });
      }
  
      res.status(200).json({ message: 'Food item deleted successfully' });
    } catch (error) {
      console.error('Error deleting food item:', error);
      res.status(500).json({ message: 'Failed to delete food item' });
    }
  });



// Fetch food item by ID
app.get('/api/food/:foodid', async (req, res) => {
  const { foodid } = req.params;  // Make sure to use the correct parameter name

  try {
    const foodItem = await FoodItem.findById(foodid);  // Use FoodItem here
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(foodItem);
  } catch (error) {
    console.error('Error fetching food item:', error);
    res.status(500).json({ message: 'Error fetching food item' });
  }
});

  
const fs = require('fs'); // Also ensure you have fs imported for file operations

app.put('/api/update-food/:foodid', upload.single('image'), async (req, res) => {
    const { foodid } = req.params;
    const { category, name, options, description } = req.body;
    const image = req.file ? req.file.filename : null;

    // Check if required fields are provided
    if (!category || !name || !options || !description) {
        return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
    }

    try {
        // Find the food item by ID
        const foodItem = await FoodItem.findById(foodid);

        if (!foodItem) {
            return res.status(404).json({ success: false, message: 'Food item not found.' });
        }

        // Update food item properties
        foodItem.category = category;
        foodItem.name = name;
        foodItem.description = description;
        foodItem.options = JSON.parse(options);

        // If a new image is uploaded, replace the old one
        if (image) {
            // Remove the old image file from the server (optional)
            if (foodItem.image) {
                const oldImagePath = path.join(__dirname, 'uploads', foodItem.image);
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Error deleting old image:', err);
                    }
                });
            }
            foodItem.image = image;
        }

        // Save the updated food item to the database
        await foodItem.save();

        return res.status(200).json({ success: true, message: 'Food item updated successfully!' });
    } catch (error) {
        console.error('Error updating food item:', error);
        return res.status(500).json({ success: false, message: 'An error occurred while updating the food item.' });
    }
});

app.post('/api/seller-orders', async (req, res) => {
  const { sellerId } = req.body;
  console.log("moiz")
  console.log(sellerId)
  try {
    if (!sellerId) {
      return res.status(400).json({ error: 'Seller ID is required' });
    }

    const orders = await Orders.find({ sellerId });
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





app.patch('/api/orders/:orderId/complete', async (req, res) => {
  const { orderId } = req.params;
  console.log(orderId)
  try {
    // Find the order by ID
    const order = await Orders.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create a new record in the madeOrders table
    const madeOrder = new MadeOrder({
      sellerId: order.sellerId,
      buyerId: order.buyerId, // Assuming buyerId maps to customerId
      foodName: order.name,
      quantity: order.quantity,
      amount: order.amount,
      price:order.price,
    });
    await madeOrder.save();

    // Remove the order from the orders table
    await Orders.findByIdAndDelete(orderId);

    res.status(200).json({ message: 'Order completed successfully' });
  } catch (error) {
    console.error('Error marking order as complete:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.get('/api/seller-completed-orders/:sellerId', async (req, res) => {
  const sellerId = req.params.sellerId;
  try {

    // Fetch completed orders
    const completedOrders = await CompletedOrder.find({ sellerId: sellerId }); // Use find() with buyerId
    res.json({
      completedOrders, // Orders that are completed
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Server Error');
  }
});




// Buyer section ____________________________________________________________________________________________________________________//


app.get('/api/get-foods', async (req, res) => {
  try {
    const foods = await FoodItem.find(); // Fetch all food items from the database
    res.status(200).json(foods); // Send foods data as response
  } catch (error) {
    console.error('Error fetching food items:', error);
    res.status(500).json({ message: 'Failed to fetch food items' });
  }
});

// Endpoint to receive and save orders
app.post('/api/orders', async (req, res) => {
  try {
    console.log("hello")
    console.log(req.body)
    const { sellerId, buyerId, foodId, name,amount, quantity, price, orderedAt } = req.body;

    // Validate required fields
    if (!sellerId || !buyerId || !foodId || !name || !quantity || !price || !orderedAt) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create a new order
    const newOrder = new Orders({
      sellerId,
      buyerId,
      foodId,
      name,
      amount,
      quantity,
      price,
      orderedAt,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({ message: 'Order created successfully', order: savedOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.get('/api/customer-orders/:buyerId', async (req, res) => {
  const buyerId = req.params.buyerId;
  console.log(buyerId);

  try {
    // Fetch all orders (pending)
    const orders = await Orders.find({ buyerId: buyerId }); // Use find() with buyerId

    // Fetch made orders (pending)
    const madeOrders = await MadeOrder.find({ buyerId: buyerId }); // Use find() with buyerId

    // Fetch completed orders
    const completedOrders = await CompletedOrder.find({ buyerId: buyerId }); // Use find() with buyerId

    console.log(madeOrders); // Check the console for results

    res.json({
      orders,
      madeOrders,      // Orders that are pending
      completedOrders, // Orders that are completed
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Server Error');
  }
});



//Rider section___________________________________________________________________________________________________________________//



// Fetch all made orders with user details
app.get('/api/rider-orders', async (req, res) => {
  try {
    const madeOrders = await MadeOrder.find();

    // Map through orders and fetch buyer and seller details
    const ordersWithDetails = await Promise.all(
      madeOrders.map(async (order) => {
        const buyer = await User.findById(order.buyerId);
        const seller = await User.findById(order.sellerId);

        return {
          orderId: order._id,
          foodName: order.foodName,
          quantity: order.quantity,
          price:order.price,
          amount: order.amount,
          buyer: {
            address: buyer?.address,
            phone: buyer?.phone,
            email: buyer?.email,
          },
          seller: {
            address: seller?.address,
            phone: seller?.phone,
            email: seller?.email,
          },
        };
      })
    );

    res.status(200).json({ success: true, orders: ordersWithDetails });
  } catch (error) {
    console.error('Error fetching rider orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Mark order as complete
app.patch('/api/rider-orders/:orderId/complete', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { riderId } = req.body; // Retrieve the riderId from the request body

    console.log("Marking order as complete with riderId:", riderId);

    // Find and remove the order from MadeOrder
    const completedOrder = await MadeOrder.findByIdAndDelete(orderId);
    if (!completedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Save the order to CompletedOrder table, including riderId
    const newCompletedOrder = new CompletedOrder({
      foodName: completedOrder.foodName,
      quantity: completedOrder.quantity,
      amount: completedOrder.amount,
      price: completedOrder.price,
      buyerId: completedOrder.buyerId,
      sellerId: completedOrder.sellerId,
      riderId // Include riderId in the new record
    });

    console.log("Completed order details:", newCompletedOrder);
    await newCompletedOrder.save();

    res.status(200).json({ success: true, message: 'Order marked as complete' });
  } catch (error) {
    console.error('Error marking order as complete:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.get('/api/rider-orders/:riderId', async (req, res) => {
  const riderId = req.params.riderId;

  try {
    // Fetch completed orders for the rider
    const completedOrders = await CompletedOrder.find({ riderId: riderId });

    // Enhance completed orders with buyer and seller details
    const ordersWithDetails = await Promise.all(
      completedOrders.map(async (order) => {
        const buyer = await User.findById(order.buyerId);
        const seller = await User.findById(order.sellerId);

        return {
          orderId: order._id,
          foodName: order.foodName,
          quantity: order.quantity,
          price: order.price,
          amount: order.amount,
          buyer: {
            address: buyer?.address || 'Unknown',
            phone: buyer?.phone || 'Unknown',
            email: buyer?.email || 'Unknown',
          },
          seller: {
            address: seller?.address || 'Unknown',
            phone: seller?.phone || 'Unknown',
            email: seller?.email || 'Unknown',
          },
        };
      })
    );
    console.log(ordersWithDetails)
    res.status(200).json({ success: true, orders: ordersWithDetails });
  } catch (error) {
    console.error('Error fetching completed rider orders:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

