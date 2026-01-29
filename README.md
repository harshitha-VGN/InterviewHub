# 🎯 InterviewHub

> A community-driven platform empowering professionals and students to share, explore, and learn from real interview experiences.

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.11-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

---

## 📖 About The Project

**InterviewHub** is a full-stack web application designed to bridge the gap between job seekers and real-world interview experiences. The platform allows users to:

- 📝 **Share Interview Experiences** - Contribute your journey to help others
- 🔍 **Explore Community Insights** - Learn from others who've been there
- 🤖 **AI-Powered Resume Analyzer** - Get intelligent resume improvements powered by Google Gemini AI
- 👤 **User Profiles** - Track your contributions and build your presence in the community
- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing

---

### 🌟 Core Features

#### 1. **Interview Experience Sharing**
- Users can submit detailed interview experiences including:
  - Company name
  - Role applied for
  - Detailed experience breakdown
- Community-driven knowledge base

#### 2. **Experience Exploration**
- Browse through real interview experiences from various companies
- Filter and search functionality
- Learn from peers' successes and challenges

#### 3. **AI Resume Analyzer** 🤖
The crown jewel of InterviewHub - an intelligent resume enhancement system featuring:

- **PDF Resume Upload** - Upload your resume in PDF format
- **AI-Powered Analysis** - Leverages Google Gemini 1.5 Flash for intelligent content improvement
- **Job Description Tailoring** - Customizes your resume based on specific job descriptions
- **STAR Method Application** - Automatically rewrites experiences using Situation-Task-Action-Result framework
- **Quantified Achievements** - Adds realistic metrics to demonstrate impact
- **Professional Formatting** - Generates a beautifully formatted PDF with:
  - Clean, ATS-friendly design
  - Professional typography (Lato font)
  - Embedded SVG icons for contact information
  - Structured sections (Summary, Education, Projects, Skills, Achievements)
- **Link Preservation** - Intelligently extracts and preserves GitHub, LinkedIn, and LeetCode profiles

#### 4. **User Dashboard**
- Personalized dashboard with quick actions
- View your contributions
- Track your community impact

#### 5. **Profile Management**
- Update user information
- View contribution history
- Customize bio

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.1.0 | UI framework for building interactive components |
| **Vite** | 7.0.4 | Lightning-fast build tool and dev server |
| **TailwindCSS** | 4.1.11 | Utility-first CSS framework for modern styling |
| **React Router** | 7.7.1 | Client-side routing |
| **Axios** | 1.11.0 | HTTP client for API requests |
| **Heroicons** | 2.2.0 | Beautiful SVG icons |
| **File Saver** | 2.0.5 | Client-side file download functionality |

### **Backend**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | - | JavaScript runtime |
| **Express** | 5.1.0 | Web application framework |
| **MongoDB** | - | NoSQL database for storing user data and experiences |
| **Mongoose** | 8.17.0 | MongoDB object modeling |
| **JWT** | 9.0.2 | JSON Web Tokens for authentication |
| **bcryptjs** | 3.0.2 | Password hashing and security |

### **AI & Document Processing**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Google Gemini AI** | 0.24.1 | AI-powered resume analysis and improvement |
| **Puppeteer** | 24.16.1 | Headless browser for PDF generation |
| **pdf-parse** | 1.1.1 | PDF text extraction |
| **Multer** | 2.0.2 | File upload handling |
| **JSON5** | 2.2.3 | Robust JSON parsing |

### **Development Tools**
- **Concurrently** - Run multiple npm scripts simultaneously
- **Nodemon** - Auto-restart server on file changes
- **ESLint** - Code quality and consistency
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

---

## 📁 Project Structure

```
interviewhub/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Toast.jsx
│   │   │   └── editprofile.jsx
│   │   ├── pages/            # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── dashboard.jsx
│   │   │   ├── explore.jsx
│   │   │   ├── submitexperience.jsx
│   │   │   ├── MyContributions.jsx
│   │   │   ├── profile.jsx
│   │   │   ├── authentication.jsx
│   │   │   ├── ResumeAnalyzerPage.jsx
│   │   │   └── ResumeUploader.jsx
│   │   ├── App.jsx           # Main application component
│   │   └── main.jsx          # Application entry point
│   └── package.json
│
├── server/                    # Backend Node.js application
│   ├── config/
│   │   └── db.js             # MongoDB connection configuration
│   ├── databases/            # MongoDB schemas
│   │   ├── User.js           # User model with password hashing
│   │   └── experienceModel.js # Interview experience model
│   ├── routes/               # API route handlers
│   │   ├── userRoutes.js     # User profile endpoints
│   │   ├── experienceRoute.js # Experience CRUD operations
│   │   └── resumeRoutes.js   # AI resume analysis and PDF generation
│   ├── middleware/           # Custom middleware (auth, etc.)
│   ├── server.js             # Express server configuration
│   └── package.json
│
└── package.json              # Root package for running both concurrently
```

---

## 🎨 Design Highlights

### Modern, Premium UI/UX
- **Glassmorphism Effects** - Backdrop blur with translucent backgrounds
- **Gradient Accents** - Vibrant indigo-to-gray gradients
- **Smooth Animations** - Hover effects and transitions for enhanced UX
- **Responsive Design** - Mobile-first approach with Tailwind breakpoints
- **Background Imagery** - Full-screen background with Unsplash integration
- **Custom Icons** - Heroicons for consistent, beautiful iconography

### Professional Resume Output
- **ATS-Friendly** - Optimized for Applicant Tracking Systems
- **Clean Typography** - Google Fonts (Lato) for professional appearance
- **Embedded SVG Icons** - Location, phone, email, GitHub icons
- **Structured Layout** - Letter-size (8.5" x 11") format
- **Highlighted Sections** - Clear visual hierarchy with borders and spacing

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=5050
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/hansikareddy29/interviewhub.git
cd interviewhub
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
cd ..
```

3. **Start the application**
```bash
# From the root directory, run both frontend and backend
npm run dev
```

The application will be available at:
- **Frontend**: `http://localhost:5173` (Vite default)
- **Backend**: `http://localhost:5050`

---

## 📱 Usage

### For Job Seekers

1. **Register/Login** - Create an account to get started
2. **Explore Experiences** - Browse through community-shared interview experiences
3. **Share Your Journey** - Submit your own interview experience to help others
4. **Analyze Resume** - Upload your resume and job description for AI-powered improvements

### For Contributors

1. **Submit Experience** - Share detailed interview experiences with the community
2. **Track Contributions** - View all your submitted experiences in "My Contributions"

---


## 📄 License

This project is licensed under the ISC License.

---


