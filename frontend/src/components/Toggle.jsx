/**
 * Toggle – a simple on/off switch with a label.
 */
export default function Toggle({ label, checked, onChange }) {
  return (
    <div className="toggle-row">
      <span className="toggle-label">{label}</span>
      <div
        className={`toggle${checked ? ' active' : ''}`}
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={() => onChange(!checked)}
        onKeyDown={(e) => e.key === 'Enter' && onChange(!checked)}
      />
    </div>
  );
}
