import React, { useState } from 'react';
import { Sparkles, Loader2, ExternalLink, AlertCircle, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Citation {
  id: string;
  title: string;
  source: string;
  excerpt: string;
  similarity: number;
}

interface AIResponse {
  answer?: string;
  citations: Citation[];
  suggestions: string[];
  error?: string;
  request_id: string;
}

interface AIPanelProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ query, onSuggestionClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // California-specific AI responses with embedded policy language
  const getMockAIResponse = (query: string): AIResponse => {
    const mockCitations: Citation[] = [
      {
        id: '1',
        title: 'California Family Code § 4053 et seq.',
        source: 'California',
        excerpt: 'California Family Code § 4053 et seq. provides definitions, scope, and authority over child support. This foundational statute establishes the legal framework...',
        similarity: 0.95
      },
      {
        id: '2',
        title: 'California Code of Regulations, Title 22, Division 13',
        source: 'California',
        excerpt: 'CCR Title 22, Division 13 contains regulations implementing Department of Child Support Services (DCSS) authority...',
        similarity: 0.87
      },
      {
        id: '9',
        title: 'Child Support Guidelines (Statewide Uniform Guidelines)',
        source: 'California',
        excerpt: 'Child Support Guidelines (Statewide Uniform Guidelines) are used by courts and agencies to calculate support orders...',
        similarity: 0.82
      }
    ];

    const mockSuggestions = [
      "How does California calculate child support for joint custody arrangements?",
      "What are DCSS enforcement procedures for non-payment in California?",
      "How do I request a modification under California Family Code?",
      "What medical support requirements apply under California law?",
      "How does California handle interstate child support cases?"
    ];

    let mockAnswer = "";
    if (query.toLowerCase().includes('calculate') || query.toLowerCase().includes('children')) {
      mockAnswer = `**California Child Support Calculation Framework**

Under **California Family Code § 4055**, child support is calculated using the statewide uniform guideline formula: CS = K[HN - (H%)(TN)]. This formula considers both parents' net disposable income and the percentage of time each parent has with the children.

**Key Policy Language from Family Code § 4055(a):**
"The statewide uniform guideline for determining child support orders is as follows: CS = K[HN - (H%)(TN)] where: CS = child support amount, K = amount of both parents' income to be allocated for child support, HN = high earner's net monthly disposable income, H% = approximate percentage of time that the high earner has or will have primary physical responsibility for the children, TN = total net monthly disposable income of both parties."

**DCSS Implementation Standards:**
According to CCR Title 22, Division 13, local child support agencies must use the DissoMaster or other court-approved software to ensure accurate calculations. The regulations specify that "net disposable income" includes salary, wages, commissions, bonuses, dividends, pensions, and other income sources, minus mandatory deductions.

**Next Steps for Calculation:**
1. **Gather Income Documentation**: Collect last 3 months of pay stubs, tax returns, and proof of other income sources
2. **Calculate Net Disposable Income**: Apply California-specific deductions per Family Code § 4059
3. **Determine Parenting Time**: Document custody schedule as percentage affects the calculation significantly
4. **Apply Add-Ons**: Include mandatory additions for health insurance, childcare, and uninsured medical costs per Family Code § 4062
5. **File with Local DCSS Office**: Submit completed Income and Expense Declaration (FL-150) to your county's child support agency

**Expert Annotation**: California's guideline differs from other states by incorporating parenting time directly into the base calculation rather than as a separate adjustment. Family law attorneys note this makes California's system more responsive to shared custody arrangements compared to traditional "Income Shares" models used elsewhere.`;
    } else if (query.toLowerCase().includes('enforcement') || query.toLowerCase().includes('non-payment')) {
      mockAnswer = `**California Child Support Enforcement Authority**

The **Department of Child Support Services (DCSS)** operates under California Family Code § 17400 et seq., which grants broad enforcement powers. DCSS policy mandates a systematic approach to enforcement, escalating from administrative to judicial remedies.

**Primary Enforcement Tools Under California Law:**

**1. Immediate Income Withholding (Family Code § 5230-5246)**
Policy language states: "Immediate income withholding shall be implemented for all support orders unless the court finds good cause not to require immediate income withholding or unless both parties agree to an alternative arrangement."

**2. Asset Seizure and Bank Levies (Family Code § 17522)**
DCSS can freeze bank accounts and seize assets without prior court approval when support is 30+ days past due. The statute provides: "The local child support agency may serve a notice to withhold on any person, political subdivision, or department of the state."

**3. License Suspension Programs (Family Code § 17520)**
California suspends driver's licenses, professional licenses, and recreational licenses for parents owing $2,500+ in past-due support.

**DCSS Operational Policy - Progressive Enforcement:**
Current DCSS policies require case workers to attempt income withholding first, followed by asset location through Financial Institution Data Match (FIDM), then administrative enforcement actions before seeking judicial intervention.

**Next Steps for Non-Payment Cases:**
1. **Document the Arrearage**: Obtain current account statement from DCSS showing past-due amount
2. **Request Enforcement Action**: Contact your local DCSS office to initiate enforcement procedures
3. **Provide Updated Information**: Share any new employer or asset information about the non-paying parent
4. **Consider Contempt Proceedings**: For persistent non-payment, request judicial enforcement through Family Code § 4722
5. **Interstate Coordination**: If parent moved out of state, request UIFSA enforcement through DCSS

**Expert Annotation**: California's enforcement system is considered among the most aggressive nationally. Unlike some states that require court orders for each enforcement action, California Family Code grants DCSS direct administrative authority, significantly speeding up the enforcement process. Child support attorneys note that California's FIDM system is particularly effective, often locating hidden assets other states miss.`;
    } else {
      mockAnswer = `**California Child Support Legal Framework Overview**

California's child support system operates under a comprehensive legal framework combining state statutes, administrative regulations, and DCSS operational policies.

**Foundational Authority - Family Code § 4053:**
"The duty of support imposed by this section is primary and may not be compromised, but the manner of performance may be modified by court order based upon the changed circumstances of the parties and the best interests of the children."

**DCSS Regulatory Framework:**
Under CCR Title 22, Division 13, the Department of Child Support Services implements statewide policies ensuring consistent application across all 58 counties. These regulations cover case establishment, paternity determination, support calculation, modification procedures, and enforcement mechanisms.

**Key Policy Areas:**
- **Case Establishment**: Family Code § 17400 requires DCSS to establish paternity and support orders
- **Modification Standards**: Family Code § 3651 allows modifications for "significant change of circumstances"
- **Interstate Cooperation**: California has adopted UIFSA 2008 for multi-state cases
- **Medical Support**: Family Code § 3751 mandates health insurance coverage when available

**Next Steps for General Inquiries:**
1. **Identify Your Specific Need**: Determine if you need establishment, modification, or enforcement services
2. **Contact Local DCSS**: Each county has a DCSS office providing free services to parents
3. **Gather Required Documents**: Prepare income documentation, custody orders, and identification
4. **Understand Your Rights**: Review DCSS publications explaining the process and your obligations

**Expert Annotation**: California's system is unique in its integration of state and county operations. While DCSS sets statewide policy, local agencies (LCSAs) handle day-to-day operations. This structure allows for state-level consistency while maintaining local flexibility, though it can sometimes create confusion for parents dealing with different counties.`;
    }

    return {
      answer: mockAnswer,
      citations: mockCitations,
      suggestions: mockSuggestions,
      request_id: `mock_${Date.now()}`
    };
  };

  const handleAISearch = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setAiResponse(null);

    // Simulate API delay
    setTimeout(() => {
      try {
        const response = getMockAIResponse(query);
        setAiResponse(response);
      } catch {
        setError('Failed to get AI response. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 1500);
  };

  const getSourceColor = (source: string) => {
    return source === 'California' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-teal" />
          <h3 className="text-lg font-semibold text-gray-900">CSDAI Policy Analysis</h3>
        </div>

        <button
          onClick={handleAISearch}
          disabled={!query.trim() || isLoading}
          className="px-4 py-2 bg-teal text-white rounded-lg hover:bg-teal/90 text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Analyze</span>
            </div>
          )}
        </button>
      </div>

      {!query.trim() && (
        <div className="text-center py-8 text-gray-500">
          <Sparkles className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Enter a search query to get comprehensive California child support policy analysis with embedded statutes and next-step guidance.</p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-red-900">Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {aiResponse && (
        <div className="space-y-6">
          {/* AI Answer */}
          {aiResponse.answer && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-2" />
                California AI Policy Analysis
              </h4>
              <div className="prose prose-sm max-w-none text-purple-800 whitespace-pre-line">
                {aiResponse.answer}
              </div>
            </div>
          )}

          {/* Citations */}
          {aiResponse.citations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">
                Referenced California Policies ({aiResponse.citations.length})
              </h4>
              <div className="space-y-3">
                {aiResponse.citations.slice(0, 5).map((citation, index) => (
                  <div key={citation.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-medium text-gray-500">#{index + 1}</span>
                        <h5 className="font-medium text-gray-900 text-sm">{citation.title}</h5>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(citation.source)}`}>
                          {citation.source}
                        </span>
                        <span className="text-xs text-gray-500">
                          {Math.round(citation.similarity * 100)}% match
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{citation.excerpt}</p>
                    
                    <Link
                      to={`/policy/${citation.id}`}
                      className="inline-flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>View Full Policy</span>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {aiResponse.suggestions.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <Lightbulb className="h-4 w-4 mr-2 text-yellow-600" />
                Related California Policy Questions
              </h4>
              <div className="space-y-2">
                {aiResponse.suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => onSuggestionClick(suggestion)}
                    className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 text-sm"
                  >
                    <div className="flex items-start space-x-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-gray-700">{suggestion}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Debug Info */}
          {aiResponse.request_id && (
            <div className="text-xs text-gray-400 text-center">
              Request ID: {aiResponse.request_id}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIPanel;