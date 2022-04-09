declare interface QuizGameConfiguration {
  playerName: string;
  questions: Question[];
}

declare type QuizQuestions = {
  response_code: number;
  results: Question[];
};

declare type Question = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
  allAnswers?: string[];
  timeLimit?: number;
  usedTips?: (string | QUIZ_TIP_TYPE)[];
  disabledAnswers?: string[];
  imageLinks?: string[];
  tipImage?: string;
};

declare const enum QUIZ_TIP_TYPE {
  FIFTHY_FIFTHY = 'fifthy-fifthy',
  FIRST_LETTER = 'first-letter',
  IMAGE = 'show-image',
}

declare interface QuizTipObject {
  tip: QUIZ_TIP_TYPE;
  name: string;
  class?: string;
  used: boolean;
  weight: number;
}
