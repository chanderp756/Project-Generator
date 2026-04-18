/**
 * Step 5 – Dev Quality (testing, linting, formatting, type-checking).
 */
import OptionCard from '../components/OptionCard';
import Toggle from '../components/Toggle';

const TEST_OPTIONS = [
  { value: 'Jest',   icon: '🃏', label: 'Jest',   desc: 'JS testing' },
  { value: 'Pytest', icon: '🐍', label: 'Pytest', desc: 'Python' },
  { value: 'Vitest', icon: '⚡', label: 'Vitest', desc: 'Vite-native' },
  { value: 'none',   icon: '✖️', label: 'None',   desc: 'Skip tests' },
];

export default function StepDevQuality({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="step-content animate-slide-in">
      <h2 className="step-title">Dev Quality</h2>
      <p className="step-description">
        Set up testing, linting, and code quality tooling.
      </p>

      <div className="step-fields">
        <div className="form-group">
          <span className="form-label">Testing Framework</span>
          <div className="option-grid">
            {TEST_OPTIONS.map((opt) => (
              <OptionCard
                key={opt.value}
                {...opt}
                selected={data.testing_framework === opt.value}
                onClick={() => update('testing_framework', opt.value)}
              />
            ))}
          </div>
        </div>

        <Toggle
          label="Linting (ESLint / Ruff)"
          checked={data.linting}
          onChange={(val) => update('linting', val)}
        />
        <Toggle
          label="Formatting (Prettier / Black)"
          checked={data.formatting}
          onChange={(val) => update('formatting', val)}
        />
        <Toggle
          label="Type Checking (TypeScript / mypy)"
          checked={data.type_checking}
          onChange={(val) => update('type_checking', val)}
        />
      </div>
    </div>
  );
}
