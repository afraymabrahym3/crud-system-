# Product Manager System

A full-stack web application for managing products with authentication system.

## Features

- User Authentication (Register/Login)
- Product Management (CRUD operations)
- Real-time price calculation
- PDF Export functionality
- Search by title or category
- Modern and responsive UI

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- PDF Generation: jsPDF

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd product-manager
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
MONGODB_URI=your_mongodb_uri
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5000
```

4. Start the server:
```bash
npm start
```

5. Open http://localhost:5000 in your browser

## Usage

1. Register a new account or login with existing credentials
2. Add products using the form
3. View all products in the table
4. Search products by title or category
5. Update or delete existing products
6. Export product list to PDF

## Security Features

- Password hashing
- JWT authentication
- Rate limiting
- Input validation
- XSS protection

## License

MIT License 