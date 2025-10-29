// UI Constants
export const UI_CONSTANTS = {
  ICON_MAX_LENGTH: 3,
  MAX_PROJECT_NAME_LENGTH: 60,
  DEFAULT_PROJECT_LIMIT: 20
} as const;

// API Configuration
export const API_CONFIG = {
  PROJECT_QUERY_FIELDS: 'id,name,shortName,description,createdBy(login,name,id),leader(login,name,id)',
  ENDPOINTS: {
    PROJECTS: 'admin/projects',
    PROJECT_FLAGS: 'backend/project-flags'
  }
} as const;

// Project Color Themes
export const PROJECT_COLORS = {
  PINK: { main: '#ec4899', dark: '#be185d', light: '#fce7f3' },
  PURPLE: { main: '#8b5cf6', dark: '#6d28d9', light: '#f3e8ff' },
  RED: { main: '#ef4444', dark: '#dc2626', light: '#fef2f2' },
  ORANGE: { main: '#fb923c', dark: '#f97316', light: '#fff7ed' },
  INDIGO: { main: '#6366f1', dark: '#4f46e5', light: '#eef2ff' },
  ROSE: { main: '#f43f5e', dark: '#e11d48', light: '#fff1f2' },
  VIOLET: { main: '#a855f7', dark: '#7c3aed', light: '#faf5ff' },
  TEAL: { main: '#14b8a6', dark: '#0d9488', light: '#f0fdfa' },
  VIBRANT_ORANGE: { main: '#ff8a65', dark: '#ff7043', light: '#fff3e0' },
  SKY: { main: '#0ea5e9', dark: '#0284c7', light: '#f0f9ff' },
  BRIGHT_PINK: { main: '#ff0080', dark: '#db2777', light: '#fdf2f8' }
} as const;