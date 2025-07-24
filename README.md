# Ecommerce React Project

## Quick Start with Docker Compose

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed

### Running All Services

1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd <your-project-folder>
   ```

2. **Start all services with Docker Compose:**
   ```sh
   docker-compose up --build
   ```
   This will build and run the backend, frontend, and admin containers.

3. **Access the apps:**
   - Backend: [http://localhost:4000](http://localhost:4000)
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:5174](http://localhost:5174)

4. **To stop all containers:**
   ```sh
   docker-compose down
   ```

---

## Manual Docker Commands (Optional)

If you want to build and run each service separately:

```sh
docker build -t backend-panel ./backend
docker build -t frontend-panel ./frontend
docker build -t admin-panel ./admin

docker run -d -p 4000:4000 --name backend-panel backend-panel
docker run -d -p 3000:3000 --name frontend-panel frontend-panel
docker run -d -p 5174:5174 --name admin-panel admin-panel
```

---

## Notes
- Make sure your `.env` files (if any) are present and configured for each service.
- If you use a database, you may want to add a database service to `docker-compose.yml`.
- For production, consider setting up volumes and environment variables as needed.

---

## Features

### Customer Frontend
- Browse products by category, subcategory, and bestsellers
- Product details with images, sizes, reviews, and ratings
- Add to cart, place orders, and track order status
- User authentication, profile management, and password reset
- Newsletter subscription and contact form
- Chatbot for product queries and support
- Responsive design with modern UI (Tailwind CSS)
- Payment integration (Stripe, Khalti, Esewa)

### Admin Dashboard
- Secure admin login
- Dashboard overview of sales, orders, and users
- Add, edit, and delete products, categories, and subcategories
- Manage stock and view stock history
- View and manage orders, users, feedback, and subscriptions
- Real-time order history and filtering

### Backend API
- RESTful API built with Express.js
- MongoDB for data storage (products, users, orders, etc.)
- JWT-based authentication for users and admin
- File uploads (Cloudinary integration)
- Email notifications (Nodemailer/SendGrid)
- Modular route and controller structure

---

## Technologies Used
- React 19 (Vite)
- Node.js 18/20, Express.js
- MongoDB & Mongoose
- Tailwind CSS
- Stripe, Khalti, Esewa (payments)
- Cloudinary (image hosting)
- Nodemailer, SendGrid (emails)
- Docker & Docker Compose (optional)

---

## Project Structure

```
ecommerce-react/
  frontend/    # Customer shop (React)
  admin/       # Admin dashboard (React)
  backend/     # Node.js/Express API
  docker-compose.yml
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- (Optional) Docker & Docker Compose

### 1. Clone the repository
```bash
git clone https://github.com/alishpawn1/ecommerce-react.git
cd ecommerce-react
```

### 2. Environment Variables
Create `.env` files in `backend/`, `frontend/`, and `admin/` as needed. Example for backend:
```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URLS=http://localhost:5173,http://localhost:5174
```

### 3. Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
cd ../admin && npm install
```

### 4. Run the Apps
#### With Docker Compose (recommended)
```bash
docker-compose up --build
```

#### Or run each app separately
```bash
# In three separate terminals:
cd backend && npm start
cd frontend && npm run dev
cd admin && npm run dev
```

- Frontend: http://localhost:5173
- Admin: http://localhost:5174
- Backend API: http://localhost:4000

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License
[MIT](LICENSE) 