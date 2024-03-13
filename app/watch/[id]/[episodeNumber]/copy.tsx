'use client';

import { useState } from 'react';
import { FaCopy } from 'react-icons/fa';

const CopyToClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyLinkToClipboard = () => {
    const linkInput = document.getElementById('linkInput') as HTMLInputElement;
    linkInput.select();
    document.execCommand('copy');

    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <>
      <span
        className="tooltip tooltip-top"
        data-tooltip={`${isCopied ? 'Copied!' : 'Copy'}`}
      >
        <button
          className="btn btn-ghost btn-circle btn-sm"
          onClick={copyLinkToClipboard}
        >
          <FaCopy />
        </button>
      </span>
    </>
  );
};

export default CopyToClipboard;
