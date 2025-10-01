## 🌟 Overview

BiteTok is a social media platform where food lovers can discover, share, and interact with mouth-watering food videos. Whether you're a home cook sharing your latest creation or a restaurant showcasing your signature dishes, BiteTok provides the perfect platform to connect with food enthusiasts worldwide.

## ✨ Key Features

### 👥 For Food Enthusiasts
- 🎬 **Vertical Video Feed**: Seamless scrolling experience with auto-play videos
- ❤️ **Interactive Actions**: Like, save, and share your favorite food content
- 🔍 **Discover**: Explore diverse cuisines and cooking styles
- 👤 **User Profiles**: Create and manage your personal food journey
- 🔐 **Secure Authentication**: Safe and reliable user registration

### 🏪 For Food Partners & Restaurants
- 📹 **Content Creation**: Upload and showcase your culinary masterpieces
- 📊 **Analytics**: Track engagement with likes and saves
- 📞 **Direct Contact**: Connect with customers through integrated contact info
- 🏷️ **Brand Presence**: Build your restaurant's digital presence
- 📱 **Mobile-First**: Optimized for mobile viewing and interaction

## 🛠️ Tech Stack

### 🔧 Backend Technologies
| Technology | Purpose | Version |
|------------|---------|---------|
| **Node.js** | Runtime environment | 18+ |
| **Express.js** | Web framework | 5.1.0 |
| **MongoDB** | Database | Latest |
| **Mongoose** | ODM for MongoDB | 8.17.1 |
| **JWT** | Authentication | 9.0.2 |
| **ImageKit** | Media storage & CDN | 6.0.0 |
| **Multer** | File upload handling | 2.0.2 |
| **bcryptjs** | Password hashing | 3.0.2 |

### 🎨 Frontend Technologies
| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI library | 19.1.1 |
| **Vite** | Build tool & dev server | 7.1.2 |
| **React Router** | Client-side routing | 7.8.0 |
| **Axios** | HTTP client | 1.11.0 |
| **CSS3** | Styling & animations | Latest |

## 📁 Project Structure

```
🍽️ BiteTok/
├── 📂 Backend/                    # Node.js/Express API server
│   ├── 📂 src/
│   │   ├── 📂 controllers/        # 🎮 API route handlers
│   │   │   ├── auth.controller.js
│   │   │   └── food.controller.js
│   │   ├── 📂 models/            # 🗄️ MongoDB schemas
│   │   │   ├── user.model.js
│   │   │   ├── food.model.js
│   │   │   └── foodpartner.model.js
│   │   ├── 📂 routes/            # 🛣️ Express routes
│   │   │   ├── auth.routes.js
│   │   │   └── food.routes.js
│   │   ├── 📂 middlewares/       # 🔐 Authentication middleware
│   │   │   └── auth.middleware.js
│   │   ├── 📂 services/          # ☁️ External services
│   │   │   └── storage.service.js
│   │   └── 📂 db/               # 🗃️ Database connection
│   │       └── db.js
│   ├── package.json
│   └── server.js                 # 🚀 Server entry point
├── 📂 frontend/                  # React/Vite client application
│   ├── 📂 src/
│   │   ├── 📂 pages/            # 📄 Page components
│   │   │   ├── 📂 general/      # General user pages
│   │   │   │   └── home.jsx     # Main video feed
│   │   │   ├── 📂 food-partner/ # Food partner pages
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── createfoodpartner.jsx
│   │   │   │   ├── foodpartnerhome.jsx
│   │   │   │   ├── profile.jsx
│   │   │   │   └── AllPartners.jsx
│   │   │   ├── UserLogin.jsx
│   │   │   ├── UserRegister.jsx
│   │   │   ├── PartnerLogin.jsx
│   │   │   └── PartnerRegister.jsx
│   │   ├── 📂 routes/           # 🧭 Route configuration
│   │   │   └── AppRoutes.jsx
│   │   ├── 📂 contexts/         # 🔄 React contexts
│   │   │   └── ThemeContext.jsx
│   │   ├── 📂 styles/           # 🎨 CSS files
│   │   │   └── theme.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── 📂 public/               # 🎥 Static assets
│   │   └── 📂 videos/           # Sample video files
│   │       ├── 📂 horizontal/   # Landscape videos
│   │       └── 📂 vertical/     # Portrait videos
│   ├── package.json
│   └── index.html
└── README.md
```

## 🚀 Quick Start

### 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local or Atlas) - [Get started here](https://www.mongodb.com/)
- **ImageKit Account** (for media storage) - [Sign up here](https://imagekit.io/)

### ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harshitt23/BiteTok.git
   cd BiteTok
   ```

2. **Install backend dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   
   Create a `.env` file in the `Backend/` directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/bitetok
   
   # Authentication
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # ImageKit Configuration
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
   ```

### 🎯 Running the Application

**Option 1: Run both servers separately**

1. **Start the backend server**
   ```bash
   cd Backend
   npm start
   ```
   🌐 Backend will be available at: `http://localhost:3000`

2. **Start the frontend development server** (in a new terminal)
   ```bash
   cd frontend
   npm run dev
   ```
   🎨 Frontend will be available at: `http://localhost:5173`

**Option 2: Use concurrently (recommended)**
```bash
# Install concurrently globally
npm install -g concurrently

# Run both servers simultaneously
concurrently "cd Backend && npm start" "cd frontend && npm run dev"
```

## 🔌 API Documentation

### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/api/auth/user/register` | Register new user account | ❌ |
| `POST` | `/api/auth/user/login` | User login | ❌ |
| `POST` | `/api/auth/food-partner/register` | Register food partner account | ❌ |
| `POST` | `/api/auth/food-partner/login` | Food partner login | ❌ |

### 🍽️ Food Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/food` | Get all food videos | ❌ |
| `POST` | `/api/food` | Create new food video | ✅ |
| `PUT` | `/api/food/:id/like` | Like/unlike a video | ✅ |
| `PUT` | `/api/food/:id/save` | Save/unsave a video | ✅ |

### 🏪 Food Partner Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/api/food-partner/:id` | Get food partner profile | ❌ |
| `PUT` | `/api/food-partner/:id` | Update food partner profile | ✅ |

### 📝 Example API Usage

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Harshit Sharma",
    "email": "harshit@gmail.com",
    "password": "securepassword123"
  }'
```

**Get all food videos:**
```bash
curl -X GET http://localhost:3000/api/food
```

## 🗄️ Database Schema

### 👤 User Model
```javascript
{
  fullName: String,     // User's full name (required)
  email: String,        // Unique email address (required)
  password: String,     // Hashed password (required)
  createdAt: Date,      // Account creation timestamp
  updatedAt: Date       // Last update timestamp
}
```

### 🏪 Food Partner Model
```javascript
{
  name: String,         // Business/restaurant name (required)
  contactName: String,  // Contact person name (required)
  phone: String,        // Phone number (required)
  address: String,      // Business address (required)
  email: String,        // Unique email address (required)
  password: String      // Hashed password (required)
}
```

### 🍽️ Food Model
```javascript
{
  name: String,         // Food item name (required)
  videoUrl: String,     // Video URL from ImageKit (required)
  description: String,  // Food description (optional)
  foodPartner: ObjectId, // Reference to FoodPartner (required)
  likeCount: Number,    // Number of likes (default: 0)
  savesCount: Number    // Number of saves (default: 0)
}
```

## 🎯 Features in Detail

### 🎬 Video Feed System
- **Vertical Scrolling**: TikTok/Instagram Reels-style interface
- **Auto-Play**: Videos automatically play when in viewport
- **Touch Gestures**: Swipe navigation for mobile devices
- **Interactive Actions**: Like, save, and comment functionality
- **Responsive Design**: Mobile-first approach with desktop support
- **Performance Optimized**: Lazy loading and efficient rendering

### 🔐 Authentication & Security
- **Dual Account System**: Separate user and food partner accounts
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: bcryptjs hashing with salt rounds
- **Protected Routes**: Middleware-based route protection
- **Session Management**: Secure session handling

### ☁️ Media Management
- **ImageKit Integration**: Professional video storage and CDN
- **File Upload**: Multer-based multipart form handling
- **Video Optimization**: Automatic compression and format conversion
- **Global CDN**: Fast video delivery worldwide
- **Thumbnail Generation**: Automatic preview image creation

### 📱 User Experience
- **Mobile-First Design**: Optimized for mobile devices
- **Dark/Light Theme**: Toggle between themes
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Smooth Animations**: CSS transitions and keyframes

## 🛠️ Development

### 🔧 Backend Development
```bash
# Start development server
npm start

# Install new dependencies
npm install <package-name>

# Check for security vulnerabilities
npm audit
```

### 🎨 Frontend Development
```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint for code quality
npm run lint

# Fix ESLint issues automatically
npm run lint -- --fix
```

### 🧪 Testing
```bash
# Run backend tests (when implemented)
cd Backend && npm test

# Run frontend tests (when implemented)
cd frontend && npm test
```

## 🚀 Deployment

### 🌐 Frontend Deployment (Vercel/Netlify)
```bash
# Build the frontend
cd frontend
npm run build

# Deploy the dist folder to your hosting platform
```

### 🖥️ Backend Deployment (Railway/Heroku)
```bash
# Set environment variables in your hosting platform
# Deploy the Backend folder
```

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### 📝 Contribution Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Use meaningful commit messages

## 🐛 Known Issues

- Video loading optimization for large files
- Mobile touch gesture improvements
- Performance enhancements for video feed

## 🔮 Future Features

- [ ] Real-time comments system
- [ ] Push notifications
- [ ] Advanced search and filtering
- [ ] Social sharing integration
- [ ] Analytics dashboard for food partners
- [ ] Video editing tools
- [ ] Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing frontend framework
- **Express.js** for the robust backend framework
- **MongoDB** for the flexible database solution
- **ImageKit** for the professional media management
- **Vite** for the lightning-fast development experience

## 📞 Contact

**Harshit Sharma**
- GitHub: [@Harshitt23](https://github.com/Harshitt23)
- Email: hasrhitr2308@gmail.com

---

<div align="center">
  <p>⭐ Star this repository if you found it helpful!</p>
  <p>🍽️ Made with ❤️ for food lovers everywhere</p>
</div>