import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useConversation } from '@elevenlabs/react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  AlertCircle,
  Bot,
  User,
  Loader2,
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const EXAMPLE_QUESTIONS = [
  'How do I calculate guideline child support?',
  'What enforcement tools are available for arrears?',
  'Explain UIFSA jurisdiction rules',
  'When can I impute income to a parent?',
];

const VoiceChat: React.FC = () => {
  const location = useLocation();
  const { initialMessage, startWithVoice } = (location.state as any) || {};

  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasAutoConnected = useRef(false);
  const hasHandledInitialAction = useRef(false);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      setIsInitializing(false);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
    },
    onMessage: (message) => {
      console.log('Message received:', message);
      if (message.message) {
        setMessages((prev) => [
          ...prev,
          {
            role: message.source === 'user' ? 'user' : 'assistant',
            content: message.message,
            timestamp: new Date(),
          },
        ]);
      }
    },
    onError: (error) => {
      console.error('Conversation error:', error);
      setIsInitializing(false);
    },
  });

  // Auto-connect on mount
  useEffect(() => {
    if (!hasAutoConnected.current) {
      hasAutoConnected.current = true;
      const connectSession = async () => {
        try {
          await conversation.startSession({
            agentId: 'agent_9101kh1pndn9f8arzdmrra4xc9jy',
          });
        } catch (error) {
          console.error('Failed to auto-connect:', error);
          setIsInitializing(false);
        }
      };
      connectSession();
    }
  }, []);

  // Handle initial message or voice mode from navigation
  useEffect(() => {
    if (!hasHandledInitialAction.current && conversation.status === 'connected') {
      hasHandledInitialAction.current = true;

      if (initialMessage) {
        // Send the initial message
        setMessages((prev) => [
          ...prev,
          {
            role: 'user',
            content: initialMessage,
            timestamp: new Date(),
          },
        ]);
        conversation.sendMessage(initialMessage);
      } else if (startWithVoice) {
        // Start with voice mode
        toggleMic();
      }
    }
  }, [conversation.status, initialMessage, startWithVoice]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleTextSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!textInput.trim() || conversation.status !== 'connected') return;

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: 'user',
        content: textInput,
        timestamp: new Date(),
      },
    ]);

    // Send to agent
    conversation.sendMessage(textInput);
    setTextInput('');
  };

  const handleExampleClick = (question: string) => {
    if (conversation.status === 'connected') {
      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          role: 'user',
          content: question,
          timestamp: new Date(),
        },
      ]);
      // Send to agent
      conversation.sendMessage(question);
    } else {
      // If not connected yet, just populate the input
      setTextInput(question);
    }
  };

  const toggleMic = async () => {
    if (!isMicActive) {
      // Start microphone (Push-to-Talk)
      try {
        await conversation.startPTT();
        setIsMicActive(true);
      } catch (error) {
        console.error('Failed to start microphone:', error);
      }
    } else {
      // Stop microphone
      try {
        await conversation.endPTT();
        setIsMicActive(false);
      } catch (error) {
        console.error('Failed to stop microphone:', error);
      }
    }
  };

  const toggleMute = () => {
    conversation.setVolume(isMuted ? 1 : 0);
    setIsMuted(!isMuted);
  };

  const getStatusColor = () => {
    if (isInitializing) return 'bg-blue-500';
    if (conversation.status === 'connected') {
      return conversation.isSpeaking ? 'bg-amber-500' : 'bg-emerald-500';
    }
    return 'bg-gray-400';
  };

  const getStatusText = () => {
    if (isInitializing) return 'Connecting...';
    if (conversation.status === 'connected') {
      if (conversation.isSpeaking) return 'Speaking...';
      if (isMicActive) return 'Listening...';
      return 'Ready';
    }
    return 'Disconnected';
  };

  const isConnected = conversation.status === 'connected';
  const canSend = isConnected && !isInitializing;

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="flex items-start gap-3 max-w-5xl mx-auto">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900">
            <strong>Legal Disclaimer:</strong> This AI assistant provides policy and procedural
            guidance, not legal advice. Always verify critical decisions with your supervisor or
            legal team. Do not share PII or case-specific details.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-5xl mx-auto w-full">
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Bot className="h-7 w-7 text-amber-600" />
                Ask CSDAI
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                California child support policy assistant
              </p>
            </div>

            {/* Status & Controls */}
            <div className="flex items-center gap-3">
              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
                <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
              </div>

              {/* Mute Toggle */}
              {isConnected && (
                <button
                  onClick={toggleMute}
                  className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  title={isMuted ? 'Unmute assistant' : 'Mute assistant'}
                >
                  {isMuted ? (
                    <VolumeX className="h-5 w-5 text-gray-700" />
                  ) : (
                    <Volume2 className="h-5 w-5 text-gray-700" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {messages.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="bg-white rounded-full p-6 shadow-lg mb-6">
                <Bot className="h-12 w-12 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to CSDAI Policy Assistant
              </h2>
              <p className="text-gray-600 text-center max-w-md mb-8">
                {isInitializing
                  ? 'Connecting to the assistant...'
                  : 'Ask a question or click an example below to get started'}
              </p>

              {/* Example Questions */}
              {!isInitializing && (
                <div className="w-full max-w-2xl">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Example Questions:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {EXAMPLE_QUESTIONS.map((question, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleExampleClick(question)}
                        disabled={!isConnected}
                        className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-amber-400 hover:shadow-md transition-all text-sm text-gray-700 hover:text-amber-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Messages
            <div className="space-y-4">
              {messages.map((message, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <Bot className="h-5 w-5 text-amber-700" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-2 ${
                        message.role === 'user' ? 'text-amber-100' : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-700" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-5xl mx-auto">
            {/* Loading State */}
            {isInitializing && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 text-amber-600 animate-spin mr-3" />
                <span className="text-sm text-gray-600">Connecting to assistant...</span>
              </div>
            )}

            {/* Text Input with Mic Toggle */}
            {!isInitializing && (
              <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent bg-white">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={
                      isMicActive
                        ? 'Or speak your question...'
                        : 'Ask a question about child support policy...'
                    }
                    disabled={!canSend}
                    className="flex-1 outline-none text-sm bg-transparent disabled:opacity-50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleTextSubmit();
                      }
                    }}
                  />

                  {/* Mic Toggle Button */}
                  <button
                    type="button"
                    onClick={toggleMic}
                    disabled={!canSend}
                    className={`p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      isMicActive
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={isMicActive ? 'Stop using microphone' : 'Use microphone'}
                  >
                    {isMicActive ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </button>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!textInput.trim() || !canSend}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </form>
            )}

            {/* Voice Status Indicator */}
            {isMicActive && isConnected && (
              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  <Mic className="h-4 w-4 text-amber-700 animate-pulse" />
                  <span className="text-sm font-medium text-amber-900">
                    Microphone active - speak your question
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;
