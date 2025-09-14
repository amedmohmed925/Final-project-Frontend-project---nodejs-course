import React, { useState } from 'react';

const CopyButton = ({ text, size = 'sm' }) => {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className={`btn btn-${ok ? 'success' : 'outline-secondary'} btn-${size}`}
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1200); }
        catch {}
      }}
    >
      {ok ? 'Copied!' : 'Copy'}
    </button>
  );
};

export default CopyButton;
