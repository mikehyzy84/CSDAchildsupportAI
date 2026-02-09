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

  const handleTextSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!textInput.trim() || conversation.status !== 'connected') return;

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        type: 'user',
        content: textInput,
        timestamp: new Date(),
      },
    ]);

    // Send to agent
    conversation.sendMessage(textInput);
    setTextInput('');
  };

  const handleStarterClick = (question: string) => {
    if (conversation.status === 'connected') {
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
      conversation.sendMessage(question);
    } else {
      // If not connected yet, just populate the input
      setTextInput(question);
    }
  };

  const toggleMic = () => {
    setIsMicActive(!isMicActive);
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
      {/* Header with Status & Controls */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-[800px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
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

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {isInitializing ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 text-teal animate-spin mb-4" />
            <p className="text-gray-600">Connecting to CSDAI assistant...</p>
          </div>
        ) : (
          <MessageList messages={messages} onStarterClick={handleStarterClick} />
        )}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-[800px] mx-auto px-6 py-4">
          {!isInitializing && (
            <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 border border-gray-300 rounded-lg px-4 py-3 focus-within:ring-2 focus-within:ring-teal focus-within:border-transparent bg-white">
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
  );
};

export default Home;
