# 📊 Job Dashboard - Application Tracking System

A modern, intuitive web application for job seekers to manage their job applications efficiently. Track applications through multiple stages (Saved → Applied → Screening → Interview → Offer) with a beautiful Kanban board interface.

## 🎯 Overview

**Job Dashboard** is a comprehensive job application tracking tool that helps job seekers organize, monitor, and manage their job search process. It provides real-time statistics, detailed job cards, and a visual Kanban workflow for better job hunting organization.

---

## 👥 Target Users

### 1. **Active Job Seekers**
- Track multiple job applications across different companies
- Monitor application progress through various stages
- Receive insights on application success rates
- Store company-specific resume versions used for each application

### 2. **Career Changers**
- Organize applications by industry and source
- Track different strategies (LinkedIn, Indeed, Referrals, Company Websites)
- Monitor interview patterns across sectors

### 3. **Corporate Recruiters** (Internal Use)
- Track candidate applications in their database
- Monitor pipeline progress
- Generate application statistics

---

## 🏗️ Project Architecture

### **System Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────┐
│                      Job Dashboard App                       │
│                    (React + TypeScript)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
   ┌────▼────┐   ┌────▼────┐   ┌────▼────┐
   │  UI     │   │ Business │   │ Storage │
   │ Layer   │   │  Logic   │   │ Layer   │
   └────┬────┘   └────┬────┘   └────┬────┘
        │              │             │
   ┌────▼──────────┐   │        ┌────▼──────────┐
   │ Components:   │   │        │ Local Storage │
   │ • KanbanBoard │   │        │ (Browser)     │
   │ • JobCard     │   │        │               │
   │ • AddJobModal │   │        │ Format: JSON  │
   │ • StatsCard   │   │        │               │
   │ • KanbanColumn│   │        └───────────────┘
   └───────┬───────┘   │
           │           │
      ┌────▼───────────▼──────┐
      │   React Hooks & State  │
      │  • useState            │
      │  • useLocalStorage     │
      │  • useMemo             │
      └────────────────────────┘
```

### **Component Hierarchy**

```
App (Root)
├── KanbanBoard
│   ├── KanbanColumn (Saved)
│   ├── KanbanColumn (Applied)
│   ├── KanbanColumn (Screening)
│   ├── KanbanColumn (Interview)
│   ├── KanbanColumn (Offer)
│   ├── KanbanColumn (Rejected)
│   └── KanbanColumn (Withdrawn)
│       └── JobCard (Multiple)
├── AddJobModal
│   └── Job Form (Create/Edit)
├── StatsCard (x4)
└── Search & Filter Bar
```

---

## 🗂️ Project Structure

```
job-board-assistant/
├── src/
│   ├── components/
│   │   ├── KanbanBoard.tsx       # Main board with 7 columns
│   │   ├── KanbanColumn.tsx      # Individual status column
│   │   ├── JobCard.tsx           # Job card display
│   │   ├── AddJobModal.tsx       # Add/Edit form
│   │   └── StatsCard.tsx         # Statistics widget
│   ├── hooks/
│   │   └── useLocalStorage.ts    # Custom storage hook
│   ├── types/
│   │   └── job.ts                # TypeScript interfaces
│   ├── App.tsx                   # Root component
│   ├── App.css                   # App styles
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Global styles
├── public/                       # Static assets
├── index.html                    # HTML template
├── package.json                  # Dependencies
├── vite.config.ts                # Vite config
├── tsconfig.json                 # TypeScript config
├── tailwind.config.cjs           # Tailwind config
└── README.md                      # This file
```

---

## 🔑 Key Features

### 📋 Job Application Tracking
- **7-Stage Pipeline**: Saved → Applied → Screening → Interview → Offer → Rejected → Withdrawn
- **Job Details**: Company, position, location, salary, source, and custom notes
- **Status Tracking**: Visual status badges with color coding

### 📊 Analytics Dashboard
- **Real-time Statistics**:
  - Total jobs tracked
  - Applied count (excludes 'saved')
  - Interview opportunities
  - Offers received
  - Weekly applications

### 🔍 Search & Filter
- Search jobs by company name or position title
- Real-time filtering across all columns
- Filter by application source

### 💾 Data Management
- **Local Storage**: Browser-based persistence (no server required)
- **Full CRUD**: Create, read, update, and delete operations
- **Automatic Timestamps**: Track creation and updates

### 📝 Application Updates
- Track interview rounds and offer updates
- Add timestamped notes for each job
- Monitor job progression timeline

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 19.2.0 | UI framework |
| TypeScript | 5.9.3 | Type safety |
| Vite | 6+ | Build tool |
| Tailwind CSS | 3.4.19 | Styling |
| Lucide React | 0.563.0 | Icons |

---

## 📥 Installation

### Prerequisites
- Node.js 16 or higher
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/nagarjunabhr8/Job_Dashboard.git
   cd job-board-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser

---

## 🚀 Usage

### Adding a Job
1. Click **"+ Add Job"** button
2. Fill in job details:
   - Company Name
   - Job Title
   - Job URL (optional)
   - Source (LinkedIn, Indeed, etc.)
   - Resume Used
   - Status
   - Location & Salary (optional)
   - Notes
3. Click **"Save Job"**

### Managing Jobs
- **View**: Click on a job card to see details
- **Edit**: Click on a job card and update information
- **Delete**: Click the trash icon
- **Search**: Use the search bar to find jobs

### Viewing Statistics
1. Click the **"Stats"** tab
2. View key metrics and trends
3. Analyze application success rates

---

## 📦 Available Scripts

```bash
# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 💾 Data Structure

### Job Object
```typescript
interface Job {
  id: string;              // Unique identifier
  companyName: string;     // Company name
  jobTitle: string;        // Job position
  jobUrl?: string;         // Job posting URL
  source: string;          // Source (LinkedIn, Indeed, etc)
  resumeUsed: string;      // Resume version used
  status: JobStatus;       // Current status
  dateApplied?: string;    // Application date
  salary?: string;         // Salary range
  location?: string;       // Job location
  notes: string;           // Custom notes
  updates: JobUpdate[];    // Status update history
  createdAt: string;       // Created timestamp
  updatedAt: string;       // Updated timestamp
}

type JobStatus = 
  | 'saved'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';
```

---

## 🎨 Styling & Design

- **Framework**: Tailwind CSS
- **Icons**: Lucide React
- **Color Scheme**:
  - Saved: Gray
  - Applied: Blue
  - Screening: Yellow
  - Interview: Purple
  - Offer: Green
  - Rejected: Red
  - Withdrawn: Gray
- **Responsive Design**: Mobile, tablet, and desktop compatible

---

## 🔮 Future Enhancements

- [ ] Backend integration (Node.js/Express)
- [ ] Database storage (MongoDB/PostgreSQL)
- [ ] User authentication (OAuth)
- [ ] Export reports (PDF/CSV)
- [ ] Email notifications
- [ ] Mobile app version
- [ ] Interview prep notes
- [ ] Salary negotiation tracker
- [ ] Company research integration

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Support

For issues or questions, please create an issue in the GitHub repository.

---

## 🙏 Acknowledgments

- Built with React and TypeScript
- Styled with Tailwind CSS
- Icons from Lucide React
- Developed with Vite

---

**See [README_ARCHITECTURE.md](./README_ARCHITECTURE.md) for detailed architecture and design documentation.**
