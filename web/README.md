# Telepatía - Intelligent Medical Pipeline

Modern Angular application with standalone component architecture, minimalist design and medical analysis functionality.

## 🚀 How to Run

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Angular CLI 17+

### Installation and Execution
```bash
# Install dependencies
npm install

# Run in development mode
npm start
# or
ng serve

# Build for production
npm run build
# or
ng build
```

The application will be available at:
- **Local**: http://localhost:4200
- **Telepatía**: http://localhost:4200/telepatia

## 🏗️ Component Architecture

### File Structure
```
src/app/
├── components/
│   ├── header.component.ts          # Header with logo and navigation
│   ├── header.component.css
│   ├── analyzer-form.component.ts   # Analysis form
│   ├── analyzer-form.component.css
│   ├── results.component.ts         # Results visualization
│   ├── results.component.css
│   ├── footer.component.ts          # Footer with links
│   └── footer.component.css
├── app.component.ts                 # Main component (orchestrator)
├── app.component.css
├── app.config.ts                    # Application configuration
├── app.routes.ts                    # Routes
├── api.service.ts                   # API service
└── main.ts                          # Application bootstrap
```

### Standalone Components

#### 1. HeaderComponent
- **Responsibility**: Application header with logo, title and actions
- **Features**: 
  - Minimalist logo with SVG icon
  - GitHub button (placeholder)
  - Dark Mode toggle
- **Design**: Glassmorphism with backdrop-filter

#### 2. AnalyzerFormComponent
- **Responsibility**: Medical data input form
- **Features**:
  - Audio URL input
  - Medical text textarea
  - Real-time validations
  - Loading states
- **Design**: Card with glassmorphism and styled inputs

#### 3. ResultsComponent
- **Responsibility**: Analysis results display
- **Features**:
  - Transcription visualization
  - JSON viewer for structured data
  - Diagnosis rendering
  - Copy to clipboard buttons
- **Design**: Organized cards with custom scroll

#### 4. FooterComponent
- **Responsibility**: Application footer
- **Features**: Privacy, terms and contact links
- **Design**: Minimalist with glassmorphism

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (#6366f1) → Violet (#8b5cf6)
- **Success**: Green (#22c55e)
- **Error**: Red (#ef4444)
- **Text**: Slate (#0f172a, #64748b)
- **Background**: Light blue (#f6f9fc)

### Typography
- **Main Font**: Inter (fallback: system-ui)
- **Hierarchy**: xs, sm, base, lg, xl, 2xl, 3xl
- **Weights**: 400, 500, 600, 700

### Visual Components
- **Cards**: Glassmorphism with backdrop-filter
- **Buttons**: Gradients with hover effects
- **Inputs**: Rounded borders with focus rings
- **Shadows**: Soft shadows with multiple layers

## 🔧 Features

### Application States
- `audioUrl`: Audio file URL
- `freeText`: Medical text for analysis
- `transcription`: Transcription result
- `medicalObj`: Extracted structured data
- `medicalJson`: Formatted JSON for display
- `diagnosis`: Generated diagnosis
- `loading`: Loading state
- `error`: Error messages

### Validations
- Audio URL required for transcription
- Text required for extraction
- Visual error states
- Top-right error toast

### Accessibility
- Clear and associated labels
- AA contrast
- Visible focus
- Screen reader friendly
- Keyboard navigation

## 📱 Responsiveness

### Breakpoints
- **Mobile**: < 768px (vertical stack)
- **Desktop**: ≥ 768px (horizontal layout)
- **Max-width**: 1100px for content

### Mobile Adaptations
- Full-width buttons
- Cards with reduced padding
- Column header
- Full-width toast

## 🌙 Dark Mode

### Implementation
- Header toggle
- CSS variables with `data-theme="dark"`
- Colors adapted for contrast
- Smooth transitions

### Dark Colors
- **Background**: Slate-900 (#0f172a)
- **Cards**: Slate-800 with transparency
- **Text**: Slate-100, Slate-300
- **Borders**: Slate-600

## 🚀 Performance

### Optimizations
- Standalone components (tree-shaking)
- Lazy loading of routes
- Signals for reactivity
- CSS with variables for maintenance
- Optimized CSS animations

### Bundle
- Main: ~35KB (development)
- Styles: ~1KB
- Total: ~36KB

## 🔌 Integration

### API Service
- Endpoints for transcription, extraction and diagnosis
- Proxy configured for `/api`
- Consistent error handling
- TypeScript typing

### Firebase Functions
- Local emulator on port 5001
- HTTP functions for medical pipeline
- Mock data for development

## 🛠️ Technologies

- **Frontend**: Angular 17, TypeScript
- **Styling**: CSS Custom Properties, Glassmorphism
- **State**: Angular Signals
- **API**: HttpClient, RxJS
- **Backend**: Firebase Functions (mock)
- **Build**: Angular CLI, Vite

## 📝 License

Project developed for Telepatía technical test.
