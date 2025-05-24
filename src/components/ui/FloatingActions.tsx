// src/components/ui/FloatingActions.tsx - Fixed positioning and responsive
import React from 'react';
import ChatBot from './ChatBot';
import WPButton from './WPButton';

const FloatingActions: React.FC = () => {
  return (
    <div className="floating-actions-container">
      <WPButton />
      <ChatBot />
    </div>
  );
};

export default FloatingActions;