export interface UserQuestionAnswer {
  selected: string[];
  custom?: string;
  intent?: 'clarification';
}

export interface UserQuestionOption {
  label: string;
  description?: string;
}
