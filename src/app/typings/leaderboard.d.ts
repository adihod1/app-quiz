declare interface QuizLeadboard {
  name: string;
  score: number;
  date: number;
  numOfQuestiones: number;
}

declare type TableHeader = {
  name: string;
  sortField: keyof QuizLeadboard | 'rank';
  sortType: 'number' | 'string';
};

declare interface ExtendedQuizLeadboard extends QuizLeadboard {
  rank: number;
}
