// Re-exporta o contexto de feedback para compatibilidade com código existente
export { 
  useFeedbackContext as useFeedback,
  FeedbackType,
  type FeedbackOptions,
} from '@/src/contexts/FeedbackContext';