import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useConversation } from '@elevenlabs/react';
import ReactMarkdown from 'react-markdown';
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
  FileText,
  ExternalLink,
} from 'lucide-react';

interface Citation {
  id: number;
  title: string;
  section: string;
  source: string;
  url: string | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
}

const EXAMPLE_QUESTIONS = [
  'How do I calculate guideline child support?',
  'What enforcement tools are available for arrears?',
  'Explain UIFSA jurisdiction rules',
  'When can I impute income to a parent?',
];

const Chat: React.FC = () => {
  const location = useLocation();
  const { initialMessage, startWithVoice, newChat, loadSessionId } = (location.state as any) || {};

  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isTextLoading, setIsTextLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [micMuted, setMicMuted] = useState(true); // Start with mic muted
  const [volumeMuted, setVolumeMuted] = useState(false);
  const [isConnectingVoice, setIsConnectingVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasHandledInitialMessage = useRef(false);
  const hasHandledVoiceStart = useRef(false);
  const pendingVoiceQuestion = useRef<string | null>(null);

  // Generate session ID once
  const sessionIdRef = useRef(
    `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
  );

  // ElevenLabs conversation (only for voice mode)
  const conversation = useConversation({
    micMuted, // Pass mic muted state (v0.14.0 API)
    onConnect: () => {
      console.log('Voice mode connected');
      setIsConnectingVoice(false);
      setIsVoiceMode(true);
    },
    onDisconnect: () => {
      console.log('Voice mode disconnected');
      setIsVoiceMode(false);
      setMicMuted(true);
      setIsConnectingVoice(false);
    },
    onMessage: (message) => {
      if (message.message) {
        if (message.source === 'user') {
          // User spoke - add to UI and save for database logging
          const userMsg: Message = {
            role: 'user',
            content: message.message,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, userMsg]);
          pendingVoiceQuestion.current = message.message;
        } else if (message.source === 'ai') {
          // AI responded - add to UI and save to database
          const aiMsg: Message = {
            role: 'assistant',
            content: message.message,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMsg]);

          // Save voice interaction to database
          if (pendingVoiceQuestion.current) {
            saveVoiceInteraction(pendingVoiceQuestion.current, message.message);
            pendingVoiceQuestion.current = null;
          }
        }
      }
    },
    onError: (error) => {
      console.error('Voice error:', error);
      setIsVoiceMode(false);
      setIsConnectingVoice(false);
      setMicMuted(true);
    },
  });

  // Handle initial message
  useEffect(() => {
    if (initialMessage && !hasHandledInitialMessage.current) {
      hasHandledInitialMessage.current = true;
      sendTextMessage(initialMessage);
    }
  }, [initialMessage]);

  // Handle voice mode from home page
  useEffect(() => {
    if (startWithVoice && !hasHandledVoiceStart.current) {
      hasHandledVoiceStart.current = true;
      toggleVoiceMode();
    }
  }, [startWithVoice]);

  // Handle new chat from sidebar
  useEffect(() => {
    if (newChat) {
      handleNewChat();
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [newChat]);

  // Handle load session from sidebar
  useEffect(() => {
    if (loadSessionId) {
      handleSelectSession(loadSessionId);
      // Clear the state to prevent re-triggering
      window.history.replaceState({}, document.title);
    }
  }, [loadSessionId]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save voice interaction to database
  const saveVoiceInteraction = async (question: string, answer: string) => {
    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          answer, // Pre-generated answer from ElevenLabs
          sessionId: sessionIdRef.current,
          responseType: 'voice',
          skipGeneration: true, // Flag to just save without re-generating
        }),
      });
    } catch (error) {
      console.error('Failed to save voice interaction:', error);
      // Don't block UX on logging failure
    }
  };

  // Send text message via /api/chat
  const sendTextMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTextLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: messageText,
          sessionId: sessionIdRef.current,
          responseType: 'summary',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', errorData);
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer || 'Sorry, I could not generate a response.',
        timestamp: new Date(),
        citations: data.citations || [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTextLoading(false);
    }
  };

  const handleTextSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isVoiceMode || !textInput.trim() || isTextLoading) return;
    sendTextMessage(textInput);
    setTextInput('');
  };

  const handleExampleClick = (question: string) => {
    if (!isVoiceMode && !isTextLoading) {
      sendTextMessage(question);
    }
  };

  const toggleVoiceMode = async () => {
    if (!isVoiceMode && !isConnectingVoice) {
      setIsConnectingVoice(true);
      try {
        await conversation.startSession({
          agentId: 'agent_9101kh1pndn9f8arzdmrra4xc9jy',
        });
        // Unmute mic to enable voice input
        setMicMuted(false);
      } catch (error) {
        console.error('Failed to start voice session:', error);
        setIsConnectingVoice(false);
        setMicMuted(true);
      }
    } else if (isVoiceMode) {
      try {
        // Mute mic before ending session
        setMicMuted(true);
        await conversation.endSession();
      } catch (error) {
        console.error('Failed to end voice:', error);
      }
      setIsVoiceMode(false);
    }
  };

  const toggleVolumeMute = () => {
    if (isVoiceMode) {
      conversation.setVolume({ volume: volumeMuted ? 1 : 0 });
      setVolumeMuted(!volumeMuted);
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    try {
      // Load messages for this session
      const response = await fetch(`/api/chat-history?sessionId=${sessionId}`);
      if (!response.ok) throw new Error('Failed to load session');

      const data = await response.json();
      const loadedMessages: Message[] = data.messages.map((msg: any) => ({
        role: msg.question ? 'user' : 'assistant',
        content: msg.question || msg.answer,
        timestamp: new Date(msg.created_at),
      }));

      // Flatten question/answer pairs into chronological messages
      const chronologicalMessages: Message[] = [];
      data.messages.forEach((msg: any) => {
        chronologicalMessages.push({
          role: 'user',
          content: msg.question,
          timestamp: new Date(msg.created_at),
        });
        chronologicalMessages.push({
          role: 'assistant',
          content: msg.answer,
          timestamp: new Date(msg.created_at),
        });
      });

      setMessages(chronologicalMessages);
      sessionIdRef.current = sessionId;
    } catch (error) {
      console.error('Error loading session:', error);
    }
  };

  const handleNewChat = () => {
    // Generate new session ID
    sessionIdRef.current = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    // Clear messages
    setMessages([]);
    // End voice mode if active
    if (isVoiceMode) {
      toggleVoiceMode();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-50">
      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
        <div className="flex items-start gap-3 max-w-5xl mx-auto">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900">
            <strong>Legal Disclaimer:</strong> This AI assistant provides policy and procedural
            guidance, not legal advice.
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
                Ask ChildSupportIQ
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {isConnectingVoice
                  ? 'Connecting...'
                  : isVoiceMode
                    ? `Voice Mode Active ${micMuted ? '(Mic Off)' : '(Mic On)'}`
                    : 'Text Mode'}
              </p>
            </div>

            {isVoiceMode && (
              <button
                onClick={toggleVolumeMute}
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                title={volumeMuted ? 'Unmute volume' : 'Mute volume'}
              >
                {volumeMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-12">
              <Bot className="h-16 w-16 text-amber-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Ask a Question</h2>
              <div className="w-full max-w-2xl mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {EXAMPLE_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleExampleClick(q)}
                      disabled={isVoiceMode || isTextLoading}
                      className="text-left p-4 bg-white border rounded-lg hover:border-amber-400 disabled:opacity-50 text-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-amber-700" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border text-gray-900'
                    }`}
                  >
                    <div className="text-sm leading-relaxed markdown-content">
                      <ReactMarkdown
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-xl font-bold mt-4 mb-2" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-bold mt-3 mb-2" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-base font-semibold mt-2 mb-1" {...props} />,
                          p: ({node, ...props}) => <p className="my-2" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                          li: ({node, ...props}) => <li className="my-1" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                          em: ({node, ...props}) => <em className="italic" {...props} />,
                          code: ({node, ...props}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {/* Citations - only for assistant messages */}
                    {msg.role === 'assistant' && msg.citations && msg.citations.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <p className="text-xs font-semibold text-gray-700 mb-2">Sources ({msg.citations.length}):</p>
                        <div className="space-y-2">
                          {msg.citations.map((citation) => (
                            <div
                              key={citation.id}
                              className="flex items-start gap-2 p-2 bg-amber-50 rounded border border-amber-200 hover:bg-amber-100 transition-colors cursor-pointer group"
                              onClick={() => {
                                if (citation.url) {
                                  window.open(citation.url, '_blank', 'noopener,noreferrer');
                                }
                              }}
                            >
                              <FileText className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">{citation.title}</p>
                                <p className="text-xs text-gray-600">{citation.section}</p>
                                <p className="text-xs text-gray-500 italic">{citation.source}</p>
                              </div>
                              {citation.url && (
                                <ExternalLink className="h-3 w-3 text-amber-600 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p className={`text-xs mt-2 ${msg.role === 'user' ? 'text-amber-100' : 'text-gray-500'}`}>
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5" />
                    </div>
                  )}
                </div>
              ))}
              {isTextLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <Bot className="h-5 w-5 text-amber-700" />
                  </div>
                  <div className="bg-white border rounded-lg px-4 py-3">
                    <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t bg-white p-4">
          <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
            <div className="flex-1 flex gap-2 border rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-amber-500">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={
                  isVoiceMode
                    ? micMuted
                      ? 'Voice mode - mic muted'
                      : 'Voice mode - speak now'
                    : 'Ask a question...'
                }
                disabled={isVoiceMode || isTextLoading}
                className="flex-1 outline-none disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleTextSubmit();
                  }
                }}
              />
              <button
                type="button"
                onClick={toggleVoiceMode}
                disabled={isConnectingVoice}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                  isVoiceMode && !micMuted ? 'bg-amber-600 text-white' : 'bg-gray-100'
                }`}
                title={isVoiceMode ? 'Exit voice mode' : 'Enter voice mode'}
              >
                {isConnectingVoice ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : isVoiceMode && !micMuted ? (
                  <Mic className="h-5 w-5" />
                ) : (
                  <MicOff className="h-5 w-5" />
                )}
              </button>
            </div>
            {!isVoiceMode && (
              <button
                type="submit"
                disabled={!textInput.trim() || isTextLoading}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2 hover:bg-amber-700 transition-colors"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
