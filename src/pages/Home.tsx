import React, { useState, useEffect, useRef } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Mic, MicOff, Send, Volume2, VolumeX, Loader2 } from 'lucide-react';
import MessageList from '../components/messages/MessageList';
import { Message } from '../types';

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const hasAutoConnected = useRef(false);

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
            type: message.source === 'user' ? 'user' : 'assistant',
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

  const handleTextSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!textInput.trim() || conversation.status !== 'connected') return;

    // Show chat interface if not already shown
    if (!showChat) {
      setShowChat(true);
    }

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        content: textInput,
        timestamp: new Date(),
      },
    ]);

    // Send to agent via text
    try {
      await conversation.sendMessage(textInput);
      setTextInput('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleStarterClick = async (question: string) => {
    if (conversation.status === 'connected') {
      setShowChat(true);
      // Add user message
      setMessages((prev) => [
        ...prev,
        {
          type: 'user',
          content: question,
          timestamp: new Date(),
        },
      ]);
      // Send to agent
      await conversation.sendMessage(question);
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
        if (!showChat) {
          setShowChat(true);
        }
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
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section - Always visible */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              California Child Support Directors Association AI
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Search federal and state child support policies, guidelines, and procedures.
              Get intelligent summaries with policy citations to help you provide accurate guidance.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Natural language queries return relevant policies with highlighted matches
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎤</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Voice & Text Chat</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ask questions by typing or speaking - powered by advanced AI assistant
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Team Annotations</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Add notes and share knowledge with your team for better case management
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Status Bar */}
          <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`} />
                <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
              </div>

              {/* Mute Toggle */}
              {isConnected && (
                <button
                  onClick={toggleMute}
                  className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  title={isMuted ? 'Unmute assistant' : 'Mute assistant'}
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-gray-700" />
                  ) : (
                    <Volume2 className="h-4 w-4 text-gray-700" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="h-[500px] overflow-y-auto bg-slate-50">
            {isInitializing ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="h-8 w-8 text-teal animate-spin mb-4" />
                <p className="text-gray-600">Connecting to CSDAI assistant...</p>
              </div>
            ) : showChat && messages.length > 0 ? (
              <MessageList messages={messages} onStarterClick={handleStarterClick} />
            ) : (
              <MessageList messages={[]} onStarterClick={handleStarterClick} />
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4">
            {!isInitializing && (
              <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
                <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-teal focus-within:border-transparent bg-white">
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder={
                      isMicActive
                        ? 'Or type your question...'
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
                        ? 'bg-teal text-white hover:bg-teal/90'
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
                  className="px-6 py-3 bg-teal hover:bg-teal/90 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </form>
            )}

            {/* Voice Status Indicator */}
            {isMicActive && isConnected && (
              <div className="mt-3 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal/10 border border-teal/30 rounded-lg">
                  <Mic className="h-4 w-4 text-teal animate-pulse" />
                  <span className="text-sm font-medium text-teal">
                    Microphone active - speak your question
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-teal mb-1">50+</div>
            <div className="text-sm text-gray-600">California Counties</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald mb-1">5,000+</div>
            <div className="text-sm text-gray-600">Policy Documents</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-teal mb-1">1,200+</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald mb-1">24/7</div>
            <div className="text-sm text-gray-600">Access Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
