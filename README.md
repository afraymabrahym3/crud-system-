# Product Manager

A full-stack web application for managing products with user authentication and authorization.

## Features

- User Authentication (Register/Login)
- JWT-based Authorization
- CRUD Operations for Products
- Real-time Product Search
- PDF Export Functionality
- Responsive Design
- Secure Password Hashing
- MongoDB Integration

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **PDF Generation**: jsPDF

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/product-manager.git
   cd product-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/product-manager
   JWT_SECRET=your-super-secret-jwt-key
   ```

## Running the Application

1. Start MongoDB service on your machine

2. Run the application:
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

3. Access the application at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get user data (protected)

### Products
- `GET /api/products` - Get all products (protected)
- `POST /api/products` - Create a product (protected)
- `PUT /api/products/:id` - Update a product (protected)
- `DELETE /api/products/:id` - Delete a product (protected)

## Security Features

- JWT-based authentication
- Password hashing using bcrypt
- Protected API endpoints
- Input validation and sanitization
- MongoDB injection protection
- CORS enabled
- Secure HTTP headers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [JWT](https://jwt.io/)
- [jsPDF](https://github.com/MrRio/jsPDF) 