import React from 'react';
import './PasswordStrengthMeter.css';

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (password) => {
    let score = 0;
    if (!password) return 0;

    // Award points for different criteria
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const strength = getStrength(password);
  const strengthLabels = ['Poor', 'Poor', 'Medium', 'Medium', 'Strong', 'Strong'];
  const strengthColors = ['#ef4444', '#ef4444', '#f97316', '#f97316', '#22c55e', '#22c55e'];

  const meterWidth = (strength / 5) * 100;
  const meterColor = strength > 0 ? strengthColors[strength] : '#e5e7eb';

  return (
    <div className="strength-meter-container">
      <div className="strength-meter-bar">
        <div
          className="strength-meter-fill"
          style={{ width: `${meterWidth}%`, backgroundColor: meterColor }}
        ></div>
      </div>
      {password.length > 0 && (
        <span className="strength-meter-label" style={{ color: meterColor }}>
          {strengthLabels[strength]}
        </span>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;