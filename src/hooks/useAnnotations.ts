import { useState, useCallback } from 'react';
import { Annotation } from '../types';
import { sampleAnnotations } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

export const useAnnotations = () => {
  const [annotations, setAnnotations] = useState<Annotation[]>(sampleAnnotations);
  const { user } = useAuth();

  const addAnnotation = useCallback((
    policyId: string,
    textSelection: string,
    note: string,
    type: 'Personal' | 'Team Shared' | 'Knowledge Base' = 'Team Shared'
  ) => {
    if (!user) return;

    const newAnnotation: Annotation = {
      id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      policy_id: policyId,
      user_id: user.id,
      user_name: user.name,
      text_selection: textSelection,
      note: note,
      type: type,
      status: type === 'Personal' ? 'Approved' : 'Pending Approval',
      created_at: new Date().toISOString()
    };

    setAnnotations(prev => [...prev, newAnnotation]);
    return newAnnotation;
  }, [user]);

  const approveAnnotation = useCallback((annotationId: string) => {
    if (!user) return;

    setAnnotations(prev => prev.map(annotation => 
      annotation.id === annotationId 
        ? {
            ...annotation,
            status: 'Approved' as const,
            approved_by: user.id,
            approved_at: new Date().toISOString()
          }
        : annotation
    ));
  }, [user]);

  const rejectAnnotation = useCallback((annotationId: string) => {
    setAnnotations(prev => prev.filter(annotation => annotation.id !== annotationId));
  }, []);

  const getPendingAnnotations = useCallback(() => {
    return annotations.filter(annotation => annotation.status === 'Pending Approval');
  }, [annotations]);

  const getAnnotationsForPolicy = useCallback((policyId: string) => {
    return annotations.filter(annotation => annotation.policy_id === policyId);
  }, [annotations]);

  return {
    annotations,
    addAnnotation,
    approveAnnotation,
    rejectAnnotation,
    getPendingAnnotations,
    getAnnotationsForPolicy
  };
};