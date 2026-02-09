import React, { useState, useEffect, useRef } from 'react';
import { useConversation } from '@elevenlabs/react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Phone,
  PhoneOff,
  Keyboard,
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
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isTextMode, setIsTextMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
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
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartSession = async () => {
    try {
      await conversation.startSession({
        agentId: 'agent_9101kh1pndn9f8arzdmrra4xc9jy',
      });
    } catch (error) {
      console.error('Failed to start session:', error);
      alert('Failed to connect. Please check your microphone permissions.');
    }
  };

  const handleEndSession = async () => {
    await conversation.endSession();
    setMessages([]);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      setMessages((prev) => [
        ...prev,
        {
          role: 'user',
          content: question,
          timestamp: new Date(),
        },
      ]);
      conversation.sendMessage(question);
    } else {
      setTextInput(question);
    }
  };

  const toggleMute = () => {
    conversation.setVolume(isMuted ? 1 : 0);
    setIsMuted(!isMuted);
  };

  const getStatusColor = () => {
    switch (conversation.status) {
      case 'connected':
        return conversation.isSpeaking ? 'bg-amber-500' : 'bg-emerald-500';
      case 'connecting':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = () => {
    if (conversation.status === 'connected') {
      if (conversation.isSpeaking) return 'Speaking...';
      return 'Listening';
    }
    if (conversation.status === 'connecting') return 'Connecting...';
    return 'Disconnected';
  };

  const isConnected = conversation.status === 'connected';

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
                Voice Assistant
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Ask questions about California child support policy
              </p>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
                <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {messages.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center h-full py-12">
              <div className="bg-white rounded-full p-6 shadow-lg mb-6">
                <Mic className="h-12 w-12 text-amber-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Start a Conversation</h2>
              <p className="text-gray-600 text-center max-w-md mb-8">
                Click "Start Session" below to begin talking with the voice assistant, or type your
                question.
              </p>

              {/* Example Questions */}
              <div className="w-full max-w-2xl">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Example Questions:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {EXAMPLE_QUESTIONS.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleExampleClick(question)}
                      className="text-left p-4 bg-white border border-gray-200 rounded-lg hover:border-amber-400 hover:shadow-md transition-all text-sm text-gray-700 hover:text-amber-900"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
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

        {/* Controls Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="max-w-5xl mx-auto">
            {/* Mode Toggle & Controls */}
            <div className="flex items-center gap-3 mb-4">
              {/* Mode Toggle */}
              <button
                onClick={() => setIsTextMode(!isTextMode)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                disabled={!isConnected}
              >
                {isTextMode ? (
                  <>
                    <Keyboard className="h-4 w-4" />
                    Text Mode
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4" />
                    Voice Mode
                  </>
                )}
              </button>

              {/* Mute Toggle */}
              {isConnected && (
                <button
                  onClick={toggleMute}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </button>
              )}

              <div className="flex-1" />

              {/* Session Controls */}
              {!isConnected ? (
                <button
                  onClick={handleStartSession}
                  disabled={conversation.status === 'connecting'}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {conversation.status === 'connecting' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Phone className="h-5 w-5" />
                      Start Session
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleEndSession}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all"
                >
                  <PhoneOff className="h-5 w-5" />
                  End Session
                </button>
              )}
            </div>

            {/* Text Input (when in text mode or voice not available) */}
            {isTextMode && isConnected && (
              <form onSubmit={handleTextSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                />
                <button
                  type="submit"
                  disabled={!textInput.trim()}
                  className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </form>
            )}

            {/* Voice Mode Indicator */}
            {!isTextMode && isConnected && (
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                  {conversation.isSpeaking ? (
                    <>
                      <Volume2 className="h-4 w-4 text-amber-700 animate-pulse" />
                      <span className="text-sm font-medium text-amber-900">
                        Assistant is speaking...
                      </span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4 text-amber-700 animate-pulse" />
                      <span className="text-sm font-medium text-amber-900">
                        Listening... speak your question
                      </span>
                    </>
                  )}
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
