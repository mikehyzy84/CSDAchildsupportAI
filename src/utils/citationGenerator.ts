import { Policy } from '../types';

export const generateCitation = (policy: Policy, format: 'apa' | 'mla' | 'chicago' = 'apa'): string => {
  const date = new Date(policy.effective_date);
  const year = date.getFullYear();
  const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  switch (format) {
    case 'apa':
      return `${policy.source === 'California' ? 'California Department of Child Support Services' : 'U.S. Department of Health and Human Services, Office of Child Support Enforcement'}. (${year}). ${policy.title} (${policy.document_number}). Retrieved from ${policy.url}`;
    
    case 'mla':
      return `"${policy.title}." ${policy.source === 'California' ? 'California Department of Child Support Services' : 'U.S. Department of Health and Human Services'}, ${formattedDate}. Web. ${new Date().toLocaleDateString()}.`;
    
    case 'chicago':
      return `${policy.source === 'California' ? 'California Department of Child Support Services' : 'U.S. Department of Health and Human Services'}. "${policy.title}." Document ${policy.document_number}. ${formattedDate}. ${policy.url}.`;
    
    default:
      return generateCitation(policy, 'apa');
  }
};

export const generateBibliography = (policies: Policy[], format: 'apa' | 'mla' | 'chicago' = 'apa'): string => {
  const citations = policies
    .sort((a, b) => a.title.localeCompare(b.title))
    .map(policy => generateCitation(policy, format));
  
  return citations.join('\n\n');
};