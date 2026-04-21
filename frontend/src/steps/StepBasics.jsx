/**
 * Step 1 – Project Basics (name, description, version).
 */
export default function StepBasics({ data, onChange }) {
  const update = (field, value) => onChange({ ...data, [field]: value });

  return (
    <div className="step-content animate-slide-in">
      <h2 className="step-title">Project Basics</h2>
      <p className="step-description">
        Give your project a name and tell us what it does.
      </p>

      <div className="step-fields">
        <div className="form-group">
          <label className="form-label" htmlFor="project-name">Project Name</label>
          <input
            id="project-name"
            className="form-input"
            type="text"
            placeholder="my-awesome-app"
            value={data.project_name}
            onChange={(e) => update('project_name', e.target.value)}
            maxLength={64}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-desc">Description</label>
          <textarea
            id="project-desc"
            className="form-textarea"
            placeholder="A brief description of what your project does…"
            value={data.description}
            onChange={(e) => update('description', e.target.value)}
            maxLength={512}
            rows={3}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="project-version">Version</label>
          <input
            id="project-version"
            className="form-input"
            type="text"
            placeholder="0.1.0"
            value={data.version}
            onChange={(e) => update('version', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
