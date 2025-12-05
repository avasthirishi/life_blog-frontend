# 📘 LifeBlog – Full-Stack Blogging Platform

LifeBlog is a modern full-stack blogging application where users can create, manage, and read blogs. The platform includes user authentication, image uploads, personal dashboards, and a clean UI built for responsiveness.

---

## 🌍 Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | [https://life-blog-frontend.vercel.app](https://life-blog-frontend.vercel.app) |
| **Backend API** | [https://life-blog-backend.onrender.com/api](https://life-blog-backend.onrender.com/api) |

---

## 🚀 Features

### 🔐 Authentication
- User Signup & Login (JWT based)
- Password hashing using bcrypt
- Protected API routes for logged-in users

### 📝 Blog Features
- Create blog posts with images
- Edit & Delete personal blogs
- View all blogs or a single blog page
- Like & Comment functionality (optional in future updates)

### 🧑‍💻 User Dashboard
- Manage "My Blogs"
- Update profile (future)

### ☁️ Image Upload
- Image upload using Multer
- Hosted securely on Cloudinary

### 🎨 Frontend Features
- Fully responsive UI using Tailwind CSS
- React Router for navigation
- Clean and minimal design

### 📬 Contact Form
- Users can submit messages
- Stored in MongoDB for admin review

---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **React Router DOM**
- **Tailwind CSS**
- **JavaScript ES6**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JSON Web Token (JWT)**
- **bcrypt** (password hashing)
- **Multer** (file upload)
- **Cloudinary SDK** (image hosting)

### Database
- **MongoDB Atlas** (cloud database)

### Deployment
- **Frontend** → Vercel
- **Backend** → Render
- **Storage** → Cloudinary

---

## 📂 Folder Structure

```
LifeBlog
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   ├── index.js
│   └── package.json
│
└── frontend
    ├── public
    ├── src
    │   ├── assets
    │   ├── components
    │   ├── pages
    │   ├── services
    │   ├── utils
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## ⚙️ Environment Variables

### Backend → `.env`

```env
PORT=5000
MONGO_URL=your_mongo_connection_string
JWT_SECRET=your_secret_key
CLOUD_NAME=your_cloudinary_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret
```

### Frontend → `.env.production`

```env
VITE_API_URL=https://life-blog-backend.onrender.com/api
```

---

## 🔗 API Routes

### Authentication Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/signup` | Register new user |
| `POST` | `/api/auth/login` | Login user |

### Blog Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/blogs` | Create blog |
| `GET` | `/api/blogs` | Get all blogs |
| `GET` | `/api/blogs/:id` | Get a blog by ID |
| `PUT` | `/api/blogs/:id` | Update blog |
| `DELETE` | `/api/blogs/:id` | Delete blog |

### Upload Route

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/upload/image` | Upload image to Cloudinary |

### Contact Route

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/contact` | Send contact message |

---

## ▶️ How to Run Locally

### Clone Repo

```bash
git clone https://github.com/yourusername/life_blog.git
cd life_blog
```

### Backend Setup

```bash
cd backend
npm install
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Deployment Steps

### Frontend (Vercel)

1. Import GitHub repository
2. Add environment variable:
   ```
   VITE_API_URL=https://life-blog-backend.onrender.com/api
   ```
3. Deploy

### Backend (Render)

1. Create "Web Service"
2. Connect GitHub repo
3. Add `.env` variables
4. Deploy

---

## ⭐ Future Enhancements

- Rich text editor (Quill.js / TipTap)
- Blog categories + filters
- Admin dashboard
- Email verification system
- Dark Mode
- Bookmark blogs

---

## 👨‍💻 Author

**Rishikesh Kumar**  
*Full-Stack Developer*

---

⭐ **If you like this project, consider starring the repository.**

---

## 📜 License

This project is licensed under the MIT License.
