/**
 * Default values for every step of the wizard.
 * Matches the backend ProjectConfig schema.
 */
export const DEFAULT_CONFIG = {
  basics: {
    project_name: '',
    description: '',
    version: '0.1.0',
  },
  stack: {
    frontend: 'React',
    backend: 'FastAPI',
    database: 'none',
    styling: 'Tailwind',
  },
  auth: {
    enabled: false,
    provider: null,
    type: null,
  },
  infrastructure: {
    deployment: 'none',
    ci_cd: 'none',
  },
  quality: {
    testing_framework: 'none',
    linting: true,
    formatting: true,
    type_checking: true,
  },
  extras: {
    analytics: 'none',
    error_logging: 'none',
  },
};

/** Step metadata for the wizard progress indicator. */
export const STEPS = [
  { key: 'basics',         label: 'Basics',          icon: '📋' },
  { key: 'stack',           label: 'Tech Stack',      icon: '⚙️' },
  { key: 'auth',            label: 'Auth',            icon: '🔐' },
  { key: 'infrastructure',  label: 'Infrastructure',  icon: '☁️' },
  { key: 'quality',         label: 'Quality',         icon: '✅' },
  { key: 'extras',          label: 'Extras',          icon: '🧩' },
];
