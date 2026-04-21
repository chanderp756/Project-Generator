/**
 * Step 4 – Infrastructure (deployment & CI/CD).
 */
import OptionCard from '../components/OptionCard';

const DEPLOY_OPTIONS = [
  { value: 'Vercel',  icon: '▲',  label: 'Vercel',  desc: 'Serverless' },
  { value: 'Netlify', icon: '🌐', label: 'Netlify', desc: 'JAMstack' },
  { value: 'Docker',  icon: '🐳', label: 'Docker',  desc: 'Containers' },
  { value: 'AWS',     icon: '☁️', label: 'AWS',     desc: 'Cloud' },
  { value: 'none',    icon: '✖️', label: 'None',    desc: 'Manual' },
];

const CICD_OPTIONS = [
  { value: 'GitHub Actions', icon: '🐙', label: 'GitHub Actions' },
  { value: 'GitLab CI',      icon: '🦊', label: 'GitLab CI' },
  { value: 'none',           icon: '✖️', label: 'None' },
];

export default function StepInfrastructure({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="step-content animate-slide-in">
      <h2 className="step-title">Infrastructure</h2>
      <p className="step-description">
        Where will your project be deployed and how will CI/CD work?
      </p>

      <div className="step-fields">
        <div className="form-group">
          <span className="form-label">Deployment Target</span>
          <div className="option-grid">
            {DEPLOY_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                {...opt}
                selected={data.deployment === opt.value}
                onClick={() => update('deployment', opt.value)}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <span className="form-label">CI/CD Pipeline</span>
          <div className="option-grid">
            {CICD_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                {...opt}
                selected={data.ci_cd === opt.value}
                onClick={() => update('ci_cd', opt.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
