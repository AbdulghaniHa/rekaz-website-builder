# 🏗️ Mini Website Builder

A powerful, intuitive drag-and-drop website builder built with modern web technologies. Create stunning websites with pre-made sections, real-time preview, and seamless import/export functionality.

## Live Demo

You can try the live demo [here](https://rekaz-website-builder.harran.workers.dev/)

## ✨ Features

### 🎯 Core Functionality

- **Section Library**: Pre-made sections (header, hero, footer, etc.) with click-to-add or drag and dropfunctionality
- **Drag & Drop Interface**: Intuitive drag-and-drop from sidebar to canvas and section reordering
- **Live Preview**: Real-time preview of your website as you build
- **Import/Export**: Save and load your designs as JSON configurations
- **Editable Properties**: Customize section content, images, and styling
- **Responsive Design**: Fully responsive across all device sizes

### 🎨 User Experience

- **Three-Column Layout**: Fixed left sidebar (components), center canvas (preview), right sidebar (hierarchy)
- **Real-time Updates**: All changes reflect immediately across all areas
- **Smooth Animations**: Subtle motion effects with 200ms transitions
- **Performance Optimized**: Minimal re-renders and efficient state management

## 🛠️ Tech Stack

### Framework & Language

- **Next.js 15** - React framework with SSR support
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development

### Styling & UI

- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Motion** - Smooth animations and transitions

### State Management

- **Zustand** - Lightweight state management for client-side state

Why Zustand? Zustand only re-renders components that subscribe to specific state slices, while React Context re-renders all consumers when any part of the state changes.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd rekaz-website-builder
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### Building Your Website

1. **Add Sections**: Click on any section in the left sidebar to add it to your canvas
2. **Customize Content**: Select a section to edit its properties (text, images, links)
3. **Reorder Sections**: Drag and drop sections in the right sidebar hierarchy
4. **Preview**: See your changes in real-time in the center canvas

### Save & Load

- **Export**: Save your design as a JSON file for later use
- **Import**: Load a previously saved JSON configuration to continue editing

## 🏗️ Architecture

### Project Structure

```
├── app/                    # Next.js app directory
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── builder/          # Builder-specific components
│   └── sections/         # Pre-made website sections
├── lib/                  # Utilities and configurations
├── stores/               # Zustand stores
└── types/                # TypeScript type definitions
```

### Key Design Principles

- **SSR Friendly**: Client components pushed down the component tree
- **Performance First**: Optimized for minimal re-renders
- **Mobile First**: Responsive design with proper breakpoints
- **Type Safety**: Full TypeScript coverage

### File Naming Convention

- Use kebab-case: `file-name.tsx`
- Also for component files: `component-name.tsx`
- Pages: `page.tsx`

## 🚀 Deployment

The repo is deployed on [Cloudflare workers](https://workers.dev/), why cloudflare workers? because it's fast and easy to deploy.