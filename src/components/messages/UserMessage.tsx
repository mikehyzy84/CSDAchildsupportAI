import React from 'react';

interface UserMessageProps {
  content: string;
  timestamp: Date;
}

const UserMessage: React.FC<UserMessageProps> = ({ content, timestamp }) => {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className="flex justify-end w-full mb-4">
      <div className="flex flex-col items-end max-w-[70%] lg:max-w-[70%] md:max-w-[85%] sm:max-w-[85%]">
        <div
          className="px-4 py-3 text-white text-[15px] leading-relaxed break-words"
          style={{
            background: '#0EA5E9',
            borderRadius: '16px 16px 4px 16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
          }}
        >
          {content}
        </div>
        <div className="text-[11px] text-gray-400 mt-1">
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
