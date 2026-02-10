import React, { useEffect, useRef } from 'react';
import DisclaimerBanner from '../DisclaimerBanner';
import UserMessage from './UserMessage';
import AIMessage from './AIMessage';
import { Message } from '../../types';

interface MessageListProps {
  messages: Message[];
  onStarterClick?: (question: string) => void;
}

const STARTER_QUESTIONS = [
  'How is child support calculated in California?',
  'What enforcement options exist for delinquent payments?',
  'How does the low-income adjustment work?',
  'What are my rights under UIFSA for interstate cases?',
];

const MessageList: React.FC<MessageListProps> = ({ messages, onStarterClick }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          {/* Logo */}
          <div className="mb-6">
            <img
              src="/CSDAI%20NEW%20LOGO.png"
              alt="CSDAI Logo"
              className="w-[120px] h-auto"
            />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-semibold text-gray-800 mb-8 text-center max-w-2xl">
            What would you like to know about California child support policy?
          </h1>

          {/* Starter Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-[600px]">
            {STARTER_QUESTIONS.map((question, index) => (
              <button
                key={index}
                onClick={() => onStarterClick?.(question)}
                className="bg-white p-4 rounded-xl border border-gray-200 text-left text-sm text-gray-600 transition-all duration-200 hover:border-teal hover:shadow-lg"
                style={{
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
                }}
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Messages view
  return (
    <div className="max-w-[800px] mx-auto px-6 py-6 pb-24">
      {/* Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Messages */}
      {messages.map((message, index) => (
        <div key={index}>
          {message.type === 'user' ? (
            <UserMessage content={message.content} timestamp={message.timestamp} />
          ) : (
            <AIMessage
              content={message.content}
              timestamp={message.timestamp}
              citations={message.citations}
            />
          )}
        </div>
      ))}

      {/* Scroll anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
