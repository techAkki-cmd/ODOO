# 🏥 SkillSwap – Exchange knowledge, not money. Grow by sharing your skills🚀

The **Skill Swap** Platform is a peer-to-peer web application that allows users to offer their skills and request skills from others in return — all without the need for money. Designed to promote collaborative learning, this platform helps individuals connect, share expertise, and grow together by exchanging time and knowledge.

---
## 👥 Team Details
 
**Team Members:**
- Arman 
- Ayush Rai  
- Arijit Kumar  
- Mohd Asheer


## 📚 Table of Contents
- [✨ Features](#-features)
- [📦 Project Structure](#-project-structure)
- [🛠 Technologies Used](#-technologies-used)
- [🚀 Installation](#-installation)
- [🕹 Usage Guide](#-usage-guide)
- [📢 API Endpoints (Backend)](#-api-endpoints-backend)
- [🤝 Contributing](#-contributing)
- [📄 Motivation](#-motivation)

---

## ✨ Features

### 👤 User Profile
- Add basic information: name, location (optional), profile photo (optional)
- List skills you can **offer** and skills you **want to learn**
- Set your availability (e.g., weekends, evenings)
- Choose to make your profile **public or private**

### 🔍 Skill Discovery
- Browse or search other users by skill (e.g., "Photoshop", "Excel")
- Filter users based on availability or skill category
- View detailed user profiles with skill match suggestions

### 🔄 Swap Requests
- Send skill swap offers to other users
- Accept or reject incoming swap requests
- View all **pending**, **current**, and **completed** swaps
- Option to **delete** unaccepted swap requests

### ⭐ Ratings & Feedback
- Rate users and leave feedback after a skill exchange
- Helps build a **trusted and reliable** community

### 🔔 Notifications *(Optional/Enhancement)*
- Get notified when:
  - Someone sends you a swap request
  - Your request is accepted or rejected
  - Someone rates or gives feedback on your swap

### 🛠️ Admin Controls
- Reject inappropriate or spam skill listings
- Ban users who violate community policies
- Monitor platform stats: swaps, ratings, feedback logs
- Send platform-wide alerts or announcements

---

## 📦 Project Structure
```
skill-swap/
├── 📁 backend/
│ ├── 📁 .mvn/
│ │ └── 📄 maven-wrapper.properties
│ ├── 📁 src/
│ │ └── 📁 main/
│ │ ├── 📁 java/com/hackathon/backend/
│ │ │ ├── 📁 controller/
│ │ │ ├── 📁 dto/
│ │ │ ├── 📁 entity/  
│ │ │ ├── 📁 repository/ 
│ │ │ ├── 📁 security/ 
│ │ │ ├── 📁 service/ # Business logic/
│ │ │ └── 📄 BackendApplication.java 
│ │ └── 📁 resources/
│ │ └── 📄 application.properties 
│ ├── 📁 test/java/com/hackathon/backend/ 
│ ├── 📄 .gitattributes
│ ├── 📄 .gitignore
│ ├── 📄 mvnw
│ ├── 📄 mvnw.cmd
│
├── 📁 frontend/
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📁 Auth/
│   │   │   └── 📁 ui/
│   │   ├── 📁 pages/
│   │   │   ├── Home.js/
│   │   │   ├── Landing.js/
│   │   │   ├── profile.js/
│   │   │   ├── Request.js/
│   │   │   ├── SkillSwap.js/
│   │   │   └── SwapRequest.js/
│   │   ├── 📁 services/
│   │   │   └──  api.js/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   └── index.html
└── README.md
```

---

## 🛠 Technologies Used

### 🔧 Backend
- PostgreSQL
- Spring Boot
- JWT Authentication
- Spring MVC

### 🎨 Frontend & Admin Panel
- React.js
- Tailwind CSS 
- React Router DOM
- Axios
- lucide-react
- react-toastify
- framer-motion

---

## 🚀 Installation

### 🔧 1. Clone the Repository
```bash
git clone https://github.com/techAkki-cmd/ODOO.git
cd ODOO
```
### ⚙️ 2. Backend Setup (inside /server)
```bash
cd backend
npm install
```
Create a .env file and add:
```bash
MONGODB_URI = ''
CLOUDINARY_NAME = ''
CLOUDINARY_API_KEY = ''
CLOUDINARY_SECRET_KEY = '' 
ADMIN_EMAIL = ''
ADMIN_PASSWORD = ''
JWT_SECRET = ''

```
Start the backend server:
```bash
./mvnw spring-boot:run
```
### 💻 3. Frontend Setup (inside /client)
```bash
cd ../frontend
npm install
```
Start the frontend:
```bash
npm run start
```

## 🧑‍🏫 Usage Guide

Follow these steps to start swapping skills with others:

### 1️⃣ Sign Up / Log In
- Go to the homepage and click on **"Sign Up"** to create an account.
- Already have an account? Click on **"Log In"** to access your dashboard.

### 2️⃣ Create Your Profile
- Add your name and a profile picture (optional).
- Enter your **location** (optional) and set your **availability** (weekends, evenings, etc.).
- List your **Skills Offered** (what you can teach) and **Skills Wanted** (what you want to learn).

### 3️⃣ Explore Other Users
- Use the **Search** bar to look for skills you're interested in (e.g., “Guitar”, “Python”).
- Filter users by skill or availability.
- Click on a profile to view detailed info about their skills.

### 4️⃣ Send a Swap Request
- Found someone with a matching skill? Click **“Send Swap Request”** on their profile.
- Add a note or preferred time if needed.
- The request will appear in your **Pending Swaps** section.

### 5️⃣ Accept or Reject Requests
- Go to the **Swap Requests** section to manage incoming and outgoing requests.
- Accept or reject requests based on your preference.
- Once accepted, both users can connect and start the exchange.

### 6️⃣ Complete the Swap & Rate
- After the session, go to the **Completed Swaps** section.
- Leave a **rating** and write a short **feedback** for the other user.
- This helps build trust and improve the community.

### 🔐 Admin Controls (For Admin Users Only)
- Moderate user profiles and skill listings.
- Ban users violating platform policies.
- Monitor activity and send announcements.

---

### ✅ Quick Tips
- Use real and relevant skills to get meaningful swaps.
- Be respectful and professional during sessions.
- Keep your availability updated.

---

## 🏠 API Endpoints

These APIs handle user discovery, filtering, and skill search functionality.

| Method | Endpoint                              | Description                     | Usage                          |
|--------|----------------------------------------|----------------------------------|---------------------------------|
| GET    | `/api/home/dashboard`                 | User's dashboard data            | Get user profile + stats       |
| GET    | `/api/home/discover`                  | Browse all available users       | View public user profiles      |
| GET    | `/api/home/discover?skill=photoshop`  | Search users by skill            | Filter users by skill tag      |
| GET    | `/api/home/discover?location=mumbai`  | Filter users by location         | Find local skill partners      |
| GET    | `/api/home/skills/search?q=design`    | Search available skills          | Show suggestions/autocomplete  |


📌 More endpoints available in API documentation.

---

## 🤝 Contributing

We welcome contributions to improve **SkillSwap**!

### 🧩 How to Contribute

#### 1. Fork the Repository  
   Click the **Fork** button on the top right of this page.

#### 2. Clone Your Fork 
   Open terminal and run:
   ```bash
   git clone https://github.com/yourusername/ODOO.git
   cd ODOO
   ```

#### 3. Create a feature branch:
   Use a clear naming convention:
   ```bash
   git checkout -b feature/new-feature
   ```
   
#### 4. Make & Commit Your Changes
   Write clean, documented code and commit:
   ```bash
   git add .
   git commit -m "✨ Added: your change description"
   ```
   
#### 5. Push to GitHub & Submit PR
   ```bash
   git push origin feature/your-feature-name
   ```
#### 6. Then go to your forked repo on GitHub and open a Pull Request.

---

## ⭐ Motivation

> 💡**PS:** If you found this project helpful or inspiring, please **[⭐ star the repository](https://github.com/techAkki-cmd/ODOO)** — it keeps me motivated to build and share more awesome projects like this one!
---