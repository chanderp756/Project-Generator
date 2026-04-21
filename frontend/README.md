# AI Project Generator - Frontend

React-based frontend application for the AI Project Generator. Provides an intuitive step-by-step wizard interface for configuring and generating full-stack projects.

## Features

- **Step-by-Step Wizard**: Guided project configuration process
- **Real-time Validation**: Client-side validation with helpful error messages
- **Responsive Design**: Mobile-friendly interface with dark/light theme support
- **TypeScript**: Type-safe development with full type checking
- **Modern React**: Built with React 19 and Vite for fast development
- **API Integration**: Seamless communication with the backend service

## Tech Stack

- **React 19**: Latest React with concurrent features
- **Vite**: Fast build tool and development server
- **TypeScript**: Type-safe JavaScript
- **ESLint**: Code linting and formatting
- **Tailwind CSS**: Utility-first CSS framework (planned)
- **React Router**: Client-side routing (if needed)

## Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── OptionCard.jsx    # Selection cards
│   │   ├── StepIndicator.jsx # Progress indicator
│   │   └── Toggle.jsx        # Theme toggle
│   ├── steps/            # Wizard step components
│   │   ├── StepAuth.jsx      # Authentication setup
│   │   ├── StepBasics.jsx    # Basic project info
│   │   ├── StepDevQuality.jsx # Quality gates
│   │   ├── StepExtras.jsx    # Additional features
│   │   ├── StepInfrastructure.jsx # Deployment
│   │   └── StepTechStack.jsx # Tech stack selection
│   ├── contexts/         # React contexts
│   │   └── ThemeContext.jsx  # Theme management
│   ├── services/         # API and external services
│   │   └── api.js            # Backend API client
│   ├── config/           # Configuration files
│   │   └── defaults.js       # Default settings
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # Application entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies and scripts
├── vite.config.js        # Vite configuration
├── eslint.config.js      # ESLint configuration
└── README.md
```

## Setup & Installation

### Using Docker (Recommended)

```bash
cd frontend
docker build -t ai-project-generator-frontend .
docker run -p 5173:5173 ai-project-generator-frontend
```

### Manual Installation

1. **Prerequisites:**
   - Node.js 18+
   - npm or yarn

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   Create a `.env` file in the frontend directory:
   ```bash
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality checks

## Development Workflow

### Adding New Wizard Steps

1. Create a new component in `src/steps/`
2. Follow the naming convention: `Step[Feature].jsx`
3. Implement the step logic with form validation
4. Update the main `App.jsx` to include the new step
5. Update the `StepIndicator` component if needed

### Component Guidelines

- Use functional components with hooks
- Implement proper TypeScript types
- Follow React best practices
- Use consistent naming conventions
- Add proper error handling

### API Integration

API calls are handled through `src/services/api.js`. The service provides:

- `generateProject(config)` - Send project config to backend
- Error handling and response parsing
- Loading states management

### Theming

The application supports dark and light themes through the `ThemeContext`. Components should respect the current theme for consistent styling.

## Configuration

### Wizard Steps

The application is organized into sequential steps:

1. **Authentication** (`StepAuth.jsx`): Choose authentication method
2. **Basics** (`StepBasics.jsx`): Project name and description
3. **Tech Stack** (`StepTechStack.jsx`): Frontend, backend, database selection
4. **Infrastructure** (`StepInfrastructure.jsx`): Deployment configuration
5. **Dev Quality** (`StepDevQuality.jsx`): Code quality preferences
6. **Extras** (`StepExtras.jsx`): Additional features

### Default Values

Default configurations are stored in `src/config/defaults.js`. Update this file to change default selections.

## Testing

```bash
# Run tests (when implemented)
npm test

# Run tests with coverage
npm test -- --coverage
```

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

## Deployment

### Docker Deployment

```bash
docker build -t ai-project-generator-frontend .
docker run -p 5173:5173 ai-project-generator-frontend
```

### Static Hosting

The built application can be deployed to any static hosting service:

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style and component patterns
2. Use TypeScript for type safety
3. Run `npm run lint` before committing
4. Test your changes thoroughly
5. Update documentation for new features

## Troubleshooting

### Common Issues

- **API Connection Failed**: Check that the backend is running and `VITE_API_BASE_URL` is correct
- **Build Errors**: Ensure all dependencies are installed with `npm install`
- **Linting Errors**: Run `npm run lint` to see specific issues

### Development Tips

- Use React Developer Tools for debugging
- Check the browser console for API errors
- Use the Vite dev server for fast reloading

## License

[Add your license here]
