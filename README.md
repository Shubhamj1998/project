    # 🚀 Full Stack App Deployment on EC2 with NGINX Reverse Proxy

This project demonstrates a simple full-stack deployment using:
- React frontend
- Node.js + Express backend
- Hosted on a single Ubuntu EC2 instance
- NGINX as a reverse proxy
- PM2 as a process manager

---

## 🧱 Stack Used

| Layer     | Technology           |
|-----------|----------------------|
| Frontend  | React.js             |
| Backend   | Node.js + Express    |
| Server    | Amazon EC2 (Ubuntu)  |
| Web Proxy | NGINX                |
| Process   | PM2                  |
| Optional  | Jenkins (CI/CD)      |

---

## 🌐 URLs

| App      | Temporary Access URL                     |
|----------|------------------------------------------|
| Frontend | http://54.211.11.10                      |
| Backend  | http://54.211.11.10/api (via Host header) |
| Final    | testapp.infinydev.com, testapi.infinydev.com (after DNS mapping)

---

## 📂 Project Structure

project/
├── backend/
│ ├── index.js
│ ├── package.json
├── frontend/
│ ├── public/
│ ├── src/
│ ├── package.json



---


## 🔧 Backend Setup (Node.js + PM2)


```bash
# SSH into EC2
ssh -i <your-key.pem> ubuntu@<EC2_PUBLIC_IP>

# Install Node.js and PM2
sudo apt update
sudo apt install -y nodejs npm
sudo npm install -g pm2

# Navigate to backend folder
cd fullstack-ec2-assignment/backend

# Install dependencies & start app
npm install
pm2 start index.js --name testapi
pm2 save
pm2 startup
```
##⚙️ Frontend Setup (React)

# Navigate to frontend
```sh
cd ../frontend

# Install dependencies
npm install

# Build frontend
npm run build

# Copy to NGINX public directory
sudo mkdir -p /var/www/testapp
sudo cp -r build/* /var/www/testapp/
```
## 🌐 NGINX Configuration

# Create config file
```sh
sudo nano /etc/nginx/sites-available/testapp
```
# Frontend on testapp.infinydev.com (via IP for now)
server {
    listen 80;
    server_name 54.211.11.10;

    root /var/www/testapp;
    index index.html;

    location / {
        try_files $uri /index.html;
    }


# Backend on testapi.infinydev.com (via IP + Host header for now)
server {
    listen 80;
    server_name 54.211.11.10;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }



## Enable site and restart NGINX
```bash
sudo ln -s /etc/nginx/sites-available/testapp /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```
##🚦 PM2 Process Commands

```bash
pm2 list                # View running apps
pm2 start index.js --name testapi   # Start backend
pm2 stop testapi        # Stop backend
pm2 logs testapi        # View logs
pm2 save                # Save processes on reboot
pm2 startup             # Generate startup script
```
##📸 Screenshots


