# 🌍 EcoScan - Smart Waste Classification Platform

![EcoScan Logo](frontend/public/images/logo.svg)

**A professional full-stack application for intelligent waste classification using AI/ML, connecting waste segregators with recycling partners.**

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🤖 AI-Powered Waste Classification
- Real-time waste type detection using PyTorch ML model
- Accurate classification of plastic, paper, glass, metal, fabric, and wood
- ML model trained on extensive waste datasets

### 👥 Multi-Role System
- **Users**: Upload waste images and get classification results
- **Recyclers**: Register and manage recycled products
- **Admins**: Monitor platform activity and manage partnerships

### 📊 Dashboard & Analytics
- Real-time waste classification metrics
- Environmental impact tracking
- Partner company statistics
- User activity logs

### 🔄 Recycling Marketplace
- Browse recycled products by category
- Directory of certified recycling partners
- Product impact metrics (CO₂ saved, trees saved, etc.)

### 🔐 Secure Authentication
- User registration and login
- Session-based authentication
- Role-based access control
- Protected routes

### 🎨 Responsive UI
- Professional modern design
- Mobile-optimized interface
- Dark/Light mode support
- Smooth animations and transitions

---

## 💻 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool (fast dev server)
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **CSS3** - Styling (no external frameworks)

### Backend
- **Spring Boot 3.2.5** - Java framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - ORM
- **MySQL 8.0** - Database
- **PyTorch** - ML model for waste classification

### DevOps & Tools
- **Maven** - Dependency management
- **npm/npm** - Frontend dependencies
- **Docker** (optional) - Containerization

---

## 📦 Prerequisites

Before running the application, ensure you have:

### System Requirements
- **Node.js** 16+ (for frontend)
- **Java 17+** (for backend)
- **MySQL 8.0+** (database)
- **Git** (version control)

### Software Installation

```bash
# Check Node.js
node --version  # Should be 16+
npm --version   # Should be 8+

# Check Java
java --version  # Should be 17+
javac --version

# Check Maven
mvn --version   # Should be 3.6+

# Check MySQL
mysql --version # Should be 8.0+
```

---

## 🚀 Installation

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ecoscan.git
cd EcoScan-Java
```

### 2. Create Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE ecoscan_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecoscan_db;
```

### 3. Configure Environment Variables
```bash
# Copy example configuration
cp .env.example .env

# Edit .env with your credentials
nano .env
```

**Or set system environment variables:**
```bash
# Linux/Mac
export DATABASE_URL=jdbc:mysql://localhost:3306/ecoscan_db
export DATABASE_USER=root
export DATABASE_PASSWORD=your_password

# Windows PowerShell
$env:DATABASE_URL="jdbc:mysql://localhost:3306/ecoscan_db"
$env:DATABASE_USER="root"
$env:DATABASE_PASSWORD="your_password"
```

### 4. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 5. Build Backend
```bash
cd backend
mvn clean install
cd ..
```

---

## ⚙️ Configuration

### Database Configuration
Edit `backend/src/main/resources/application.properties`:

```properties
# Uses environment variables (RECOMMENDED)
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${DATABASE_USER}
spring.datasource.password=${DATABASE_PASSWORD}

# Or hardcode for development only:
# spring.datasource.url=jdbc:mysql://localhost:3306/ecoscan_db
# spring.datasource.username=root
# spring.datasource.password=your_password
```

### Frontend API Configuration
Edit `frontend/vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

---

## 🎯 Running the Application

### ⚡ Quick Start

**See [BACKEND_STARTUP_GUIDE.md](BACKEND_STARTUP_GUIDE.md) for detailed backend startup instructions with startup scripts.**

### Terminal 1: Start Backend (Java)

**Option 1: Use startup script (Recommended)**
```bash
# Windows: Double-click or run
./start-backend.bat

# PowerShell: 
./start-backend.ps1
```

**Option 2: Manual command**
```bash
# Windows Command Prompt
set DATABASE_URL=jdbc:mysql://localhost:3306/ecoscan_db
set DATABASE_USER=root
set DATABASE_PASSWORD=your_password
cd backend
mvn spring-boot:run

# Windows PowerShell
$env:DATABASE_URL="jdbc:mysql://localhost:3306/ecoscan_db"
$env:DATABASE_USER="root"
$env:DATABASE_PASSWORD="your_password"
cd backend
mvn spring-boot:run

# Linux/Mac
export DATABASE_URL=jdbc:mysql://localhost:3306/ecoscan_db
export DATABASE_USER=root
export DATABASE_PASSWORD=your_password
cd backend
mvn spring-boot:run
```

Backend will start on `http://localhost:8080/api`

**First-time setup:**
- Spring Boot will automatically create tables via Hibernate
- Check `http://localhost:8080/api/auth/me` in browser (should give 401 if not logged in - that's normal)

### Terminal 2: Start Frontend (React/Vite)
```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:5173`

### Access Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:3306 (MySQL)

---

## 📁 Project Structure

```
EcoScan-Java/
├── backend/                          # Spring Boot Backend
│   ├── src/main/java/com/ecoscan/
│   │   ├── controller/              # REST API endpoints
│   │   ├── service/                 # Business logic
│   │   ├── repository/              # Data access
│   │   ├── model/                   # JPA entities
│   │   ├── dto/                     # Data transfer objects
│   │   ├── config/                  # Spring configuration
│   │   └── EcoScanApplication.java  # Main application
│   ├── src/main/resources/
│   │   └── application.properties    # Backend configuration
│   └── pom.xml                      # Maven dependencies
│
├── frontend/                         # React Frontend
│   ├── src/
│   │   ├── components/              # React components
│   │   │   ├── Logo.jsx             # Professional logo
│   │   │   ├── ErrorBoundary.jsx    # Error handling
│   │   │   ├── Toast.jsx            # Notifications
│   │   │   └── ThemeToggle.jsx      # Dark mode
│   │   ├── pages/                   # Page components
│   │   ├── context/                 # React contexts
│   │   │   ├── AuthContext.jsx      # Authentication
│   │   │   └── ThemeContext.jsx     # Theme management
│   │   ├── api/
│   │   │   └── client.js            # API client
│   │   ├── utils/
│   │   │   ├── validation.js        # Form validation
│   │   │   └── notifications.js     # Toast notifications
│   │   ├── App.jsx                  # Main component
│   │   ├── index.css                # Global styles
│   │   └── main.jsx                 # Entry point
│   ├── vite.config.js               # Vite configuration
│   ├── package.json                 # npm dependencies
│   └── index.html                   # HTML template
│
├── .env.example                     # Environment variables template
├── README.md                        # This file
└── WEBSITE_ANALYSIS_AND_IMPROVEMENTS.md  # Analysis report
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword123"
}

Response:
{
  "data": {
    "id": 1,
    "email": "user@example.com",
    "role": "user",
    "name": "John Doe"
  }
}
```

#### Get Current User
```bash
GET /api/auth/me
Authorization: Session Cookie

Response: User object
```

#### Logout
```bash
POST /api/auth/logout

Response: { "success": true }
```

### Classification Endpoints

#### Upload & Classify
```bash
POST /api/upload
Content-Type: multipart/form-data

file: <image_file>

Response:
{
  "classification": "Plastic",
  "confidence": 0.95,
  "products": ["Recycled Plastic Chairs", "PET Bottles"],
  "impact": "Saved 2.5 kg CO₂"
}
```

### Products Endpoints

#### Get All Products
```bash
GET /api/products

Response: [Product, Product, ...]
```

#### Get Products by Category
```bash
GET /api/products?category=plastic

Response: [Product, ...]
```

---

## 👨‍💻 Development

### Available Scripts

#### Frontend
```bash
# Start development server (Vite)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

#### Backend
```bash
# Run application
mvn spring-boot:run

# Build JAR
mvn clean package

# Run tests
mvn test
```

### Code Style & Best Practices

#### Frontend
- Use functional components with hooks
- Prop validation with PropTypes
- Error boundaries for crash prevention
- Loading states for async operations
- Validation on forms

#### Backend
- REST API conventions
- Proper HTTP status codes
- Input validation
- Error handling
- CORS configuration

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature-name

# Create pull request
```

---

## 🌐 Production Deployment

### Backend Deployment (AWS EC2 Example)

1. **Build Production JAR**
   ```bash
   cd backend
   mvn clean package -DskipTests
   # Creates: target/ecoscan-backend-1.0.0.jar
   ```

2. **Set Environment Variables**
   ```bash
   export DATABASE_URL=your_production_db_url
   export DATABASE_USER=your_db_user
   export DATABASE_PASSWORD=your_secure_password
   ```

3. **Run on Server**
   ```bash
   java -jar ecoscan-backend-1.0.0.jar
   ```

4. **Use PM2 (Node-like process manager for Java)**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start with PM2
   pm2 start "java -jar ecoscan-backend-1.0.0.jar" --name "ecoscan-api"
   ```

### Frontend Deployment (Netlify/Vercel Example)

1. **Build for Production**
   ```bash
   cd frontend
   npm run build
   # Creates: dist/ folder
   ```

2. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Update API URL in Production**
   - Set `REACT_APP_API_URL` to production backend URL
   - Example: `https://api.ecoscan.com`

### Docker Deployment

```dockerfile
# backend/Dockerfile
FROM openjdk:17-slim
COPY target/ecoscan-backend-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as build
COPY . .
RUN npm install && npm run build

FROM nginx:alpine
COPY --from=build dist /usr/share/nginx/html
EXPOSE 80
```

---

## 🆘 Troubleshooting

### Frontend Issues

#### Port 5173 Already in Use
```bash
# Windows: Find process on port 5173
netstat -ano | findstr :5173

# Kill the process
taskkill /PID <PID> /F

# Or use different port
npm run dev -- --port 5174
```

#### Google Fonts Not Loading
- Check internet connection
- Fonts are cached locally as fallback
- Use `sans-serif` fonts as last resort

#### White Blank Screen
1. Check browser console for errors (F12 → Console)
2. Ensure backend is running on 8080
3. Check `/api/auth/me` endpoint in Network tab
4. Clear browser cache (Ctrl+Shift+Delete)

### Backend Issues

#### MySQL Connection Failed
```bash
# Check MySQL is running
mysql -u root -p

# Verify credentials in application.properties
# Check database exists
SHOW DATABASES;
```

#### Port 8080 Already in Use
```bash
# Find process using 8080
lsof -i :8080  # Mac/Linux
netstat -ano | findstr :8080  # Windows

# Kill process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows
```

#### Build Fails
```bash
# Clear Maven cache
rm -rf ~/.m2/repository

# Rebuild
mvn clean install -DskipTests
```

### Database Issues

#### Tables Not Created
```bash
# Manually create schema
mysql -u root -p ecoscan_db < db/schema.sql

# Or let Hibernate create (automatic with ddl-auto=update)
```

#### Data Not Persisting
- Check `spring.jpa.hibernate.ddl-auto=update` is set
- Verify MySQL is running
- Check database credentials

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👨‍💼 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- Portfolio: [your-portfolio.com](https://your-portfolio.com)

---

## 🙏 Acknowledgments

- PyTorch for ML capabilities
- Spring Boot community
- React documentation and community
- Waste classification datasets

---

## 📞 Support

For issues and questions:
1. Check Troubleshooting section
2. Search existing GitHub issues
3. Create new issue with detailed description
4. Contact: support@ecoscan.com

---

## 🗺️ Roadmap

### v1.1 (Next Release)
- [ ] E-commerce integration for product purchases
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] API documentation (Swagger/OpenAPI)

### v2.0 (Future)
- [ ] Blockchain for waste traceability
- [ ] Video waste classification
- [ ] Multi-language support
- [ ] Gamification features

---

**Happy coding! 🚀**

For the latest updates, visit: [GitHub Repository](https://github.com/yourusername/ecoscan)
