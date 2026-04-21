/**
 * Step 2 – Tech Stack selection.
 */
import OptionCard from '../components/OptionCard';

const FRONTEND_OPTIONS = [
  { value: 'React',   icon: '⚛️',  label: 'React',   desc: 'Component-based' },
  { value: 'Next.js', icon: '▲',   label: 'Next.js', desc: 'Full-stack React' },
  { value: 'Vue',     icon: '💚',  label: 'Vue',     desc: 'Progressive' },
  { value: 'Svelte',  icon: '🔥',  label: 'Svelte',  desc: 'Compiled' },
];

const BACKEND_OPTIONS = [
  { value: 'FastAPI', icon: '⚡',  label: 'FastAPI', desc: 'Python async' },
  { value: 'Express', icon: '🟢',  label: 'Express', desc: 'Node.js' },
  { value: 'Go',      icon: '🐹',  label: 'Go',      desc: 'High perf' },
  { value: 'NestJS',  icon: '🐈',  label: 'NestJS',  desc: 'TypeScript' },
];

const DB_OPTIONS = [
  { value: 'PostgreSQL', icon: '🐘', label: 'PostgreSQL', desc: 'Relational' },
  { value: 'MongoDB',    icon: '🍃', label: 'MongoDB',    desc: 'Document' },
  { value: 'SQLite',     icon: '📁', label: 'SQLite',     desc: 'Embedded' },
  { value: 'none',       icon: '✖️', label: 'None',       desc: 'Skip DB' },
];

const STYLING_OPTIONS = [
  { value: 'Tailwind',            icon: '🎨', label: 'Tailwind' },
  { value: 'CSS-Modules',         icon: '📦', label: 'CSS Modules' },
  { value: 'Styled-Components',   icon: '💅', label: 'Styled Comp.' },
];

export default function StepTechStack({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="step-content animate-slide-in">
      <h2 className="step-title">Tech Stack</h2>
      <p className="step-description">
        Pick your frontend, backend, database, and styling approach.
      </p>

      <div className="step-fields">
        <div className="form-group">
          <span className="form-label">Frontend Framework</span>
          <div className="option-grid">
            {FRONTEND_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                {...opt}
                selected={data.frontend === opt.value}
                onClick={() => update('frontend', opt.value)}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <span className="form-label">Backend Framework</span>
          <div className="option-grid">
            {BACKEND_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                {...opt}
                selected={data.backend === opt.value}
                onClick={() => update('backend', opt.value)}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <span className="form-label">Database</span>
          <div className="option-grid">
            {DB_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                {...opt}
                selected={data.database === opt.value}
                onClick={() => update('database', opt.value)}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <span className="form-label">Styling</span>
          <div className="option-grid">
            {STYLING_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                {...opt}
                selected={data.styling === opt.value}
                onClick={() => update('styling', opt.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
