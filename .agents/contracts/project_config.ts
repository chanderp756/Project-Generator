export interface ProjectBasics {
  projectName: string;
  description: string;
  version: string;
}

export interface TechStack {
  frontend: 'React' | 'Next.js' | 'Vue' | 'Svelte';
  backend: 'FastAPI' | 'Express' | 'Go' | 'NestJS';
  database: 'PostgreSQL' | 'MongoDB' | 'SQLite' | 'none';
  styling: 'Tailwind' | 'CSS-Modules' | 'Styled-Components';
}

export interface AuthConfig {
  enabled: boolean;
  provider?: 'Firebase' | 'Auth0' | 'NextAuth' | 'Custom';
  type?: 'JWT' | 'Session' | 'OAuth';
}

export interface Infrastructure {
  deployment: 'Vercel' | 'Netlify' | 'Docker' | 'AWS' | 'none';
  ci_cd: 'GitHub Actions' | 'GitLab CI' | 'none';
}

export interface DevQuality {
  testingFramework: 'Jest' | 'Pytest' | 'Vitest' | 'none';
  linting: boolean;
  formatting: boolean;
  typeChecking: boolean;
}

export interface Extras {
  analytics: 'Google Analytics' | 'Plausible' | 'none';
  errorLogging: 'Sentry' | 'LogRocket' | 'none';
}

export interface ProjectConfig {
  basics: ProjectBasics;
  stack: TechStack;
  auth: AuthConfig;
  infrastructure: Infrastructure;
  quality: DevQuality;
  extras: Extras;
}
