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
## 🚦 PM2 Process Commands

```bash
pm2 list                # View running apps
pm2 start index.js --name testapi   # Start backend
pm2 stop testapi        # Stop backend
pm2 logs testapi        # View logs
pm2 save                # Save processes on reboot
pm2 startup             # Generate startup script
```
## 📸 Screenshots
### ✅ PM2 Process List
![PM2 Screenshot frontend](https://github.com/Shubhamj1998/project/blob/3c92e668a7477784fb401c86c67e174d58a72185/Screenshot%201.png)
![PM2 Screenshot backend](https://github.com/Shubhamj1998/project/blob/3c92e668a7477784fb401c86c67e174d58a72185/Screenshot%202.png)

### ✅ Frontend Working
![Frontend Screenshot](https://github.com/Shubhamj1998/project/blob/3c92e668a7477784fb401c86c67e174d58a72185/Screenshot%203.png)


## 📸 Jenkins CICD

# Declarative pipeline script
```groovy
pipeline {
  agent any

  stages {

    stage('Clone') {
      steps {
        // ✅ Clone from the main branch
        git branch: 'main', url: 'https://github.com/Shubhamj1998/project.git'
      }
    }

    stage('Build') {
      steps {
        sh '''
          echo "📦 Building frontend..."
          cd frontend
          npm install
          npm run build   # Output is in frontend/build

          echo "📦 Setting up backend..."
          cd ../backend
          npm install
        '''
      }
    }

    stage('Deploy') {
    steps {
    sshagent(['ec2-ssh-key']) {
      sh '''
        echo "🚀 Uploading frontend build to EC2 temporary directory"
        ssh -o StrictHostKeyChecking=no ubuntu@54.211.11.10 'mkdir -p /home/ubuntu/tmp-frontend'
        scp -o StrictHostKeyChecking=no -r frontend/build/* ubuntu@54.211.11.10:/home/ubuntu/tmp-frontend/

        echo "📂 Moving frontend files to /var/www/testapp/ using sudo"
        ssh -o StrictHostKeyChecking=no ubuntu@54.211.11.10 'sudo cp -r /home/ubuntu/tmp-frontend/* /var/www/testapp/'

        echo "🚀 Uploading backend code to EC2"
        ssh -o StrictHostKeyChecking=no ubuntu@54.211.11.10 'mkdir -p /home/ubuntu/project/backend'
        scp -o StrictHostKeyChecking=no -r backend/* ubuntu@54.211.11.10:/home/ubuntu/project/backend/

        echo "🔁 Restarting backend using PM2"
        ssh -o StrictHostKeyChecking=no ubuntu@54.211.11.10 '
          cd /home/ubuntu/project/backend
          npm install
          pm2 restart backend || pm2 start index.js --name backend
          pm2 save
        '
      '''
    }  } } } }

   ```
 
## 📸 Jenkins CICD Screenshot
![Sinmple Jenkins CICD](https://github.com/Shubhamj1998/project/blob/4af349b3645be8b047c067f88c143647e1f3eca6/Screenshot%204.png)
