import { samplePolicies } from '../data/mockData';
import { Policy, SearchQuery } from '../types';

export const searchPolicies = (query: string): Policy[] => {
  if (!query.trim()) return [];

  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  
  // If no meaningful search terms, return all policies with lower scores
  if (searchTerms.length === 0) {
    return samplePolicies.map(policy => ({
      ...policy,
      relevance_score: 0.3
    }));
  }
  
  return samplePolicies
    .map(policy => {
      let score = 0;
      const content = (policy.title + ' ' + policy.content).toLowerCase();
      
      searchTerms.forEach(term => {
        const titleMatches = (policy.title.toLowerCase().match(new RegExp(term, 'g')) || []).length;
        const contentMatches = (content.match(new RegExp(term, 'g')) || []).length;
        
        score += titleMatches * 10 + contentMatches * 2;
      });
      
      // Add base score for any query to ensure results
      score += 5;
      
      return {
        ...policy,
        relevance_score: Math.min(0.99, Math.max(0.2, score / 100))
      };
    })
    .filter(policy => policy.relevance_score > 0.15)
    .sort((a, b) => b.relevance_score - a.relevance_score);
};

export const getQueryResponse = (query: string, mode: 'summary' | 'steps' = 'summary'): SearchQuery | null => {
  const normalizedQuery = query.toLowerCase();
  
  // Generate response based on query content
  const queryMatches = [
    {
      keywords: ['calculate', 'child support', 'children', 'calculation', 'income'],
      response: {
        summary: "Child support calculation methods vary by state, but most use either the Income Shares Model or Percentage of Income Model. The CSDA provides comprehensive guidelines and best practices for all state calculation methods, ensuring consistency and accuracy across jurisdictions.",
        steps: [
          "1. Identify the state's calculation model (Income Shares, Percentage of Income, or Melson Formula)",
          "2. Calculate each parent's gross income from all sources",
          "3. Apply state-specific deductions and adjustments",
          "4. Determine base support obligation using state guidelines",
          "5. Apply parenting time adjustments if applicable",
          "6. Add child-related expenses (childcare, health insurance, etc.)",
          "7. Calculate final support amount according to state formula",
          "8. Review for reasonableness and apply any necessary deviations"
        ],
        relevant_policies: ['1', '5']
      }
    },
    {
      keywords: ['enforcement', 'procedures', 'non-payment', 'collection', 'garnishment'],
      response: {
        summary: "Child support enforcement follows federal guidelines with state-specific implementations. The CSDA provides best practices for effective enforcement strategies, emphasizing income withholding as the primary tool, followed by various administrative and judicial remedies.",
        steps: [
          "1. Implement immediate income withholding for all new and modified orders",
          "2. Use Federal and State Tax Refund Offset programs for delinquent cases",
          "3. Report cases to credit bureaus and use Financial Institution Data Match",
          "4. Implement license suspension programs (driver's, professional, recreational)",
          "5. Use passport denial for cases with arrears over $2,500",
          "6. Employ asset seizure and property liens for substantial arrearages",
          "7. Coordinate interstate enforcement through UIFSA procedures",
          "8. Use contempt of court as enforcement tool of last resort"
        ],
        relevant_policies: ['2', '4']
      }
    },
    {
      keywords: ['interstate', 'case', 'requirements', 'different states', 'uifsa'],
      response: {
        summary: "Interstate child support cases follow UIFSA (Uniform Interstate Family Support Act) procedures. The CSDA provides comprehensive guidance on jurisdictional issues, two-state processing, and coordination between state programs to ensure effective interstate case management.",
        steps: [
          "1. Determine which state has continuing exclusive jurisdiction over the support order",
          "2. Register foreign support orders in responding states as needed",
          "3. Coordinate with Federal Office of Child Support Enforcement for interstate processing",
          "4. Implement two-state processing for income withholding across state lines",
          "5. Use CSDA best practices for interstate case coordination",
          "6. Follow UIFSA procedures for modifications and enforcement actions",
          "7. Maintain proper documentation and communication between state programs"
        ],
        relevant_policies: ['4', '2']
      }
    },
    {
      keywords: ['medical', 'support', 'health', 'insurance', 'healthcare'],
      response: {
        summary: "California medical support requirements ensure children have access to health insurance coverage. Under Family Code § 3751, the CSDA provides guidance on implementing medical support provisions, including the use of National Medical Support Notices and cost-sharing arrangements for uninsured medical expenses.",
        steps: [
          "1. Determine if either parent has access to health insurance through employment or group coverage in California",
          "2. Calculate if the coverage cost is 'reasonable' under California law (does not exceed 5% of the parent's gross income)",
          "3. Issue National Medical Support Notice (NMSN) to the employer to enroll the children",
          "4. Establish how uninsured medical expenses will be shared under California guidelines (typically proportional to income)",
          "5. Include dental and vision coverage if available at reasonable cost",
          "6. Set up procedures for reimbursement of medical expenses between parents",
          "7. Update California support order to reflect medical support obligations and cost-sharing arrangements"
        ],
        relevant_policies: ['5', '1']
      }
    },
    {
      keywords: ['modification', 'modify', 'change', 'income', 'review'],
      response: {
        summary: "Child support modifications require a significant change in circumstances. The CSDA provides best practices for modification procedures, including criteria for substantial changes, documentation requirements, and processing timelines to ensure fair and timely adjustments.",
        steps: [
          "1. Identify qualifying change in circumstances (20% income change, job loss, custody change, etc.)",
          "2. Gather required documentation: recent pay stubs (last 3 months), tax returns, court orders",
          "3. Complete and file modification request with appropriate child support agency",
          "4. Serve the other parent with notice of the modification request",
          "5. Attend any required hearings or conferences (process typically takes 60-90 days)",
          "6. If temporary modification needed due to emergency, request expedited review",
          "7. Obtain court approval for the final modification order (required even if parents agree)",
          "8. Note that modifications are prospective only - past arrearages cannot be retroactively modified"
        ],
        relevant_policies: ['3', '1']
      }
    },
    {
      keywords: ['technology', 'system', 'automation', 'data'],
      response: {
        summary: "Technology integration is essential for California's modern child support program. The CSDA provides guidance on California DCSS system implementations, data security, automation best practices, and technology standards to improve program efficiency and customer service.",
        steps: [
          "1. Assess current California DCSS technology infrastructure and identify gaps",
          "2. Implement automated income withholding and payment processing systems",
          "3. Establish secure data sharing protocols with California and federal partners",
          "4. Deploy customer self-service portals and mobile applications",
          "5. Integrate with California employer databases and financial institutions",
          "6. Implement automated enforcement tools and case management workflows",
          "7. Ensure compliance with federal security and privacy requirements",
          "8. Provide California DCSS staff training on new technology systems and processes"
        ],
        relevant_policies: ['4', '5']
      }
    }
  ];

  // Find matching response
  for (const match of queryMatches) {
    if (match.keywords.some(keyword => normalizedQuery.includes(keyword.toLowerCase()))) {
      return {
        summary: mode === 'summary' ? match.response.summary : match.response.summary,
        steps: match.response.steps,
        relevant_policies: match.response.relevant_policies
      };
    }
  }

  // Generate a generic response for unknown queries
  const policies = searchPolicies(query);
  if (policies.length > 0) {
    return {
      summary: `The CSDA database contains ${policies.length} relevant policies and best practices related to "${query}". These resources provide comprehensive guidance for child support professionals on this topic.`,
      steps: [
        '1. Review the relevant CSDA policies and best practices listed below',
        '2. Identify the specific requirements that apply to your jurisdiction',
        '3. Gather necessary documentation as specified',
        '4. Follow the procedures outlined in the CSDA guidelines',
        '5. Consult with CSDA resources or peer programs if clarification is needed',
        '6. Document your process for future reference and training'
      ],
      relevant_policies: policies.slice(0, 3).map(p => p.id)
    };
  }
  
  // Always return something for any query
  return {
    summary: `Your search for "${query}" has been processed. The CSDA maintains comprehensive resources on California child support policies and procedures. Please try refining your search terms or browse our California policy categories.`,
    steps: [
      '1. Try using more specific search terms related to California child support',
      '2. Browse the California CSDA policy categories for relevant topics',
      '3. Use keywords like "calculation", "enforcement", "modification", or "interstate"',
      '4. Contact California CSDA support if you need assistance finding specific information'
    ],
    relevant_policies: ['1', '2']
  };
};

export const highlightSearchTerms = (text: string, query: string): string => {
  if (!query) return text;
  
  const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 2);
  let highlightedText = text;
  
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<span class="ma-policy-highlight">$1</span>');
  });
  
  return highlightedText;
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};