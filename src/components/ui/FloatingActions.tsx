// src/components/ui/FloatingActions.tsx - Fixed positioning and responsive
import React from 'react';
// import WhatsAppButton from './WhatsAppButton';
import ChatBot from './ChatBot';
import WhatsAppButton from './whatsappButton';

const FloatingActions: React.FC = () => {
  return (
    <div className="floating-actions-container">
      <WhatsAppButton />
      <ChatBot />
    </div>
  );
};

export default FloatingActions;