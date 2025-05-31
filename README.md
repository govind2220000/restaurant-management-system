# Food Ordering Application

A full-stack food ordering application with separate user and admin interfaces, built with React and Node.js.

## 🕒 Preparation Times

| Food Category   | Preparation Time (minutes) |
|----------------|---------------------------|
| Pizza          | 2                        |
| French Fries   | 1                        |
| Veggies        | 2                        |
| Drink          | 1                        |
| Burger         | 1                        |

## 🚀 Features

### User Features
- Browse menu items by categories (Pizza, Burger, Drink, French Fries, Veggies)
- Search functionality for menu items
- Add items to cart with quantity control
- View cart with order summary
- Add cooking instructions to orders
- Choose between Dine In and Take Away options
- Real-time order tracking
- Customer information management for orders

### Admin Features
- Dashboard with real-time analytics
- Table management system
- Order line monitoring
- Search functionality for tables and orders
- Real-time order status updates

## 🔗 Access URLs

### User Interface
- Endpoint URL(Mobile View): `https://brilliant-alfajores-d2322c.netlify.app/`

### Admin Dashboard
- Endpoint URL(Desktop View): `https://brilliant-alfajores-d2322c.netlify.app/admin`

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- CSS for styling
- React Router DOM for navigation
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```env
   PORT=8000
   MONGODB_URI=your_mongodb_uri
   ```

4. Start the server:
   ```bash
   npm start
   ```

## 📱 API Documentation

### Menu Endpoints
- `GET /api/menu`
  - Get all menu items
  - Response: Array of menu items with details
    ```json
    [{
      "id": string,
      "name": string,
      "price": number,
      "category": string,
      "description": string,
      "image": string,
      "preparationTimeMinutes": number,
      "tax": number
    }]
    ```
- `GET /api/menu/category/:category`
  - Get menu items by category
- `GET /api/menu/:id`
  - Get specific menu item details
- `GET /api/menu/search/:query`
  - Search menu items by name, category, or description
  - Case-insensitive search
- `POST /api/menu`
  - Create a new menu item
  - Validates duplicate names
- `POST /api/menu/bulk`
  - Bulk create menu items
  - Request body: Array of menu items
  - Returns success and error results
- `PUT /api/menu/:id`
  - Update menu item
  - Validates duplicate names
- `DELETE /api/menu/:id`
  - Delete menu item

### Order Endpoints
- `GET /api/orders`
  - Get all orders
  - Response includes populated menu items, table, and chef details
  - Sorted by creation date (newest first)
- `GET /api/orders/:id`
  - Get specific order details
- `POST /api/orders`
  - Place new order
  - Auto-assigns table for Dine In orders
  - Auto-calculates preparation time
  - Request body:
    ```json
    {
      "type": "Dine In" | "Take Away",
      "items": [
        {
          "menuItem": "itemId",
          "quantity": number
        }
      ],
      "cookingInstructions": string,
      "customer": {
        "name": string,
        "phone": string,
        "address": string // Required for Take Away orders
      },
      "table": "tableId", // Optional for Dine In
      "deliveryCharge": number
    }
    ```
- `PUT /api/orders/:id`
  - Update order details
- `PATCH /api/orders/:id/status`
  - Update order status
  - Request body: `{ "status": string }`

### Table Management Endpoints
- `GET /api/tables`
  - Get all tables
  - Response includes current order details
  - Sorted by table number
- `GET /api/tables/:id`
  - Get specific table details
- `GET /api/tables/search/:query`
  - Search tables by number, name, or status
  - Case-insensitive search
- `GET /api/tables/number/:tableNumber`
  - Get table by table number
  - Auto-adds 'T' prefix if not provided
- `POST /api/tables`
  - Create new table
  - Auto-generates table number (T01, T02, etc.)
  - Request body:
    ```json
    {
      "capacity": number,
      "name": string // Optional
    }
    ```
- `PUT /api/tables/:id`
  - Update table details
- `DELETE /api/tables/:id`
  - Delete a table
  - Validates if table can be deleted

### Dashboard Analytics Endpoints
- `GET /api/dashboard/analytics`
  - Get comprehensive dashboard data
  - Response includes:
    ```json
    {
      "totalChefs": number,
      "totalOrders": number,
      "totalRevenue": number,
      "totalClients": number,
      "revenueData": {
        "daily": [{ "period": object, "revenue": number, "date": string }],
        "weekly": [{ "period": object, "revenue": number, "startDate": string }],
        "monthly": [{ "period": object, "revenue": number, "startDate": string }]
      },
      "orderSummary": {
        "daily": object,
        "weekly": object,
        "monthly": object
      },
      "chefSummary": [{
        "name": string,
        "ordersHandled": number,
        "currentOrders": number,
        "estimatedAvailableAt": string
      }],
      "tableStatusSummary": [{
        "tableNumber": string,
        "isReserved": boolean
      }],
      "lastUpdated": string
    }
    ```

## 🔒 Environment Variables

### Frontend Variables
- `VITE_API_URL`: Backend API URL

### Backend Variables
- `PORT`: Server port number
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token generation


