# YouTrack Test Management App

A YouTrack application for managing project-level test settings, specifically concurrent edit prevention flags.

## Overview

This app provides a simple interface to manage boolean flags for each project in your YouTrack instance. It's designed as part of a test management system that prevents concurrent editing conflicts.

## Features

- **Project List Display**: Shows all available YouTrack projects with colorful icons
- **Toggle Controls**: Enable/disable concurrent edit prevention per project
- **Persistent Storage**: Settings are saved to YouTrack backend
- **Error Handling**: Robust error handling with retry functionality
- **Loading States**: Smooth loading indicators during data operations

## Technology Stack

- **TypeScript** - Type-safe development
- **React** - Modern functional components with hooks
- **Ring UI** - JetBrains UI library for consistent styling
- **Vite** - Fast build tool and development server

## Project Structure

```
src/
├── widgets/widget1/
│   ├── components/          # React components
│   │   ├── ProjectCard/     # Project card components
│   │   ├── ProjectsGrid.tsx # Main grid component
│   │   └── ErrorMessage.tsx # Error handling component
│   ├── hooks/               # Custom React hooks
│   │   ├── useProjects.ts   # Project data management
│   │   ├── useProjectFlags.ts # Flag state management
│   │   └── useYouTrackHost.ts # Host configuration
│   ├── styles/              # Modular CSS
│   │   ├── base.css         # Global styles and variables
│   │   ├── layout.css       # Widget layout
│   │   ├── project-card.css # Project card styling
│   │   ├── color-themes.css # Color system
│   │   ├── project-colors.css # Project-specific colors
│   │   ├── sync-control.css # Toggle controls
│   │   ├── toggle-styles.css # Ring UI toggle customization
│   │   └── debug.css        # Debug and error styles
│   └── utils/               # Utility functions
├── backend.js               # YouTrack backend API
└── types/                   # TypeScript type definitions
```

## Development

### Prerequisites
- Node.js (version specified in .nvmrc)
- npm or yarn

### Setup
```bash
npm install
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Linting
```bash
npm run lint
```

### Package for Distribution
```bash
npm run pack
```

### Upload to YouTrack
```bash
npm run upload
```

## Installation

1. Build the application: `npm run build`
2. Package the app: `npm run pack`
3. Upload the generated `task1-youtrackapp.zip` to your YouTrack instance
4. The app will appear in the main menu under "Widget1"

## Usage

1. Navigate to the app from YouTrack's main menu
2. View the list of all projects in your YouTrack instance
3. Toggle the "Concurrent Edit Prevention" setting for each project as needed
4. Settings are automatically saved to the YouTrack backend

## Architecture Highlights

- **Modular CSS**: Large CSS file refactored into 8 focused modules for maintainability
- **Custom Hooks**: Clean separation of concerns with reusable hooks
- **Type Safety**: Full TypeScript implementation with proper interfaces
- **Error Boundaries**: Comprehensive error handling and user feedback
- **Responsive Design**: Adapts to different screen sizes and project counts

## API Integration

The app integrates with YouTrack's API to:
- Fetch project lists from the YouTrack instance
- Store and retrieve boolean flags via backend endpoints
- Handle authentication and host configuration automatically

## Color System

Projects are automatically assigned rotating colors from a palette of 11 themes, providing visual distinction while maintaining consistency across the interface.

## Contributing

This project follows JetBrains coding standards and uses:
- ESLint with JetBrains configuration
- TypeScript for type safety
- Ring UI for consistent styling
- Modular architecture for maintainability