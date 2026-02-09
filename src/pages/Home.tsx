import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Send } from 'lucide-react';

const Home: React.FC = () => {
  const [textInput, setTextInput] = useState('');
  const navigate = useNavigate();

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (textInput.trim()) {
      // Navigate to chat with the initial message
      navigate('/chat', { state: { initialMessage: textInput } });
    }
  };

  const handleVoiceClick = () => {
    // Navigate to chat in voice mode
    navigate('/chat', { state: { startWithVoice: true } });
  };

  const handleStarterClick = (question: string) => {
    navigate('/chat', { state: { initialMessage: question } });
  };

  const STARTER_QUESTIONS = [
    'How is child support calculated in California?',
    'What enforcement options exist for delinquent payments?',
    'How does the low-income adjustment work?',
    'What are my rights under UIFSA for interstate cases?',
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              California Child Support Directors Association AI
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Search federal and state child support policies, guidelines, and procedures.
              Get intelligent summaries with policy citations to help you provide accurate guidance.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
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

          {/* Main Input Section */}
          <div className="max-w-3xl mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                What would you like to know about California child support policy?
              </h2>

              {/* Input Form */}
              <form onSubmit={handleTextSubmit} className="mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Ask a question about child support policy..."
                      className="w-full px-6 py-4 text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal focus:border-transparent outline-none"
                    />
                  </div>

                  {/* Voice Button */}
                  <button
                    type="button"
                    onClick={handleVoiceClick}
                    className="p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-sm hover:shadow-md"
                    title="Use voice input"
                  >
                    <Mic className="h-6 w-6" />
                  </button>

                  {/* Send Button */}
                  <button
                    type="submit"
                    disabled={!textInput.trim()}
                    className="px-8 py-4 bg-teal hover:bg-teal/90 text-white rounded-xl font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="h-5 w-5" />
                    Ask
                  </button>
                </div>
              </form>

              {/* Starter Questions */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Or try these examples:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {STARTER_QUESTIONS.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleStarterClick(question)}
                      className="text-left p-3 bg-gray-50 hover:bg-teal/5 border border-gray-200 hover:border-teal rounded-lg text-sm text-gray-700 hover:text-teal transition-all"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold text-teal mb-2">50+</div>
            <div className="text-sm text-gray-600">California Counties</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald mb-2">5,000+</div>
            <div className="text-sm text-gray-600">Policy Documents</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-teal mb-2">1,200+</div>
            <div className="text-sm text-gray-600">Active Members</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald mb-2">24/7</div>
            <div className="text-sm text-gray-600">Access Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
