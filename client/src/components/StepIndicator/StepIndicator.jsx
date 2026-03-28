import React from 'react';
import './StepIndicator.css';

const steps = [
  {
    key: 'carrito',
    label: 'Carrito',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
    ),
  },
  {
    key: 'entrega',
    label: 'Entrega',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    ),
  },
  {
    key: 'pago',
    label: 'Pago',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    ),
  },
  {
    key: 'resumen',
    label: 'Resumen',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
  },
];

const StepIndicator = ({ currentStep }) => {
  const currentIdx = steps.findIndex(s => s.key === currentStep);

  return (
    <div className="step-indicator-wrapper">
      <div className="step-indicator">
        {steps.map((step, idx) => {
          const status = idx < currentIdx ? 'done' : idx === currentIdx ? 'active' : 'pending';
          return (
            <div key={step.key} className={`step-item step-${status}`}>
              <div className="step-icon">
                {status === 'done' ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : step.icon}
              </div>
              <span className="step-label">{step.label}</span>
              {idx < steps.length - 1 && <div className="step-arrow"></div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
