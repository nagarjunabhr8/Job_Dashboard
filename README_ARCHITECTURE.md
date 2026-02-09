# 📊 Job Dashboard - Project Architecture & User Guide

A modern, intuitive web application for job seekers to manage their job applications efficiently. Track applications through multiple stages (Saved → Applied → Screening → Interview → Offer) with a beautiful Kanban board interface.

## 🎯 Overview

**Job Dashboard** is a comprehensive job application tracking tool that helps job seekers organize, monitor, and manage their job search process. It provides real-time statistics, detailed job cards, and a visual Kanban workflow for better job hunting organization.

---

## 👥 User Types & Use Cases

### 1. **Active Job Seekers** 
- **Profile**: Individuals actively searching for employment
- **Goals**: 
  - Track multiple job applications across different companies
  - Monitor application progress through various stages
  - Receive insights on application success rates
  - Store company-specific resume versions used for each application
- **Pain Points**: Losing track of applications, forgetting follow-up dates, missing interview schedules

### 2. **Career Changers**
- **Profile**: Professionals transitioning to new industries
- **Goals**: 
  - Organize applications by industry and source
  - Track different strategies (LinkedIn, Indeed, Referrals, Company Websites)
  - Monitor interview patterns across sectors
  - A/B test resume versions
- **Pain Points**: Complexity of applications, need to learn new industries

### 3. **Corporate Recruiters** (Internal Use)
- **Profile**: HR professionals managing candidate pipelines
- **Goals**: 
  - Track candidate applications in their database
  - Monitor pipeline progress
  - Generate application statistics
  - Manage multiple job openings
- **Pain Points**: Volume of applications, tracking candidate status

### 4. **University Career Services**
- **Profile**: Career counselors helping students
- **Goals**: 
  - Monitor student job search progress
  - Provide analytics on placement rates
  - Share best practices
- **Pain Points**: Tracking multiple students' applications

---

## 🏗️ Project Architecture

### **High-Level System Architecture**

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
      │  • useState (modal)    │
      │  • useLocalStorage     │
      │  • useMemo (stats)     │
      └────────────────────────┘
```

### **Component Hierarchy**

```
App (Root Component)
│
├── Header & Navigation Bar
│   ├── Tab Switcher (Board/Stats)
│   ├── Search Bar
│   └── Add Job Button
│
├── Main Content Area
│   ├── When Board Tab Active:
│   │   └── KanbanBoard
│   │       ├── KanbanColumn (Status: 'Saved')
│   │       │   └── JobCard[] (Draggable)
│   │       │       ├── Job Title & Company
│   │       │       ├── Job Details
│   │       │       └── Actions (Edit/Delete)
│   │       │
│   │       ├── KanbanColumn (Status: 'Applied')
│   │       │   └── JobCard[]
│   │       │
│   │       ├── KanbanColumn (Status: 'Screening')
│   │       │   └── JobCard[]
│   │       │
│   │       ├── KanbanColumn (Status: 'Interview')
│   │       │   └── JobCard[]
│   │       │
│   │       ├── KanbanColumn (Status: 'Offer')
│   │       │   └── JobCard[]
│   │       │
│   │       ├── KanbanColumn (Status: 'Rejected')
│   │       │   └── JobCard[]
│   │       │
│   │       └── KanbanColumn (Status: 'Withdrawn')
│   │           └── JobCard[]
│   │
│   └── When Stats Tab Active:
│       ├── StatsCard (Total Jobs)
│       ├── StatsCard (Applied Count)
│       ├── StatsCard (Interview Count)
│       └── StatsCard (Offers Count)
│
└── AddJobModal (Overlay)
    └── Job Form (Create/Edit Mode)
        ├── Company Name Input
        ├── Job Title Input
        ├── URL Input
        ├── Source Selector
        ├── Resume Used Input
        ├── Status Selector
        ├── Location Input
        ├── Salary Input
        ├── Notes TextArea
        └── Save/Cancel Buttons
```

### **Data Flow Diagram**

```
User Interaction
     │
     ├─→ Add Job → AddJobModal → Form Data → App State
     │                                        │
     │                                        └→ useLocalStorage Hook
     │                                            │
     │                                            └→ Browser LocalStorage
     │
     ├─→ Edit Job → Click Card → Modal Opens → Update State
     │
     ├─→ Delete Job → Trash Icon → Remove from State
     │
     ├─→ Move Job → Drag Card → Update Status → Save to Storage
     │
     └─→ Search → Filter Function → Update Display
         (No State Change - Display Only)
```

---

## 🗂️ Project Structure

```
job-board-assistant/
│
├── src/
│   ├── components/
│   │   ├── KanbanBoard.tsx       # Main board layout (7 columns)
│   │   │   └── Purpose: Layout container for Kanban columns
│   │   │   └── Props: jobs[], filtered results
│   │   │   └── Handles: Job filtering by search
│   │   │
│   │   ├── KanbanColumn.tsx      # Individual status column
│   │   │   └── Purpose: Display jobs for one status
│   │   │   └── Props: status, jobs, edit/delete handlers
│   │   │   └── Handles: Column header, job display
│   │   │
│   │   ├── JobCard.tsx           # Job display card
│   │   │   └── Purpose: Display individual job
│   │   │   └── Props: job object, edit/delete handlers
│   │   │   └── Features: Expandable, shows basic & detailed info
│   │   │
│   │   ├── AddJobModal.tsx       # Add/Edit job modal
│   │   │   └── Purpose: Form for creating/editing jobs
│   │   │   └── Props: isOpen, onClose, job data, onSave
│   │   │   └── Handles: Form validation, data capture
│   │   │
│   │   └── StatsCard.tsx         # Statistics cards
│   │       └── Purpose: Display metrics (total, applied, etc)
│   │       └── Props: icon, label, value
│   │       └── Reusable: Yes (used 4 times with different data)
│   │
│   ├── hooks/
│   │   └── useLocalStorage.ts    # Custom React hook
│   │       ├── Purpose: Persist state to browser storage
│   │       ├── Generic: Works with any data type
│   │       ├── Features: Automatic sync, JSON serialization
│   │       └── Returns: [state, setState]
│   │
│   ├── types/
│   │   └── job.ts                # TypeScript interfaces & types
│   │       ├── Job interface: Complete job data structure
│   │       ├── JobStatus type: Union of 7 possible statuses
│   │       ├── JobUpdate interface: For tracking changes
│   │       ├── Status labels & colors for UI
│   │       └── Type definitions: Ensures type safety
│   │
│   ├── App.tsx                   # Root component
│   │   ├── Purpose: Main app container
│   │   ├── State Management:
│   │   │   ├── jobs[] - all job applications
│   │   │   ├── isModalOpen - modal visibility
│   │   │   ├── editingJob - currently editing job (if any)
│   │   │   ├── searchQuery - user search input
│   │   │   └── activeTab - 'board' or 'stats'
│   │   ├── Features:
│   │   │   ├── CRUD operations for jobs
│   │   │   ├── Search functionality
│   │   │   ├── Statistics calculation
│   │   │   └── Tab switching (Board/Stats)
│   │   └── Renders: Header, tabs, main content, modal
│   │
│   ├── App.css                   # App-specific styles
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles
│
├── public/
│   └── vite.svg                  # Logo/icon
│
├── index.html                    # HTML template
├── package.json                  # Dependencies & scripts
├── vite.config.ts                # Vite configuration
├── tsconfig.json                 # TypeScript compiler options
├── tsconfig.app.json             # App-specific TS config
├── tsconfig.node.json            # Node-specific TS config
├── tailwind.config.cjs           # Tailwind CSS configuration
├── postcss.config.cjs            # PostCSS configuration
├── eslint.config.js              # Linting rules
├── .gitignore                    # Git ignore rules
└── README.md                      # Project documentation
```

---

## 🔑 Key Features

### 📋 **Job Application Tracking**
- **7-Stage Pipeline**
  - Saved: Bookmarked jobs for later consideration
  - Applied: Applications submitted
  - Screening: Initial screening/phone interviews
  - Interview: Technical or final interviews
  - Offer: Job offer received
  - Rejected: Application rejected
  - Withdrawn: Candidate withdrew application
- **Drag & Drop**: Move jobs between columns (future enhancement)
- **Job Details**: Company name, position, location, salary, source, and custom notes

### 📊 **Analytics Dashboard**
- **Real-time Statistics**
  - Total jobs tracked
  - Applied count (excludes 'saved')
  - Interview count (interview + offer stages)
  - Offers received
  - Weekly applications (last 7 days)
- **Visual Metrics**: Cards with icons and color indicators
- **Trend Analysis**: Track weekly application activity

### 🔍 **Search & Filter**
- Real-time search by company name or job title
- Instant filtering across all statuses
- Case-insensitive matching

### 💾 **Data Management**
- **Local Storage**: All data stored in browser (no server needed)
- **Data Persistence**: Application data survives browser refresh/close
- **Full CRUD**:
  - Create: Add new job applications
  - Read: View all jobs and details
  - Update: Edit job information
  - Delete: Remove applications
- **Automatic Timestamps**: Creation and update tracking

### 📝 **Application Updates**
- Track interview rounds and offer updates
- Add timestamped notes for each job
- Monitor timeline of job progression
- Update status with change history

---

## 🛠️ Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend Framework** | React | 19.2.0 | UI components and state management |
| **Language** | TypeScript | 5.9.3 | Type safety and better developer experience |
| **Build Tool** | Vite | 6+ | Fast development and production builds |
| **Styling** | Tailwind CSS | 3.4.19 | Utility-first CSS framework for rapid UI development |
| **Icons** | Lucide React | 0.563.0 | Beautiful, lightweight SVG icons |
| **State Management** | React Hooks | Built-in | useState, useMemo, custom hooks |
| **Storage** | Browser LocalStorage | Built-in | Persistent client-side data storage (5-10MB) |
| **CSS Tools** | PostCSS & Autoprefixer | Latest | CSS processing and vendor prefixing |
| **Code Quality** | ESLint | 9.39.1 | Linting and code standards enforcement |

---

## 📥 Installation

### Prerequisites
- Node.js 16 or higher
- npm or yarn package manager

### Step-by-Step Installation

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
   The app will be available at `http://localhost:5173`

4. **Open in browser**
   Navigate to the displayed URL in your default browser

---

## 🚀 Usage Guide

### **Adding a Job Application**
1. Click the **"+ Add Job"** button in the header
2. Fill in the job details:
   - **Company Name** (required)
   - **Job Title** (required)
   - **Job URL** (optional) - link to job posting
   - **Source** - where you found it (LinkedIn, Indeed, Company Website, Referral, etc.)
   - **Resume Used** - which version of your resume
   - **Status** - current stage in pipeline
   - **Location** (optional)
   - **Salary** (optional)
   - **Notes** - any additional information
3. Click **"Save Job"**

### **Managing Jobs**
- **Move Job**: Job appears in corresponding status column (drag coming soon)
- **Edit Job**: Click on a job card to open edit modal
- **Delete Job**: Click the trash icon on the job card
- **View Details**: Job cards show:
  - Company name
  - Job title
  - Status badge with color
  - Application date
  - Notes preview

### **Viewing Statistics**
1. Click the **"Stats"** tab in the navigation
2. View key metrics:
   - Total applications
   - Total applied (excluding saved)
   - Interview count (interview + offer)
   - Offers received
3. Analyze trends and success rates

### **Search & Filter Jobs**
- Use the **search bar** to find jobs
- Search by company name or job title
- Results update in real-time as you type
- Works across all status columns

### **Organizing Your Search**
- Use "Saved" status for bookmarked jobs to research later
- Add detailed notes for follow-up information
- Track resume versions used per company
- Monitor interview schedules in notes

---

## 📦 Available Scripts

```bash
# Start development server with HMR (Hot Module Reloading)
npm run dev

# Build for production (optimized bundle)
npm run build

# Preview production build locally before deployment
npm run preview

# Run ESLint to check code quality
npm run lint
```

---

## 💾 Data Structure & Schema

### **Job Object**
```typescript
interface Job {
  // Identifiers
  id: string;                    // Unique identifier (UUID v4)
  
  // Basic Information
  companyName: string;           // Company/Organization name
  jobTitle: string;              // Job position title
  
  // Application Details
  jobUrl?: string;               // URL to job posting
  source: string;                // Source: LinkedIn, Indeed, Company Website, Referral, etc
  resumeUsed: string;            // Resume version/variant used
  
  // Status & Tracking
  status: JobStatus;             // Current pipeline stage
  dateApplied?: string;          // Date application was submitted (ISO format)
  
  // Additional Information
  salary?: string;               // Salary range offered/posted
  location?: string;             // Job location
  notes: string;                 // Free-form notes and observations
  
  // Update History
  updates: JobUpdate[];          // Array of status updates
  
  // Timestamps
  createdAt: string;             // Record creation time (ISO format)
  updatedAt: string;             // Last modification time (ISO format)
}

// Job Status Types
type JobStatus = 
  | 'saved'      // Bookmarked for later consideration
  | 'applied'    // Application has been submitted
  | 'screening'  // In initial screening phase
  | 'interview'  // In interview process
  | 'offer'      // Offer has been received
  | 'rejected'   // Application was rejected
  | 'withdrawn'; // Withdrawn by candidate

// Job Update Entry
interface JobUpdate {
  id: string;      // Update identifier
  date: string;    // Update date (ISO format)
  message: string; // Update message/notes
}
```

### **Example Job Entry**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "companyName": "Google",
  "jobTitle": "Senior Full Stack Engineer",
  "jobUrl": "https://www.google.com/careers/jobs",
  "source": "LinkedIn",
  "resumeUsed": "Resume_v3_SWE.pdf",
  "status": "interview",
  "dateApplied": "2024-02-01T10:00:00Z",
  "salary": "$180K - $220K",
  "location": "Mountain View, CA",
  "notes": "Round 1 completed. System design interview scheduled for Feb 15.",
  "updates": [
    {
      "id": "1",
      "date": "2024-02-05T14:30:00Z",
      "message": "Passed phone screening with HR"
    }
  ],
  "createdAt": "2024-02-01T08:00:00Z",
  "updatedAt": "2024-02-05T14:30:00Z"
}
```

---

## 🎨 UI & Styling Guide

### **Color Scheme**
| Status | Color | Hex | Purpose |
|--------|-------|-----|---------|
| Saved | Gray | #F3F4F6 | Neutral, inactive status |
| Applied | Blue | #DBEAFE | Active, in-progress |
| Screening | Yellow | #FEF3C7 | Attention-needed |
| Interview | Purple | #E9D5FF | Important, advanced stage |
| Offer | Green | #DCFCE7 | Positive, success |
| Rejected | Red | #FEE2E2 | Negative, failure |
| Withdrawn | Gray | #F3F4F6 | Neutral, user action |

### **Components Styling**
- Built with **Tailwind CSS** utility classes
- **Responsive Design**: Mobile, tablet, and desktop
- **Dark Mode**: Ready for future implementation
- **Accessibility**: WCAG 2.1 compliant

---

## 🔮 Roadmap & Future Enhancements

### **Phase 2 (Enhancement)**
- [ ] Backend integration (Node.js/Express)
- [ ] Database storage (MongoDB/PostgreSQL)
- [ ] User authentication (Google OAuth, GitHub)
- [ ] Data export (PDF reports, CSV)
- [ ] Email notifications for interviews/offers

### **Phase 3 (Advanced Features)**
- [ ] Interview prep notes and resources
- [ ] Salary negotiation tracker
- [ ] Company research integration (Glassdoor API)
- [ ] Calendar integration (Google Calendar)
- [ ] Competitor analysis
- [ ] Interview question bank

### **Phase 4 (Mobile & Extensions)**
- [ ] Native mobile app (React Native)
- [ ] Browser extension for quick capture
- [ ] Mobile app notifications
- [ ] Offline mode

### **Phase 5 (Analytics & AI)**
- [ ] Advanced analytics dashboard
- [ ] AI-powered interview preparation
- [ ] Resume optimization suggestions
- [ ] Job matching recommendations
- [ ] Trend analysis and predictions

---

## 📄 License

This project is open source and available under the MIT License. See LICENSE file for details.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support & Contact

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team

---

## 🙏 Acknowledgments

- Built with **React** - A JavaScript library for building user interfaces
- Styled with **Tailwind CSS** - Utility-first CSS framework
- Icons from **Lucide React** - Beautiful, consistent SVG icons
- Developed with **Vite** - Next generation frontend tooling
- TypeScript for type safety and better developer experience

---

## 📊 Statistics & Metrics

### **Project Statistics**
- **Total Components**: 5 functional components
- **Total Files**: 25+ source files
- **Lines of Code**: ~1000 LOC (TypeScript/TSX)
- **Dependencies**: 3 core, 13+ dev dependencies
- **Bundle Size**: ~50KB gzipped

### **Performance Targets**
- **Load Time**: < 2 seconds
- **Time to Interactive**: < 3 seconds
- **Lighthouse Score**: > 90

---

## Version History

- **v1.0.0** (February 2024) - Initial release with core features
  - Kanban board with 7 status columns
  - Job CRUD operations
  - Local storage persistence
  - Statistics dashboard
  - Search functionality

---

**Last Updated**: February 9, 2026
**Status**: Active Development
**Maintained By**: Development Team
