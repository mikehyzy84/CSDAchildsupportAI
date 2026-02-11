import { Policy, Annotation, User, CountyInfo } from '../types';

export const samplePolicies: Policy[] = [
  {
    id: '1',
    source: 'California',
    title: 'California Family Code § 4053 et seq.',
    document_number: 'FC-4053',
    effective_date: '2024-01-01',
    content: 'California Family Code § 4053 et seq. provides definitions, scope, and authority over child support. This foundational statute establishes the legal framework for child support in California, defining key terms and establishing the authority of courts and agencies to establish, modify, and enforce child support orders. The code outlines the principles that guide child support determination, including the best interests of the child and the responsibility of both parents to support their children according to their circumstances and station in life.',
    url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=4053',
    relevance_score: 0.95
  },
  {
    id: '2',
    source: 'California',
    title: 'Family Code § 4054 - Guideline Review Mandate',
    document_number: 'FC-4054',
    effective_date: '2024-01-01',
    content: 'Family Code § 4054 mandates periodic review of the statewide uniform child support guideline. This statute requires regular evaluation and updating of California\'s child support guidelines to ensure they remain current with economic conditions and reflect the actual cost of raising children. The review process involves comprehensive analysis of economic data, public input, and legislative consideration to maintain fair and appropriate support levels.',
    url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=FAM&sectionNum=4054',
    relevance_score: 0.88
  },
  {
    id: '3',
    source: 'California',
    title: 'CCR Title 22, Division 13: DCSS Regulations',
    document_number: 'CCR-22-13',
    effective_date: '2024-01-01',
    content: 'California Code of Regulations, Title 22, Division 13 contains regulations implementing Department of Child Support Services (DCSS) authority. These comprehensive regulations detail the operational procedures, administrative requirements, and implementation standards for California\'s child support program. The regulations cover case management procedures, enforcement mechanisms, interstate cooperation, and administrative processes that govern how local child support agencies operate under state and federal standards.',
    url: 'https://govt.westlaw.com/calregs/Browse/Home/California/CaliforniaCodeofRegulations?guid=I6E01C3F0D48411DEBC02831C6D6C108E&originationContext=documenttoc&transitionType=Default&contextData=(sc.Default)',
    relevance_score: 0.85
  },
  {
    id: '4',
    source: 'California',
    title: 'Current Child Support Policies Catalog',
    document_number: 'DCSS-POL-2024',
    effective_date: '2024-01-01',
    content: 'Current Child Support Policies provide a comprehensive catalog of DCSS\'s operational policies including data match policies, complaint resolution procedures, and case management protocols. This resource serves as the central repository for all active policies governing California\'s child support program operations. Policies cover areas such as case establishment, paternity determination, support calculation, enforcement procedures, and customer service standards.',
    url: 'https://childsup.ca.gov/resources/',
    relevance_score: 0.82
  },
  {
    id: '5',
    source: 'California',
    title: 'Policy Consolidation (CSSP Letter 18-10)',
    document_number: 'CSSP-18-10',
    effective_date: '2018-10-01',
    content: 'Policy Consolidation (CSSP Letter 18-10) provides an index and consolidation of program policies maintained by DCSS. This comprehensive document serves as a master reference for all active child support policies, organizing them by topic and providing cross-references to related procedures. The consolidation helps ensure consistent policy implementation across all local child support agencies and provides a single source for policy research and reference.',
    url: 'https://childsup.ca.gov/resources/',
    relevance_score: 0.80
  },
  {
    id: '6',
    source: 'California',
    title: 'CSSP Letter 19-01: Confidential Information Handling',
    document_number: 'CSSP-19-01',
    effective_date: '2019-01-01',
    content: 'CSSP Letter 19-01 establishes policy on forwarding court documents containing confidential information. This directive provides specific guidance on handling sensitive documents to protect privacy while ensuring proper case processing. The policy outlines procedures for redacting confidential information, secure transmission methods, and access controls to maintain the integrity of sensitive case information.',
    url: 'https://childsup.ca.gov/resources/',
    relevance_score: 0.75
  },
  {
    id: '7',
    source: 'California',
    title: 'Division 12: Administrative Standards for State IV-D Agency',
    document_number: 'DIV-12-2024',
    effective_date: '2024-01-01',
    content: 'Division 12 contains administrative standards for State IV-D Agency operations, providing technical rules on how local child support agencies must operate under state and federal standards. These standards ensure compliance with federal requirements while maintaining operational efficiency. The standards cover performance metrics, reporting requirements, case processing timelines, and quality assurance measures.',
    url: 'https://childsup.ca.gov/resources/',
    relevance_score: 0.78
  },
  {
    id: '8',
    source: 'California',
    title: 'Review of Statewide Uniform Child Support Guideline 2021',
    document_number: 'GUIDELINE-REV-2021',
    effective_date: '2021-12-31',
    content: 'Review of the Statewide Uniform Child Support Guideline 2021 is a legislatively mandated review with recommendations for adjustments. This comprehensive analysis examines the effectiveness of current guidelines, economic factors affecting child support, and recommendations for future modifications. The review includes statistical analysis, stakeholder input, and comparative studies to ensure guidelines remain fair and adequate.',
    url: 'https://www.courts.ca.gov/documents/child-support-guideline-review-2021.pdf',
    relevance_score: 0.90
  },
  {
    id: '9',
    source: 'California',
    title: 'Child Support Guidelines (Statewide Uniform Guidelines)',
    document_number: 'UNIFORM-GUIDE-2024',
    effective_date: '2024-01-01',
    content: 'Child Support Guidelines (Statewide Uniform Guidelines) are used by courts and agencies to calculate support orders. These guidelines provide the mathematical formulas and procedures for determining appropriate child support amounts based on both parents\' incomes, custody arrangements, and other relevant factors. The guidelines ensure consistency in support calculations across all California jurisdictions.',
    url: 'https://www.courts.ca.gov/selfhelp-support.htm',
    relevance_score: 0.92
  },
  {
    id: '10',
    source: 'California',
    title: 'CA Child Support Services Publications',
    document_number: 'DCSS-PUB-2024',
    effective_date: '2024-01-01',
    content: 'Publications by CA Child Support Services include brochures covering case process, payment procedures, rights and responsibilities, and other public information materials. These resources provide accessible information to parents and the public about California\'s child support program, explaining services available, how to apply, payment options, and rights and responsibilities of all parties involved.',
    url: 'https://childsup.ca.gov/resources/',
    relevance_score: 0.70
  },
  {
    id: '11',
    source: 'Federal',
    title: '45 CFR Part 302 - State Plan Requirements',
    document_number: '45-CFR-302',
    effective_date: '2024-01-01',
    content: 'Federal regulations establishing state plan requirements for child support enforcement programs. These regulations outline the mandatory elements that each state must include in their Title IV-D plan, including organizational structure, staffing requirements, case management procedures, and performance standards. States must demonstrate compliance with these requirements to receive federal funding.',
    url: 'https://www.ecfr.gov/current/title-45/subtitle-B/chapter-III/part-302',
    relevance_score: 0.88
  },
  {
    id: '12',
    source: 'Federal',
    title: '45 CFR Part 303 - Standards for Program Operations',
    document_number: '45-CFR-303',
    effective_date: '2024-01-01',
    content: 'Federal standards governing child support program operations including case establishment, paternity determination, support order establishment and modification, and enforcement procedures. These regulations provide detailed requirements for how states must operate their child support programs to ensure consistency and effectiveness across all jurisdictions.',
    url: 'https://www.ecfr.gov/current/title-45/subtitle-B/chapter-III/part-303',
    relevance_score: 0.92
  },
  {
    id: '13',
    source: 'Federal',
    title: 'UIFSA (Uniform Interstate Family Support Act)',
    document_number: 'UIFSA-2008',
    effective_date: '2008-01-01',
    content: 'The Uniform Interstate Family Support Act provides the legal framework for interstate child support cases. UIFSA establishes jurisdictional rules, procedures for interstate enforcement, and requirements for cooperation between states. All states have adopted UIFSA to ensure effective handling of cases involving parents in different states.',
    url: 'https://www.acf.hhs.gov/css/policy-guidance/uniform-interstate-family-support-act-uifsa',
    relevance_score: 0.90
  },
  {
    id: '14',
    source: 'Federal',
    title: 'Federal Parent Locator Service (FPLS) Procedures',
    document_number: 'FPLS-PROC-2024',
    effective_date: '2024-01-01',
    content: 'Procedures for accessing and using the Federal Parent Locator Service to locate non-custodial parents and their assets. The FPLS provides access to federal databases including Social Security, IRS, and other federal agency records to assist in locating parents and establishing paternity and support orders.',
    url: 'https://www.acf.hhs.gov/css/partners/state-and-tribal-child-support-programs/systems/federal-parent-locator-service',
    relevance_score: 0.85
  },
  {
    id: '15',
    source: 'Federal',
    title: 'Federal Tax Refund Offset Program Guidelines',
    document_number: 'FTR-OFFSET-2024',
    effective_date: '2024-01-01',
    content: 'Guidelines for the Federal Tax Refund Offset Program, which intercepts federal tax refunds to collect past-due child support. The program requires specific procedures for case certification, debtor notification, and distribution of collected funds. States must follow federal requirements for participating in this enforcement tool.',
    url: 'https://www.acf.hhs.gov/css/partners/state-and-tribal-child-support-programs/enforcement/federal-tax-refund-offset',
    relevance_score: 0.87
  },
  {
    id: '16',
    source: 'Federal',
    title: 'National Medical Support Notice (NMSN) Requirements',
    document_number: 'NMSN-REQ-2024',
    effective_date: '2024-01-01',
    content: 'Federal requirements for the National Medical Support Notice, which is used to enforce medical support obligations. The NMSN allows child support agencies to require employers to enroll children in available health insurance coverage. Employers must respond within specific timeframes and follow federal procedures.',
    url: 'https://www.acf.hhs.gov/css/partners/employers/national-medical-support-notice',
    relevance_score: 0.83
  },
  {
    id: '17',
    source: 'County',
    title: 'Los Angeles County Child Support Services Implementation Guide',
    document_number: 'LA-COUNTY-2024',
    effective_date: '2024-01-01',
    content: 'Los Angeles County operates the largest child support program in California, serving over 285,000 cases. This guide covers LA County-specific procedures for case establishment, modification, and enforcement. Includes information on multilingual services, self-service kiosks, and mobile outreach programs unique to LA County operations.',
    url: 'https://dcss.lacounty.gov',
    relevance_score: 0.88
  },
  {
    id: '18',
    source: 'County',
    title: 'San Diego County Border Services and Military Family Support',
    document_number: 'SD-COUNTY-2024',
    effective_date: '2024-01-01',
    content: 'San Diego County child support services include specialized programs for border communities and military families. This guide covers unique procedures for international cases, military deployment considerations, and coordination with federal installations. Includes tribal coordination procedures and bilingual service delivery.',
    url: 'https://www.sandiegocounty.gov/content/sdc/hhsa/programs/cs.html',
    relevance_score: 0.85
  },
  {
    id: '19',
    source: 'County',
    title: 'Orange County Vietnamese Services and Court Liaison Program',
    document_number: 'OR-COUNTY-2024',
    effective_date: '2024-01-01',
    content: 'Orange County provides specialized Vietnamese language services and maintains a dedicated court liaison program. This guide covers culturally appropriate service delivery, interpreter services, and streamlined court coordination procedures. Includes employer outreach programs targeting major Orange County industries.',
    url: 'https://www.ochealthinfo.com/services-programs/child-support-services',
    relevance_score: 0.82
  }
];


export const sampleAnnotations: Annotation[] = [
  {
    id: '1',
    policy_id: '1',
    user_id: 'user1',
    user_name: 'Sarah Johnson',
    text_selection: 'Parenting time adjustments apply when one parent has the children for more than 33% of the time',
    note: 'Important: This threshold is strictly enforced. Must have court-ordered parenting schedule documenting the time allocation.',
    type: 'Team Shared',
    status: 'Approved',
    created_at: '2024-01-15T10:30:00Z',
    approved_by: 'supervisor1',
    approved_at: '2024-01-16T09:15:00Z'
  },
  {
    id: '2',
    policy_id: '2',
    user_id: 'user2',
    user_name: 'Michael Chen',
    text_selection: 'passport denial for arrears over $2,500',
    note: 'Processing time for passport denial is typically 2-3 weeks through State Department interface.',
    type: 'Knowledge Base',
    status: 'Approved',
    created_at: '2024-01-10T14:20:00Z',
    approved_by: 'manager1',
    approved_at: '2024-01-12T11:00:00Z'
  },
  {
    id: '3',
    policy_id: '3',
    user_id: 'user3',
    user_name: 'Lisa Rodriguez',
    text_selection: 'Form CSE-MOD with supporting documentation',
    note: 'Remind parents to include last 3 months of pay stubs, not just current month.',
    type: 'Personal',
    status: 'Draft',
    created_at: '2024-01-20T16:45:00Z'
  }
];

export const sampleUsers: User[] = [
  {
    id: 'user1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@dcss.ca.gov',
    role: 'Supervisor',
    active: true
  },
  {
    id: 'user2',
    name: 'Michael Chen',
    email: 'michael.chen@dcss.ca.gov',
    role: 'Worker',
    active: true
  },
  {
    id: 'user3',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@dcss.ca.gov',
    role: 'Worker',
    active: true
  },
  {
    id: 'user4',
    name: 'David Williams',
    email: 'david.williams@dcss.ca.gov',
    role: 'Manager',
    active: true
  },
  {
    id: 'admin1',
    name: 'Jennifer Davis',
    email: 'jennifer.davis@dcss.ca.gov',
    role: 'Admin',
    active: true
  }
];

export const californiaCounties: CountyInfo[] = [
  {
    name: 'Los Angeles',
    code: 'LA',
    population: 10014009,
    caseload: 285000,
    office_address: '3530 Wilshire Blvd, Suite 300, Los Angeles, CA 90010',
    phone: '(866) 901-3212',
    website: 'https://dcss.lacounty.gov',
    special_programs: ['Multilingual Services', 'Self-Service Kiosks', 'Mobile Outreach']
  },
  {
    name: 'San Diego',
    code: 'SD',
    population: 3298634,
    caseload: 95000,
    office_address: '1255 Imperial Ave, Suite 1000, San Diego, CA 92101',
    phone: '(866) 901-3212',
    website: 'https://www.sandiegocounty.gov/content/sdc/hhsa/programs/cs.html',
    special_programs: ['Border Services', 'Military Family Support', 'Tribal Coordination']
  },
  {
    name: 'Orange',
    code: 'OR',
    population: 3186989,
    caseload: 78000,
    office_address: '1055 N Main St, Santa Ana, CA 92701',
    phone: '(866) 901-3212',
    website: 'https://www.ochealthinfo.com/services-programs/child-support-services',
    special_programs: ['Vietnamese Services', 'Court Liaison Program', 'Employer Outreach']
  },
  {
    name: 'Riverside',
    code: 'RV',
    population: 2418185,
    caseload: 72000,
    office_address: '10281 Kidd St, Riverside, CA 92503',
    phone: '(866) 901-3212',
    website: 'https://www.rivcoda.org/services/child-support-services',
    special_programs: ['Desert Region Services', 'Agricultural Worker Support', 'Coachella Valley Office']
  },
  {
    name: 'San Bernardino',
    code: 'SB',
    population: 2181654,
    caseload: 68000,
    office_address: '412 W Hospitality Ln, San Bernardino, CA 92415',
    phone: '(866) 901-3212',
    website: 'https://hss.sbcounty.gov/css/',
    special_programs: ['High Desert Services', 'Mountain Communities Outreach', 'Transitional Housing Support']
  },
  {
    name: 'Inyo',
    code: 'IN',
    population: 19016,
    caseload: 450,
    office_address: '207 W South St, Bishop, CA 93514',
    phone: '(760) 873-7881',
    website: 'https://www.inyocounty.us/services/health-human-services/child-support-services',
    special_programs: ['Rural Outreach', 'Eastern Sierra Services', 'Mono County Coordination']
  },
  {
    name: 'Kern',
    code: 'KE',
    population: 900202,
    caseload: 28000,
    office_address: '5357 Truxtun Ave, Bakersfield, CA 93309',
    phone: '(866) 901-3212',
    website: 'https://www.kerncounty.com/government/human-services/child-support-services',
    special_programs: ['Agricultural Community Services', 'Oil Industry Worker Support', 'Delano Field Office']
  }
];