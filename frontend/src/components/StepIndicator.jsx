/**
 * StepIndicator – horizontal step dots with connecting lines.
 */
export default function StepIndicator({ steps, current }) {
  return (
    <nav className="step-indicator" aria-label="Wizard progress">
      {steps.map((step, i) => {
        const status =
          i < current ? 'completed' : i === current ? 'active' : 'pending';
        return (
          <div key={step.key} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className={`step-dot ${status}`}
              title={step.label}
              aria-current={status === 'active' ? 'step' : undefined}
            >
              {status === 'completed' ? '✓' : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`step-connector${i < current ? ' completed' : ''}`}
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
