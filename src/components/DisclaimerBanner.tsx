import React from 'react';

const DisclaimerBanner: React.FC = () => {
  return (
    <div
      className="flex items-center gap-2 mb-6 rounded-lg"
      style={{
        background: 'rgba(245, 158, 11, 0.1)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        padding: '12px 16px',
      }}
    >
      <span className="text-base">⚠️</span>
      <p className="text-[13px] font-medium" style={{ color: '#92400E' }}>
        AI-generated responses may contain errors. Verify critical information with official sources.
      </p>
    </div>
  );
};

export default DisclaimerBanner;
