/**
 * OptionCard – a selectable card used in radio-style option grids.
 */
export default function OptionCard({ icon, label, desc, selected, onClick }) {
  return (
    <label
      className={`option-card${selected ? ' selected' : ''}`}
      onClick={onClick}
    >
      <span className="option-icon">{icon}</span>
      <span className="option-label">{label}</span>
      {desc && <span className="option-desc">{desc}</span>}
    </label>
  );
}
