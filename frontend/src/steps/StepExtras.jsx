/**
 * Step 6 – Extras (analytics, error logging).
 */
import OptionCard from '../components/OptionCard';

const ANALYTICS_OPTIONS = [
  { value: 'Google Analytics', icon: '📊', label: 'Google Analytics' },
  { value: 'Plausible',       icon: '📈', label: 'Plausible',       desc: 'Privacy-first' },
  { value: 'none',            icon: '✖️', label: 'None' },
];

const ERROR_OPTIONS = [
  { value: 'Sentry',    icon: '🛡️', label: 'Sentry',    desc: 'Error tracking' },
  { value: 'LogRocket', icon: '🚀', label: 'LogRocket', desc: 'Session replay' },
  { value: 'none',      icon: '✖️', label: 'None' },
];

export default function StepExtras({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="step-content animate-slide-in">
      <h2 className="step-title">Extras</h2>
      <p className="step-description">
        Add analytics and error logging to your project.
      </p>

      <div className="step-fields">
        <div className="form-group">
          <span className="form-label">Analytics</span>
          <div className="option-grid">
            {ANALYTICS_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                {...opt}
                selected={data.analytics === opt.value}
                onClick={() => update('analytics', opt.value)}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <span className="form-label">Error Logging</span>
          <div className="option-grid">
            {ERROR_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                {...opt}
                selected={data.error_logging === opt.value}
                onClick={() => update('error_logging', opt.value)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
