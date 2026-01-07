# 🎨 CampusPulse - Frontend (React UI)

The modern, premium, and responsive user interface for students and administrators of the Hostel Management System.

---

## 🛠 Prerequisites
- **Node.js** (v18 or higher)
- **NPM**

## ⚙️ Environment Configuration

Create a `.env` file in the `frontend/` root directory.

### 🔌 API Connection `.env`
```env
# Point this to your backend server
REACT_APP_API_URL=http://localhost:5000/api
```

*Note: In production hosting (like Vercel or Netlify), ensure you add this variable to the platform's Environment Variables settings.*

## 🏃‍♂️ Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm start
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## ✨ Key Features
- **Dashboard V2**: Unified design language across all administrative roles.
- **Mess Manager**: Grid-based weekly menu designer with automatic student notifications.
- **Meal Preference**: interactive daily Veg/Non-Veg selector for students.
- **Complaint Tracking**: Status-driven management with anonymity protection.
- **Admin Analytics**: Real-time headcounts and sentiment analysis for complaints.

## 🛠 Technology Stack
- **Framework**: React.js
- **State Management**: Redux Toolkit (with Persistence)
- **Styling**: SCSS (Modern dashboard utility classes)
- **Icons**: React-Icons (Feather/Fi set)
- **Networking**: Axios (with centralized request interceptors)

## 📁 Directory Structure
- `src/components`: Reusable UI modules (Schedules, Complaints, Layouts).
- `src/pages`: role-based dashboard views and authentication pages.
- `src/store`: Redux slices, selectors, and API base configurations.
- `src/assets`: Global SCSS tokens and design variables.
