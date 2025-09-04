# DAMS - Doctor Appointment Management System

## Overview

DAMS (Doctor Appointment Management System) is a comprehensive web application designed to streamline the process of managing appointments between patients and doctors. It provides distinct user experiences for both roles, enabling efficient scheduling, management, and communication within a healthcare context.

## Features

*   **User Authentication**: Secure login and registration functionalities for both patients and doctors.
*   **Role-Based Dashboards**: Tailored dashboards providing relevant information and functionalities for doctors and patients.
*   **Appointment Management**: (Implied) Functionality for scheduling, viewing, and managing appointments.
*   **API Integration**: Seamless communication with backend services for data management.
*   **Global State Management**: Efficient state management for user sessions and application data.

## Technologies Used

This project is built using a modern web development stack to ensure a robust, scalable, and maintainable application.

*   **Next.js 14**: A React framework for building full-stack web applications.
*   **React**: A JavaScript library for building user interfaces.
*   **TypeScript**: A superset of JavaScript that adds static typing.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **React Hook Form**: For efficient and flexible form management with validation.
*   **Zod**: A TypeScript-first schema declaration and validation library.
*   **React Query**: For powerful data fetching, caching, and synchronization.
*   **Axios**: A promise-based HTTP client for making API requests.
*   **Lucide React**: A collection of beautiful and customizable SVG icons.
*   **React Hot Toast**: For elegant and accessible toast notifications.
*   **Zustand**: A small, fast, and scalable bear-bones state-management solution.

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Ensure you have the following installed on your machine:

*   Node.js (LTS version recommended)
*   npm (comes with Node.js) or Yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/dams.git
    cd dams
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Development Server

To start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

To build the application for production:

```bash
npm run build
# or
yarn build
```

This command optimizes the application for production deployment.

### Running Production Server

To run the built application in production mode:

```bash
npm start
# or
yarn start
```

## Project Structure

```
.
├── app/                  # Main application directory
│   ├── components/       # Reusable UI components
│   ├── doctor/           # Doctor-specific pages and logic
│   ├── lib/              # Utility functions, API services
│   ├── login/            # Login page
│   ├── patient/          # Patient-specific pages and logic
│   ├── register/         # Registration page
│   ├── store/            # Zustand stores for global state
│   ├── types/            # TypeScript type definitions
│   ├── favicon.ico
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout for the application
│   └── page.tsx          # Home page
├── public/               # Static assets
├── .git/                 # Git version control
├── node_modules/         # Project dependencies
├── next.config.ts        # Next.js configuration
├── package.json          # Project metadata and dependencies
├── postcss.config.mjs    # PostCSS configuration (for Tailwind CSS)
├── tsconfig.json         # TypeScript configuration
└── README.md             # This file
```

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.