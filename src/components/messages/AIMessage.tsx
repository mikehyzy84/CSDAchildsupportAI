import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface AIMessageProps {
  content: string;
  timestamp: Date;
  citations?: Array<{
    id: number;
    title: string;
    section: string;
    source: string;
    url: string | null;
  }>;
  onFeedback?: (feedback: 'positive' | 'negative') => void;
}

const AIMessage: React.FC<AIMessageProps> = ({ content, timestamp, citations, onFeedback }) => {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedback(type);
    onFeedback?.(type);
  };

  // Split content by double newlines to preserve paragraph breaks
  const paragraphs = content.split('\n\n').filter(p => p.trim());

  return (
    <div className="flex justify-start w-full mb-6">
      <div className="bg-white rounded-lg p-5 max-w-[85%] lg:max-w-[85%] md:max-w-[95%] sm:max-w-[95%]"
        style={{
          borderLeft: '4px solid #0EA5E9',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        {/* Content */}
        <div className="text-[15px] leading-relaxed text-gray-800 mb-4">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className={index < paragraphs.length - 1 ? 'mb-3' : ''}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Citations (if any) */}
        {citations && citations.length > 0 && (
          <div className="mb-4 pt-3 border-t border-slate">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Sources
            </p>
            <div className="space-y-1">
              {citations.map((citation) => (
                <div key={citation.id} className="text-xs text-gray-600">
                  {citation.url ? (
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal hover:underline"
                    >
                      {citation.title} - {citation.section}
                    </a>
                  ) : (
                    <span>{citation.title} - {citation.section}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-slate">
          <div className="text-[11px] text-gray-400">
            {formatTime(timestamp)}
          </div>

          {/* Feedback Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleFeedback('positive')}
              className={`p-1.5 rounded transition-all duration-150 ${
                feedback === 'positive'
                  ? 'text-teal bg-teal/15'
                  : 'text-gray-400 hover:text-teal hover:bg-teal/8'
              }`}
              aria-label="Helpful"
            >
              <ThumbsUp size={16} />
            </button>
            <button
              onClick={() => handleFeedback('negative')}
              className={`p-1.5 rounded transition-all duration-150 ${
                feedback === 'negative'
                  ? 'text-teal bg-teal/15'
                  : 'text-gray-400 hover:text-teal hover:bg-teal/8'
              }`}
              aria-label="Not helpful"
            >
              <ThumbsDown size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMessage;
