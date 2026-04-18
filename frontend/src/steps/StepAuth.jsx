/**
 * Step 3 – Authentication configuration.
 */
import Toggle from '../components/Toggle';
import OptionCard from '../components/OptionCard';

const PROVIDER_OPTIONS = [
  { value: 'Firebase', icon: '🔥', label: 'Firebase' },
  { value: 'Auth0',    icon: '🔑', label: 'Auth0' },
  { value: 'NextAuth', icon: '▲',  label: 'NextAuth' },
  { value: 'Custom',   icon: '🛠️', label: 'Custom' },
];

const TYPE_OPTIONS = [
  { value: 'JWT',     icon: '🎟️', label: 'JWT',     desc: 'Token-based' },
  { value: 'Session', icon: '🍪', label: 'Session', desc: 'Server-side' },
  { value: 'OAuth',   icon: '🌐', label: 'OAuth',   desc: 'Third-party' },
];

export default function StepAuth({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="step-content animate-slide-in">
      <h2 className="step-title">Authentication</h2>
      <p className="step-description">
        Enable auth and choose a provider and strategy.
      </p>

      <div className="step-fields">
        <Toggle
          label="Enable Authentication"
          checked={data.enabled}
          onChange={(val) =>
            onChange({
              ...data,
              enabled: val,
              provider: val ? data.provider || 'Firebase' : null,
              type: val ? data.type || 'JWT' : null,
            })
          }
        />

        {data.enabled && (
          <>
            <div className="form-group">
              <span className="form-label">Auth Provider</span>
              <div className="option-grid">
                {PROVIDER_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    {...opt}
                    selected={data.provider === opt.value}
                    onClick={() => update('provider', opt.value)}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Auth Type</span>
              <div className="option-grid">
                {TYPE_OPTIONS.map((opt) => (
                  <OptionCard
                    key={opt.value}
                    {...opt}
                    selected={data.type === opt.value}
                    onClick={() => update('type', opt.value)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
