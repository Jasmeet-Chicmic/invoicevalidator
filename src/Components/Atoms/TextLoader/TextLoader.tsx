import React, { useEffect, useState } from 'react';
import './TextLoader.scss';
import { MessageConfig, messages } from './helpers/constants';

const TextLoader: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, MessageConfig.MESSAGE_CHANGE_TIME);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-loader">
      <div className="text-loader__spinner" />
      <p className="text-loader__message">{messages[messageIndex]}</p>
    </div>
  );
};

export default TextLoader;
