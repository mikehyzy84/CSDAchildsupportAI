export interface Policy {
  id: string;
  source: 'California' | 'Federal' | 'County';
  title: string;
  document_number: string;
  effective_date: string;
  content: string;
  url: string;
  relevance_score: number;
}

export interface SearchQuery {
  summary: string;
  steps: string[];
  relevant_policies: string[];
}

export interface Annotation {
  id: string;
  policy_id: string;
  user_id: string;
  user_name: string;
  text_selection: string;
  note: string;
  type: 'Personal' | 'Team Shared' | 'Knowledge Base';
  status: 'Draft' | 'Pending Approval' | 'Approved';
  created_at: string;
  approved_by?: string;
  approved_at?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Worker' | 'Supervisor' | 'Manager' | 'Admin';
  county?: string;
  active: boolean;
  profile_picture?: string;
  created_at?: string;
  last_login?: string;
}

export interface SearchMode {
  mode: 'summary' | 'steps';
}

export interface Citation {
  id: number;
  title: string;
  section: string;
  source: string;
  url: string | null;
}

export interface Message {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: Citation[];
}

export interface Analytics {
  total_searches_today: number;
  total_searches_week: number;
  total_searches_month: number;
  top_searches: { query: string; count: number }[];
  user_activity: { date: string; searches: number }[];
}

export interface CountyInfo {
  name: string;
  code: string;
  population: number;
  caseload: number;
  office_address: string;
  phone: string;
  website: string;
  special_programs: string[];
}

export interface CountyReport {
  county: CountyInfo;
  title: string;
  executive_summary: string;
  legal_framework: string;
  establishment_procedures: string;
  modification_procedures: string;
  enforcement_procedures: string;
  next_steps: string[];
  annotations: string[];
  generated_date: string;
}