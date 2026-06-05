# PrepRoute - Comprehensive Test Management System

PrepRoute is a powerful, modern web application designed for educators and administrators to create, manage, and publish online tests. It provides a seamless workflow from initial test setup to question creation and final publication.

## 🚀 Key Features

- **Dynamic Dashboard**: Centralized view of all tests with advanced filtering, search, and dual-view modes (List and Grid/Card).
- **Test Orchestration**: Easy setup for test metadata including subject, duration, marks, and difficulty.
- **Robust Question Editor**: Supports multi-choice questions with a Rich Text Editor (Quill) for both questions and solutions.
- **Publication Workflow**: Multiple publication states including Draft, Published, Live, and Scheduled, with the ability to unpublish at any time.
- **Performance Optimized**: Built with modern tooling for fast page loads and smooth transitions.

---

## 🛠️ Technology Stack & Rationale

We have carefully selected a modern stack to ensure scalability, maintainability, and a premium user experience.

### **Core Frameworks**
- **Vite**: We chose Vite over Create React App (CRA) primarily for speed. Vite's Hot Module Replacement (HMR) and lightning-fast build times significantly improve the developer experience.
- **React (v19)**: Utilizing the latest version of React allows us to leverage modern hooks and improved performance in the reconciliation process.
- **TypeScript**: The project is strictly typed. This choice helps us catch errors during development (rather than at runtime) and provides excellent IDE support, making the codebase easier to refactor and scale.

### **UI & Styling**
- **React Bootstrap / Bootstrap 5**: 
  - **Why Bootstrap?**: We chose Bootstrap for its proven, mobile-first responsive grid system and its wide array of pre-built, accessible components. It allows us to build complex layouts (like the test dashboard) quickly without sacrificing responsiveness.
  - **Customization**: By using the React-compatible version, we maintain a declarative code style while customizing the look and feel through a comprehensive SCSS design system.
- **Sass (SCSS)**: 
  - We use SCSS for a modular design system. Features like variables, mixins, and nesting allow us to maintain a consistent aesthetic across the entire platform while keeping our styling code "DRY" (Don't Repeat Yourself).

### **State & Data Management**
- **Redux Toolkit (RTK)**: Used for managing global application state, such as authentication status and user profiles. RTK was chosen for its reduced boilerplate and "batteries-included" approach to state management.
- **Formik & Yup**: Managing complex forms (like the question editor with multiple options and validation) can be difficult. Formik handles form state efficiently, while Yup provides a clean, schema-based validation layer.
- **Axios**: We use Axios for API communication due to its built-in support for request/response interceptors, which we use for centralized token management and error handling.

### **Utilities**
- **React Quill**: Integrated to provide educators with a full rich-text experience when drafting questions, allowing for mathematical formulas, formatting, and clear visual organization.
- **React Calendar & Date Picker**: Used for scheduling test publication with a user-friendly interface.

---

## 🏗️ Technical Architecture

- **Feature-Based Structure**: The source code is organized by features (e.g., `auth`, `dashboard`, `tests`), making it easy to isolate logic and scale the application as new modules are added.
- **Global Design Tokens**: Managed in `src/assets/scss/_variables.scss`, ensuring that colors, spacing, and typography are consistent application-wide.
- **Service Layer**: Centralized API logic within `src/services/` to keep components focused on the UI and user interaction.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

---

*PrepRoute: Empowering Educators with State-of-the-Art Tooling.*
