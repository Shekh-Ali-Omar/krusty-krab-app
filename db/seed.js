const { connectDB, mongoose } = require('./db');
const Employee = require('../models/Employee');
const Customer = require('../models/Customer');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const KrustyKrab = require('../models/KrustyKrab');

async function seed() {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Promise.all([
      Employee.deleteMany({}),
      Customer.deleteMany({}),
      MenuItem.deleteMany({}),
      Order.deleteMany({}),
      KrustyKrab.deleteMany({}),
    ]);

    console.log('Inserting sample data...');

    await KrustyKrab.create({
      _id: 1,
      location: 'Bikini Bottom',
      phone: '555-1234',
      openingHours: '9:00 AM - 9:00 PM',
    });

    await Employee.insertMany([
      { employeeID: 101, name: 'SpongeBob SquarePants', position: 'Chef', salary: 3000 },
      { employeeID: 102, name: 'Squidward Tentacles', position: 'Cashier', salary: 2500 },
      { employeeID: 103, name: 'Patrick Star', position: 'Janitor', salary: 2000 },
    ]);

    const menuDocs = await MenuItem.insertMany([
      {
        name: 'Krabby Patty',
        description: 'Classic burger',
        price: 5.99,
        ingredients: ['Bun', 'Patty', 'Lettuce', 'Cheese'],
      },
      {
        name: 'Kelp Fries',
        description: 'Crispy kelp fries',
        price: 2.99,
        ingredients: ['Kelp', 'Salt', 'Oil'],
      },
      {
        name: 'Coral Bits',
        description: 'Small crunchy snacks',
        price: 1.99,
        ingredients: ['Coral', 'Spices'],
      },
    ]);

    await Customer.insertMany([
      { customerID: 201, name: 'Sandy Cheeks', contactInfo: 'sandy@bikini.com' },
      { customerID: 202, name: 'Mr. Krabs', contactInfo: 'krabs@bikini.com' },
    ]);

    const priceMap = {};
    menuDocs.forEach((m) => {
      priceMap[m.name] = m.price;
    });

    await Order.insertMany([
      {
        orderID: 301,
        customerID: 201,
        menuItemIDs: ['Krabby Patty', 'Kelp Fries'],
        quantity: [2, 1],
        totalPrice:
          2 * priceMap['Krabby Patty'] + 1 * priceMap['Kelp Fries'],
        date: new Date('2025-12-15'),
      },
      {
        orderID: 302,
        customerID: 202,
        menuItemIDs: ['Coral Bits'],
        quantity: [5],
        totalPrice: 5 * priceMap['Coral Bits'],
        date: new Date('2025-12-15'),
      },
    ]);

    console.log('✅ Seeding completed successfully.');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

seed();


