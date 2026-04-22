/**
 * App – Multi-step wizard for AI Project Generator.
 *
 * State machine:  WIZARD → GENERATING → SUCCESS / ERROR
 */
import { useState, useCallback } from 'react';

import { DEFAULT_CONFIG, STEPS } from './config/defaults';
import { generateProject, downloadBlob } from './services/api';

import StepIndicator from './components/StepIndicator';
import ThemeToggle from './components/ThemeToggle';
import StepBasics from './steps/StepBasics';
import StepTechStack from './steps/StepTechStack';
import StepAuth from './steps/StepAuth';
import StepInfrastructure from './steps/StepInfrastructure';
import StepDevQuality from './steps/StepDevQuality';
import StepExtras from './steps/StepExtras';

const STEP_COMPONENTS = [
  StepBasics,
  StepTechStack,
  StepAuth,
  StepInfrastructure,
  StepDevQuality,
  StepExtras,
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [phase, setPhase] = useState('wizard'); // wizard | generating | success | error
  const [error, setError] = useState(null);
  const [downloadedFile, setDownloadedFile] = useState(null);

  // ── Step data helpers ────────────────────────────────────────────
  const stepKey = STEPS[currentStep].key;

  const handleStepChange = useCallback(
    (newData) => {
      setConfig((prev) => ({ ...prev, [stepKey]: newData }));
    },
    [stepKey],
  );

  // ── Navigation ───────────────────────────────────────────────────
  const canGoNext =
    currentStep === 0 ? config.basics.project_name.trim().length > 0 : true;

  const goNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  // ── Generate ─────────────────────────────────────────────────────
  const handleGenerate = async () => {
    setPhase('generating');
    setError(null);

    try {
      const blob = await generateProject(config);
      const slug = config.basics.project_name.toLowerCase().replace(/\s+/g, '-');
      setDownloadedFile({ blob, filename: `${slug}.zip` });
      downloadBlob(blob, `${slug}.zip`);
      setPhase('success');
    } catch (err) {
      setError(err.message || 'Something went wrong.');
      setPhase('error');
    }
  };

  const handleRetry = () => {
    setPhase('wizard');
    setError(null);
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setCurrentStep(0);
    setPhase('wizard');
    setError(null);
    setDownloadedFile(null);
  };

  const handleRedownload = () => {
    if (downloadedFile) {
      downloadBlob(downloadedFile.blob, downloadedFile.filename);
    }
  };

  // ── Render ───────────────────────────────────────────────────────
  const StepComponent = STEP_COMPONENTS[currentStep];
  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="wizard-container">
      {/* Header */}
      <header className="wizard-header">
        <div className="wizard-logo">AI Project Generator</div>
        <p className="wizard-subtitle">
          Configure &amp; generate a production-ready scaffold in seconds
        </p>
        <ThemeToggle />
      </header>

      {/* ── WIZARD phase ────────────────────────────────────────── */}
      {phase === 'wizard' && (
        <>
          <StepIndicator steps={STEPS} current={currentStep} />

          <StepComponent
            key={stepKey}
            data={config[stepKey]}
            onChange={handleStepChange}
          />

          <div className="wizard-actions">
            <button
              className="btn btn-ghost"
              onClick={goBack}
              disabled={currentStep === 0}
              id="btn-back"
            >
              ← Back
            </button>

            {isLastStep ? (
              <button
                className="btn btn-primary btn-lg"
                onClick={handleGenerate}
                id="btn-generate"
              >
                🚀 Generate Project
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={goNext}
                disabled={!canGoNext}
                id="btn-next"
              >
                Next →
              </button>
            )}
          </div>
        </>
      )}

      {/* ── GENERATING phase ────────────────────────────────────── */}
      {phase === 'generating' && (
        <div className="generating-overlay">
          <div className="spinner" />
          <p className="generating-text">Generating your project…</p>
          <p className="generating-hint">
            The LLM is writing real code for every file. This may take 15-30 seconds.
          </p>
        </div>
      )}

      {/* ── SUCCESS phase ───────────────────────────────────────── */}
      {phase === 'success' && (
        <div className="success-container">
          <div className="success-icon">✓</div>
          <h2 className="success-title">Project Generated!</h2>
          <p className="success-desc">
            Your ZIP file has been triggered for download. 
            <strong> Please check your browser's download manager</strong> (top right or bottom bar).
          </p>
          <p className="success-desc" style={{ fontSize: '0.8rem', marginTop: '-0.5rem', opacity: 0.8 }}>
            Note: Chrome may flag this as a "Suspicious File" because it's from localhost. 
            Click "Keep" to save it.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleRedownload} id="btn-redownload">
              ⬇ Download Again
            </button>
            <button className="btn btn-secondary" onClick={handleReset} id="btn-new-project">
              + New Project
            </button>
          </div>
        </div>
      )}

      {/* ── ERROR phase ─────────────────────────────────────────── */}
      {phase === 'error' && (
        <div className="success-container">
          <div className="success-icon" style={{ background: 'var(--accent-rose)' }}>✕</div>
          <h2 className="success-title">Generation Failed</h2>
          {error && <div className="error-banner">{error}</div>}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleRetry} id="btn-retry">
              ↻ Retry
            </button>
            <button className="btn btn-ghost" onClick={handleReset} id="btn-start-over">
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
