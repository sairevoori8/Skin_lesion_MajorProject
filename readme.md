
#  Skin Lesion Classification – Derma

A full-stack deep-learning web application for skin lesion classification using a CNN and Grad-CAM visualization.  
The system predicts lesion types (e.g., melanoma, nevus, basal cell carcinoma) from uploaded dermoscopic images.

---

## Tech Stack

**Frontend:** React (Vite) · Tailwind CSS · Axios  
**Backend:** Flask · TensorFlow/Keras · Gunicorn · OpenCV · NumPy  
**Server:** Ubuntu (AWS EC2) · NGINX · Certbot (HTTPS)  
**Automation:** Bash deploy script

---

##  Project Structure

```

Skin_lesion_MajorProject/
├── backend/
│   ├── app.py
│   ├── model.keras
│   ├── venv/
│   └── gunicorn.log
├── frontend/
│   ├── src/
│   ├── dist/
│   ├── package.json
│   └── vite.config.js
├── deploy.sh
└── README.md

````

---

##  Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
````

### Development Mode

```bash
python app.py
```

### Production Mode (Gunicorn)

```bash
gunicorn --bind 127.0.0.1:2000 app:app
```

---

##  Frontend Setup

```bash
cd frontend
npm install
npm run dev          # Run in development mode
npm run build        # Build production output (dist/)
```

---

##  One-Click Deployment

```bash
chmod +x deploy.sh
./deploy.sh
```

### Script Actions

1. Pull latest Git changes
2. Build React/Vite frontend (outputs to `dist/`)
3. Copy `dist` → `/var/www/html`
4. Restart Gunicorn backend (port 2000)
5. Restart NGINX

---

##  NGINX Configuration

**File:** `/etc/nginx/sites-available/default`

```nginx
server {
    listen 80;
    server_name derma.run.place www.derma.run.place;

    root /var/www/html;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /predict {
        proxy_pass http://127.0.0.1:2000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Apply changes:**

```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

##  Enable HTTPS (Optional)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d derma.run.place -d www.derma.run.place
sudo systemctl reload nginx
```

---

##  Model Overview

* Model: Custom CNN trained with Keras/TensorFlow
* Input size: 71×71
* Classes: `['nv', 'mel', 'bkl', 'bcc', 'akiec', 'vasc', 'df']`
* Output: Predicted label + confidence
* Grad-CAM: Visual heatmap for interpretability

---

##  API Endpoints

| Route      | Method | Description                                         |
| ---------- | ------ | --------------------------------------------------- |
| `/predict` | POST   | Upload image → returns predicted class + confidence |
| `/gradcam` | POST   | Returns Grad-CAM heatmap                            |

**Example:**

```bash
curl -X POST -F "file=@example.jpg" http://derma.run.place/predict
```

---

##  Deployment Overview

| Component        | Port          | Purpose          |
| ---------------- | ------------- | ---------------- |
| Flask (Gunicorn) | 2000          | Backend API      |
| NGINX            | 80 / 443      | Frontend + Proxy |
| React Build      | /var/www/html | Static files     |

---

##  Troubleshooting

**Check backend (Gunicorn):**

```bash
ps aux | grep gunicorn
sudo lsof -i :2000
```

**Check NGINX:**

```bash
sudo systemctl status nginx
sudo tail -n 30 /var/log/nginx/error.log
```

**Restart services:**

```bash
sudo systemctl restart nginx
sudo fuser -k 2000/tcp
```

**Test backend directly:**

```bash
curl http://127.0.0.1:2000/predict
```

