const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { connectDB } = require('./db/db');

// Route files
const employeeRoutes = require('./routes/employee.routes');
const customerRoutes = require('./routes/customer.routes');
const menuItemRoutes = require('./routes/menuItem.routes');
const orderRoutes = require('./routes/order.routes');
const krustyRoutes = require('./routes/krusty.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// API routes (RESTful JSON)
app.use('/api/employees', employeeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/menu-items', menuItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/krusty', krustyRoutes);

// Simple pages (optional frontend)
const KrustyKrab = require('./models/KrustyKrab');
const MenuItem = require('./models/MenuItem');
const Employee = require('./models/Employee');
const Customer = require('./models/Customer');
const Order = require('./models/Order');

app.get('/', async (req, res) => {
  try {
    const krusty = await KrustyKrab.findOne();
    const menuItems = await MenuItem.find();
    res.render('index', { krusty, menuItems });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render('employees', { employees });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/customers-orders', async (req, res) => {
  try {
    const customers = await Customer.find();
    const orders = await Order.find();
    res.render('customers_orders', { customers, orders });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

app.get('/menu-items', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.render('menu_items', { menuItems });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// 404 handler
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'Route not found' });
  }
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});


