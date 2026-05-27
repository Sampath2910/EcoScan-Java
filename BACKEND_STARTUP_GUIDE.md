# Backend Startup Guide

## 🚀 Quick Start

### Option 1: Using Batch Script (Recommended for Windows)
```bash
# Double-click or run:
./start-backend.bat
```

### Option 2: Using PowerShell Script
```powershell
# In PowerShell:
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
./start-backend.ps1
```

### Option 3: Manual Command (All Platforms)

**Using a `.env` file (Recommended):**
Create a `.env` file in the root folder with:
```properties
DATABASE_URL=jdbc:mysql://localhost:3306/ecoscan_db
DATABASE_USER=root
DATABASE_PASSWORD=your_mysql_password
```
The startup scripts (`start-backend.ps1`/`start-backend.bat`) will automatically load these variables.

**Or set manually before running:**

**Windows Command Prompt:**
```cmd
set DATABASE_URL=jdbc:mysql://localhost:3306/ecoscan_db
set DATABASE_USER=root
set DATABASE_PASSWORD=your_password
cd backend
mvn spring-boot:run
```

**Windows PowerShell:**
```powershell
$env:DATABASE_URL="jdbc:mysql://localhost:3306/ecoscan_db"
$env:DATABASE_USER="root"
$env:DATABASE_PASSWORD="your_password"
cd backend
mvn spring-boot:run
```

**Linux/Mac (Bash):**
```bash
export DATABASE_URL=jdbc:mysql://localhost:3306/ecoscan_db
export DATABASE_USER=root
export DATABASE_PASSWORD=your_password
cd backend
mvn spring-boot:run
```

---

## ✅ Expected Output

When the backend starts successfully, you should see:

```
2026-05-22T17:00:59.206+05:30  INFO 7092 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat started on port 8080 (http) with context path '/api'
2026-05-22T17:00:59.213+05:30  INFO 7092 --- [           main] com.ecoscan.EcoScanApplication           : Started EcoScanApplication in 9.149 seconds
```

The backend will be available at: **http://localhost:8080/api**

---

## ⚠️ Common Issues & Solutions

### Issue 1: "Access denied for user 'root'@'localhost' (using password: NO)"

**Cause**: Environment variables are not set.

**Solution**: Make sure to set environment variables BEFORE running `mvn spring-boot:run`.

### Issue 2: "Connection refused" / "Can't connect to MySQL server"

**Cause**: MySQL is not running or not listening on port 3306.

**Solution**:
1. Make sure MySQL is installed and running
2. Check MySQL port: `netstat -an | findstr 3306` (Windows)
3. Start MySQL service if stopped

### Issue 3: Wrong database or password

**Solution**:
1. Verify MySQL credentials are correct
2. Update `DATABASE_PASSWORD` in the startup script
3. Create the database if it doesn't exist:
   ```sql
   CREATE DATABASE ecoscan_db;
   ```

### Issue 4: Port 8080 already in use

**Solution**: Either:
- Stop the other application using port 8080
- Or change the port in `application.properties`:
  ```properties
  server.port=8081
  ```

---

## 🔧 Configuration

### Environment Variables

The following environment variables can be set:

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `jdbc:mysql://localhost:3306/ecoscan_db` | MySQL connection URL |
| `DATABASE_USER` | `root` | MySQL username |
| `DATABASE_PASSWORD` | (empty) | MySQL password |
| `SERVER_PORT` | `8080` | Backend server port |
| `SERVER_SERVLET_CONTEXT_PATH` | `/api` | API context path |

---

## 🧪 Testing the Backend

Once started, test if the backend is working:

### Using Browser
```
http://localhost:8080/api/auth/me
```

You should get a 401 (Unauthorized) response if not logged in - this is normal.

### Using cURL
```bash
curl -X GET http://localhost:8080/api/auth/me
```

### Using VS Code REST Client
Create a file `test.http`:
```http
GET http://localhost:8080/api/auth/me
```

---

## 📝 Updating Credentials

To change MySQL password in the future:

1. **Update the startup script:**
   - Edit `start-backend.bat` or `start-backend.ps1`
   - Change the `DATABASE_PASSWORD` value

2. **Or set environment variable permanently (Windows):**
   ```cmd
   setx DATABASE_PASSWORD "your_new_password"
   ```

---

## 🚀 Next Steps

1. Start the backend using one of the methods above
2. In another terminal, start the frontend: `cd frontend && npm run dev`
3. Open http://localhost:5174 in your browser
4. The frontend will proxy API requests to http://localhost:8080/api

---

## 📚 Logs & Debugging

To see more detailed logs:
```bash
mvn spring-boot:run -Dspring-boot.run.arguments="--debug"
```

To see compilation warnings:
```bash
mvn clean compile
```

---

**Last Updated**: May 22, 2026
