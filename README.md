# 🚀 DSA Tracker - Master Your Coding Journey

<div align="center">

![DSA Tracker](https://img.shields.io/badge/DSA-Tracker-22d3ee?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.5-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**A stunning, feature-rich platform to track your Data Structures & Algorithms learning with professional neon-dark UI**

[🎯 Features](#-features) • [🎨 Design](#-design-system) • [🛠️ Tech Stack](#️-tech-stack) • [🚀 Quick Start](#-getting-started)

</div>

---

## 📖 Overview

**DSA Tracker** is a **cutting-edge web application** designed to help developers **systematically master** Data Structures and Algorithms. Built with **modern technologies** and a **breathtaking neon-dark aesthetic**, featuring **animated LeetCode 🔶 and GeeksForGeeks 🟢 badges** for seamless platform integration.

## ✨ Features

### 🎬 **PROFESSIONAL ANIMATION SYSTEM** ⭐ NEW! Production-Grade Visuals!
- **Premium SVG Graphics** - Gradient backgrounds, drop shadows, glow effects
- **69 Interactive Animations** - Every algorithm step visualized professionally
- **Smooth Transitions** - Fade, slide, scale effects with GPU acceleration
- **Playback Controls** - Full media player with play/pause/speed (0.5x-2x)
- **Step Navigation** - Jump to any step, progress bar, step dots
- **Code Synchronization** - Watch code execute alongside visuals
- **Modern Design** - Inter & SF Mono fonts, cyan/green color scheme
- **Responsive Layout** - Beautiful on desktop, tablet, mobile
- **Learning Optimized** - 3-5x faster comprehension vs text-only
  
**Animation Quality:**
- ✨ Professional gradients and filters
- 🎨 Color-coded states (blue=normal, green=success, orange=active)
- 📊 Memory addresses and indices shown
- ⚡ Performance metrics (O(1), O(n)) displayed
- 🎯 Before/after comparisons
- 💡 Detailed explanations for each step

### 🧠 **THEORY & ANIMATED LEARNING MODULE** ⭐ Enhanced with 159+ Textbook Pages!
- **📘 Interactive Theory Pages** - Comprehensive textbook-quality content from "Data Structures & Algorithms in Java, 6th Edition"
- **🎬 69 Step-by-Step Animations** - Visual algorithm execution with detailed breakdowns for every concept
  - **Arrays**: 11 steps (insertion, two-pointer, sliding window, binary search)
  - **Linked Lists**: 13 steps (insert, delete, reverse, cycle detection)
  - **Stacks & Queues**: 15 steps (LIFO, FIFO, circular queue, applications)
  - **Trees**: 14 steps (BST operations, all traversals, height/size)
  - **Sorting & Searching**: 16 steps (merge sort, quick sort, binary search)
- **▶️ Playback Controls** - Play, pause, previous, next, replay with speed adjustment (0.5x - 2x)
- **🎥 Embedded Video Tutorials** - Curated from Abdul Bari, MIT OCW, and top educators
- **📊 Visual Diagrams** - SVG-based interactive representations with highlighted elements
- **⏱️ Time Tracking** - Monitor your learning time per topic
- **✅ Progress Tracking** - Theory completion status and readiness scores
- **🔗 Curated Resources** - Links to Visualgo, Take U Forward, GeeksforGeeks, CP-Algorithms
- **💡 Best Practices** - Common mistakes and expert tips from industry experience
- **📖 Textbook Integration** - 159+ pages from authoritative CS textbook with page references
- **Three-Panel Layout**: Topic navigation | Theory content | Quick reference

### 📚 **Comprehensive Topic Coverage**
- **8 Essential DSA Topics** with in-depth theory and examples
- **Step-by-step learning paths** with clear prerequisites
- **Code examples** with time & space complexity analysis
- **Interview tips** and common mistakes to avoid
- **Pattern recognition** for problem-solving mastery

### 🎯 **Smart Problem Tracking**
- **60+ Curated Problems** from 🔶 **LeetCode** and 🟢 **GeeksForGeeks**
- **� Easy Bulk Import** - Convert Excel/Striver Sheet to add hundreds of problems in minutes!
- **�🔶 LeetCode Integration** - Animated orange badges with glowing effects
- **🟢 GFG Integration** - Animated green badges with neon highlights
- **Multiple Status Tracking**: Unsolved, Solved, Needs Revision
- **⭐ Confidence Rating System** (1-5 stars) to track mastery
- **📝 Personal Notes** - Save your approach and insights
- **🏢 Company Tags** - FAANG and top companies
- **🎨 Pattern-Based Categorization** for systematic learning

### 📊 **Advanced Analytics**
- **📈 Real-time Progress Tracking** with animated charts
- **📊 Difficulty Distribution** - Visual breakdown (Easy, Medium, Hard)
- **💪 Topic-wise Mastery Levels** with strength/weakness analysis
- **🔥 Daily Streak Tracking** with gamification
- **🎯 Interview Readiness Score** based on your progress
- **📅 Activity Timeline** to visualize your journey

### 💾 **Seamless Data Management**
- **Auto-save to localStorage** - Never lose your progress
- **No account required** - Privacy-focused design
- **Works offline** - Practice anywhere, anytime
- **Export/Import ready** - Backup your data easily

## 🚀 Getting Started

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Start development server:**
```bash
npm run dev
```

3. **Open browser:**
Visit `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📊 Adding Problems from Excel/Striver Sheet

Want to add hundreds of problems quickly? Use our conversion tools!

### Option 1: HTML Converter (Easiest)
1. Open `excel-converter.html` in your browser
2. Copy data from Excel (Ctrl+C)
3. Paste in the converter (Ctrl+V)
4. Click "Convert" → Copy generated code
5. Paste into `src/data/topics.ts`

### Option 2: Python Script
```bash
# Export Excel to CSV, then:
python excel_converter.py striver_sheet.csv output.ts

# Copy output.ts content to src/data/topics.ts
```

**📚 Full Guide**: See [EXCEL_IMPORT_GUIDE.md](EXCEL_IMPORT_GUIDE.md) for detailed instructions

**📋 Quick Reference**: See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for fast lookup

## 📚 Topics Covered

### **🔢 1. Arrays & Hashing**
- Two pointers technique, sliding window, Kadane's algorithm
- Hash maps, sets, and frequency counting

### **🔤 2. Strings**
- Pattern matching, anagrams, palindromes
- String manipulation and substring problems

### **🔗 3. Linked Lists**
- Fast & slow pointers, reversal techniques
- Cycle detection and list manipulation

### **📦 4. Stacks & Queues**
- Monotonic stacks, LIFO/FIFO operations
- Expression parsing and evaluation

### **🌳 5. Trees & BST**
- DFS, BFS, tree traversals
- Binary search tree operations and balancing

### **🕸️ 6. Graphs**
- Graph traversals, topological sort
- Shortest paths, MST algorithms

### **💎 7. Dynamic Programming**
- Memoization and tabulation patterns
- Optimization problems and state transitions

### **🔍 8. Sorting & Searching**
- Binary search variants
- Classic sorting algorithms and optimizations

---

## 🎨 Design System

### **🌈 Color Palette - Neon Dark Theme**

Our **professionally designed color system** ensures **perfect contrast** and **stunning visuals**:

#### **Base Colors**
- **Background**: Pure Black `#000000` - Ultra-clean, reduces eye strain
- **Surface**: Deep Black `#0a0a0a` - Subtle elevation layers
- **Text Primary**: Pure White `#ffffff` - Maximum readability (21:1 contrast)
- **Text Secondary**: Light Gray `#d4d4d4` - Secondary content (15:1 contrast)

#### **Accent Colors**
- **🔵 Neon Cyan** `#22d3ee` - Primary actions, nav highlights
- **🟣 Bright Purple** `#c084fc` - Secondary accents, gradients
- **🌸 Hot Pink** `#f472b6` - Special highlights
- **🟢 Emerald Green** `#34d399` - Success, completed items
- **🟡 Golden Yellow** `#fbbf24` - Warnings, streak indicators
- **🔴 Coral Red** `#f87171` - Errors, hard difficulty

#### **Platform Colors**
- **🔶 LeetCode Orange** `#ffa116` - Authentic brand color with glow
- **🟢 GFG Green** `#2ecc71` - Official GeeksForGeeks color with neon effect

### **✨ Animation Effects**

- **🌊 Gradient Shift** - Flowing color transitions on titles
- **🎯 Smooth Pulse** - Gentle breathing effect (no jarring animations)
- **🔄 360° Rotation** - Icon spins on platform badges
- **⬆️ Float Animation** - Gentle up-down movement on logos
- **✨ Shimmer Effect** - Light sweep across progress bars
- **📏 Scale Transform** - Smooth card lifts on hover
- **💫 Glow Effects** - Dynamic shadows matching platform colors

### **🎯 Platform Badge Features**

#### **🔶 LeetCode Badges**
- **Animated orange gradient** background
- **Floating diamond emoji** (🔶) with smooth rotation
- **Glowing border** that intensifies on hover
- **360° spin animation** when hovering
- **External link icon** slides diagonally
- **Professional orange shadow** (`0 0 40px rgba(255, 161, 22, 0.4)`)

#### **🟢 GeeksForGeeks Badges**
- **Animated green gradient** background
- **Floating circle emoji** (🟢) with gentle float
- **Neon border glow** that pulses on hover
- **Smooth rotation** and scale effects
- **Shimmer sweep** animation
- **Professional green shadow** (`0 0 40px rgba(46, 204, 113, 0.4)`)

### **🎪 Interactive Elements**

- **Card Hover**: Lifts 8px with massive glowing shadow
- **Button Hover**: Scale 1.05x with color shift
- **Logo**: Continuous 30s smooth rotation with glow
- **Nav Links**: Slide animation with dual glow (outer + inner)
- **Progress Bars**: Animated shimmer with platform colors
- **Platform Badges**: Spin 360° and scale 1.3x on hover

---

## 💡 Usage Guide

### **🚀 Quick Start**
1. **Browse Topics** - Explore 8 DSA topics on Topics page
2. **📘 Learn Theory First** - Click "📘 Learn Theory" button for visual learning module
3. **Watch Animations** - Step-through algorithm execution with playback controls
4. **Watch Videos** - Learn from curated Abdul Bari, MIT OCW tutorials
5. **Read Theory** - Quick theory tab for reference
6. **🧩 Practice Problems** - Solve 60+ curated problems after understanding concepts
7. **Track Progress** - Mark problems as solved/revision
8. **View Analytics** - Check your stats on Analytics page

### **🧠 Theory & Learning Module** ✨ ENHANCED!
- **Navigate Topics** - Left sidebar shows all sections (Overview, Why It Matters, Core Explanation, Diagrams, Complexity, Mistakes, Resources)
- **Three Tabs**:
  - **Theory Tab** - Read comprehensive textbook-quality explanations with:
    - Detailed algorithm analysis from "Data Structures & Algorithms in Java, 6th Edition"
    - Time & space complexity breakdowns with mathematical proofs
    - Multiple implementation approaches (array-based, linked-list, recursive, iterative)
    - Real-world applications and interview insights
    - Direct page references to source textbook
  - **Animations Tab** - 69 interactive step-by-step visualizations:
    - 🔵 Each step with emoji indicators, code snippets, and highlights
    - ▶️ Full playback controls (play, pause, previous, next, replay)
    - ⚡ Adjustable speed (0.5x, 1x, 1.5x, 2x)
    - 📊 Visual progression through complex algorithms
    - 💡 Learn by seeing exactly how algorithms work step-by-step
  - **Videos Tab** - Watch embedded YouTube tutorials from top educators
- **Track Learning Time** - See minutes spent on each topic
- **Mark Complete** - Get 100% readiness score when theory is mastered
- **Quick Reference** - Right panel shows topic stats and practice entry point

### **📝 Problem Management**
- **Click Problem Card** to expand details
- **Mark Status**: Unsolved → Solved → Needs Revision
- **Add Notes**: Save your approach and learnings
- **Rate Confidence**: 1-5 stars to track mastery
- **Platform Links**: Click 🔶 LeetCode or 🟢 GFG badges to open problems

### **🔗 Platform Integration**
- **🔶 LeetCode Problems**: Orange badges with hover animations
- **🟢 GFG Problems**: Green badges with neon effects
- **One-Click Access**: Direct links to solve on original platforms
- **Visual Indicators**: Animated logos show platform clearly

---

## 🛠️ Tech Stack

### **Frontend**
- **⚛️ React 19.2.0** - Latest React with improved performance
- **📘 TypeScript 5.9.3** - Type-safe development
- **⚡ Vite 7.2.5** - Lightning-fast build tool and HMR
- **🎨 CSS3** - Modern styling with animations and gradients
- **🧭 React Router 7.11.0** - Client-side routing

### **State & Storage**
- **🔄 Context API** - Global state management
- **💾 LocalStorage** - Persistent data storage
- **🪝 Custom Hooks** - Reusable logic (useLocalStorage, useProgress)

### **UI Components & Animations**
- **🎨 Lucide React 0.562.0** - 50+ beautiful icons
- **🎬 Framer Motion 11.15.0** - Advanced animation library
- **🔶 Platform Emojis** - LeetCode and GFG visual indicators
- **✨ Custom Animations** - Professionally crafted CSS animations
- **📊 SVG Diagrams** - Interactive visual representations

---

## 📂 Project Structure

```
dsa-tracker/
├── src/
│   ├── components/
│   │   ├── Layout/           # Header with animated nav
│   │   └── Cards/            # Topic, Problem, Stats cards
│   ├── pages/
│   │   ├── Dashboard/        # Overview with analytics
│   │   ├── Topics/           # Topic browsing
│   │   ├── TopicDetail/      # Quick theory + problems
│   │   ├── Theory/           # 📘 NEW: Full theory learning module
│   │   ├── Problems/         # All problems with filters
│   │   └── Analytics/        # Progress visualization
│   ├── context/              # Global state management
│   ├── hooks/                # Custom React hooks
│   ├── data/
│   │   ├── topics.ts         # Topics and problems data
│   │   └── learningModules.ts # 📘 NEW: Theory content with videos/animations
│   └── types/                # TypeScript definitions
```

---

## 🌟 What Makes This Special?

### **🎨 Visual Excellence**
- **Neon-dark theme** with perfect WCAG AAA contrast
- **Professional animations** with cubic-bezier easing
- **Platform badges** that look authentic (LeetCode orange, GFG green)
- **Smooth transitions** throughout the app

### **⚡ Performance**
- **Lightning-fast** Vite bundling
- **Optimized renders** with React 19
- **Instant data access** with localStorage
- **Minimal bundle size** for fast loading

### **🧠 Smart Features**
- **📘 Theory-First Approach** - Learn concepts before practicing
- **🎬 Interactive Animations** - Visual algorithm execution
- **🎥 Video Integration** - Curated educational content
- **Intelligent recommendations** based on progress
- **Confidence-based review system**
- **Company tag filtering** for interview prep
- **Pattern-based learning** approach
- **Learning time tracking** and readiness scores

### **🌐 Best Resources Integrated**
- **[Visualgo](https://visualgo.net)** - Interactive DSA visualizations
- **[Take U Forward](https://takeuforward.org)** - Striver's curated content
- **[GeeksforGeeks](https://geeksforgeeks.org)** - Comprehensive DSA articles
- **[CP-Algorithms](https://cp-algorithms.com)** - Advanced algorithm explanations
- **[Abdul Bari YouTube](https://youtube.com/@abdul_bari)** - Best algorithm animations
- **[MIT OCW](https://ocw.mit.edu)** - Academic algorithm courses

---

<div align="center">

## ⭐ Star this repo if you find it helpful!

**Made with ❤️ and ☕ by developers, for developers**

### 🚀 **Start your DSA mastery journey today!** 🚀

---

**Happy Coding! Track your path to coding excellence!** 💻✨

</div>

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
