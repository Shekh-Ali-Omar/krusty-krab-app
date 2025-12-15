## Krusty Krab Restaurant App

Full-stack Node.js + Express + MongoDB application to manage the Krusty Krab restaurant: employees, customers, menu items, and orders. MongoDB is expected to run locally at `mongodb://localhost:27017/krusty_krab_db`.

### 1. Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** running locally on `mongodb://localhost:27017`

### 2. Install Dependencies

From the project root:

```bash
npm install
```

### 3. Configure Environment (optional)

By default, the app connects to:

```text
mongodb://localhost:27017/krusty_krab_db
```

You can override this by creating a `.env` file:

```text
MONGODB_URI=mongodb://localhost:27017/krusty_krab_db
PORT=3000
```

### 4. Seed the Database

This will clear existing data in the collections and insert the sample data from the assignment.

```bash
npm run seed
```

You should see log messages confirming insertion of Krusty Krab info, employees, menu items, customers, and orders.

### 5. Start the Server

Development (with `nodemon`):

```bash
npm run dev
```

Or regular start:

```bash
npm start
```

The server will run on `http://localhost:3000` (or the `PORT` value you set).

### 6. Frontend Pages (EJS)

- **Home / Krusty Krab info + menu**
  - URL: `GET /`
  - Shows Krusty Krab info (location, phone, opening hours) and list of menu items.

- **Employee management (view + create)**
  - URL: `GET /employees`
  - Shows existing employees and a simple form to create an employee (submits to the API).

- **Customer & order overview**
  - URL: `GET /customers-orders`
  - Shows customers list and existing orders.

### 7. REST API Endpoints (for Postman)

Base URL: `http://localhost:3000/api`

#### Krusty Krab Info (`/krusty`)

- **GET** `/api/krusty` – list all Krusty Krab docs (usually just one).
- **POST** `/api/krusty`
  - Body (JSON), e.g.:
    ```json
    {
      "_id": 1,
      "location": "Bikini Bottom",
      "phone": "555-1234",
      "openingHours": "9:00 AM - 9:00 PM"
    }
    ```
- **GET** `/api/krusty/:id` – get by Mongo `_id` (or the numeric `_id` after seeding).
- **PATCH** `/api/krusty/:id` – partial update.
- **DELETE** `/api/krusty/:id` – delete.

#### Employees (`/employees`)

- **GET** `/api/employees` – list employees.
- **POST** `/api/employees`
  - Example JSON:
    ```json
    {
      "employeeID": 104,
      "name": "New Employee",
      "position": "Cook",
      "salary": 2200
    }
    ```
- **GET** `/api/employees/:id` – get by Mongo `_id`.
- **PATCH** `/api/employees/:id` – partial update.
- **DELETE** `/api/employees/:id` – delete.

#### Customers (`/customers`)

- **GET** `/api/customers`
- **POST** `/api/customers`
  - Example JSON:
    ```json
    {
      "customerID": 203,
      "name": "Plankton",
      "contactInfo": "plankton@chum.com"
    }
    ```
- **GET** `/api/customers/:id`
- **PATCH** `/api/customers/:id`
- **DELETE** `/api/customers/:id`

#### Menu Items (`/menu-items`)

- **GET** `/api/menu-items`
- **POST** `/api/menu-items`
  - Example JSON:
    ```json
    {
      "name": "Deluxe Krabby Patty",
      "description": "Extra tasty burger",
      "price": 7.99,
      "ingredients": ["Bun", "Patty", "Lettuce", "Cheese", "Pickles"]
    }
    ```
- **GET** `/api/menu-items/:id`
- **PATCH** `/api/menu-items/:id`
- **DELETE** `/api/menu-items/:id`

#### Orders (`/orders`)

- **GET** `/api/orders`
- **POST** `/api/orders`
  - Example JSON (note: `customerID` and `menuItemIDs` are business references, not Mongo `_id`s; the API validates that the customer and menu item names exist before creating the order):
    ```json
    {
      "orderID": 303,
      "customerID": 201,
      "menuItemIDs": ["Krabby Patty", "Kelp Fries"],
      "quantity": [1, 2],
      "date": "2025-12-16"
    }
    ```
- **GET** `/api/orders/:id`
- **PATCH** `/api/orders/:id`
- **DELETE** `/api/orders/:id`

### 8. Error Handling Notes

- All routes wrap DB access in `try/catch` blocks and return:
  - `400` for invalid IDs or validation errors.
  - `404` when a document is not found.
  - `500` for unexpected server errors.
- API errors respond with JSON like:
  ```json
  {
    "message": "Failed to create employee",
    "error": "Validation failed ..."
  }
  ```

### 9. Project Structure (Summary)

### 10. Frontend (React)

From the project root:

```bash
cd client
npm install
npm run dev


```text
db/
  db.js          # Mongo connection
  seed.js        # Seeding script
models/
  Employee.js
  Customer.js
  MenuItem.js
  Order.js
  KrustyKrab.js
routes/
  employee.routes.js
  customer.routes.js
  menuItem.routes.js
  order.routes.js
  krusty.routes.js
views/
  index.ejs
  employees.ejs
  customers_orders.ejs
public/
  css/
    styles.css
server.js
package.json
README.md
```


