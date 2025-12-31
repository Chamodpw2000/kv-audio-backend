# KV Audio Backend

This is the backend for the KV Audio web application, built with Node.js, Express, and MongoDB. It provides RESTful APIs for user management, product handling, orders, reviews, analytics, and more.

## Features
- User registration, login (including Google OAuth), profile management, email verification via OTP
- Product CRUD operations
- Order management
- Review system
- Newsletter and inquiry handling
- Gallery management
- Analytics endpoints
- Admin and customer role-based access control

## Project Structure
```
Backend/
├── addorders.js
├── index.js
├── package.json
├── controllers/
│   ├── analyticsController.js
│   ├── galleryController.js
│   ├── inquiryController.js
│   ├── newsLetterController.js
│   ├── orderController.js
│   ├── productController.js
│   ├── reviewController.js
│   └── userController.js
├── models/
│   ├── gallery.js
│   ├── inquiry.js
│   ├── newsLetter.js
│   ├── order.js
│   ├── otp.js
│   ├── products.js
│   ├── review.js
│   └── users.js
├── routes/
│   ├── analyticsRoute.js
│   ├── galleryRoute.js
│   ├── inquiryRoute.js
│   ├── newsLetterRoute.js
│   ├── orderRouter.js
│   ├── productsRoute.js
│   ├── reviewRoute.js
│   └── userRouter.js
```

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- MongoDB instance (local or cloud)

### Installation
1. Clone the repository:
   ```powershell
   git clone https://github.com/Chamodpw2000/kv-audio-backend.git
   cd kv-audio-backend/Backend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Create a `.env` file in the `Backend` folder with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ```
4. Start the server:
   ```powershell
   npm start
   ```

## API Endpoints

### User
- `POST /api/users/register` — Register a new user
- `POST /api/users/login` — Login
- `POST /api/users/google-login` — Login with Google
- `GET /api/users/profile` — Get user profile
- `PUT /api/users/profile` — Edit user profile
- `POST /api/users/send-otp` — Send OTP for email verification
- `POST /api/users/verify-otp` — Verify OTP
- `GET /api/users` — Get all users (admin only)
- `PUT /api/users/block/:email` — Block/unblock user (admin only)

### Products
- `GET /api/products` — List products
- `POST /api/products` — Add product
- `PUT /api/products/:id` — Update product
- `DELETE /api/products/:id` — Delete product

### Orders
- `GET /api/orders` — List orders
- `POST /api/orders` — Create order
- ...

### Reviews
- `GET /api/reviews` — List reviews
- `POST /api/reviews` — Add review
- ...

### Analytics, Gallery, Newsletter, Inquiry
- See respective routes/controllers for details

## Environment Variables
- `MONGODB_URI` — MongoDB connection string
- `JWT_SECRET` — JWT signing secret
- `EMAIL_USER` — Gmail address for sending OTPs
- `EMAIL_PASS` — Gmail app password

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
MIT
