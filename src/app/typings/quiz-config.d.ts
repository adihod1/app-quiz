declare type QuizConfiguration<T extends QUIZ_OPTION_TYPE = any> = {
  type: T;
  label: string;
  placeholder?: string;
  settings: QuizConfigurationSettings;
  data: QuizDataResolver[T];
  selectedData: QuizObject<string | number>['id'];
};

declare const enum QUIZ_OPTION_TYPE {
  QUIZ_DIFFICULTY = 'difficulty',
  QUIZ_TYPE = 'type',
  QUIZ_CATEGORY = 'category',
  QUIZ_NUMBER_OF_QUESTIONS = 'numberOfQuestions',
}

declare interface QuizDataResolver {
  [QUIZ_OPTION_TYPE.QUIZ_DIFFICULTY]: QuizDifficultyObject[];
  [QUIZ_OPTION_TYPE.QUIZ_TYPE]: QuizTypeObject[];
  [QUIZ_OPTION_TYPE.QUIZ_CATEGORY]: QuizCategoryObject[];
  [QUIZ_OPTION_TYPE.QUIZ_NUMBER_OF_QUESTIONS]: QuizNumberOfQuestionsObject[];
}

declare type QuizDifficultyId = 'easy' | 'medium' | 'hard';
declare type QuizTypeId = 'boolean' | 'multiple';
declare type QuizCategoryId = number; //fetched from api dynamically
declare type QuizNumberOfQuestionsId = number;

declare interface QuizObject<T extends string | number> {
  id: T | `*`;
  text: string;
}

declare interface QuizDifficultyObject extends QuizObject<QuizDifficultyId> {}
declare interface QuizTypeObject extends QuizObject<QuizTypeId> {}
declare interface QuizCategoryObject extends QuizObject<QuizCategoryId> {}
declare interface QuizNumberOfQuestionsObject
  extends QuizObject<QuizNumberOfQuestionsId> {}

declare interface ApiGetQuestionsOptions {
  difficulty?: string;
  type?: string;
  category?: string;
  amount?: string;
}

declare interface QuizConfigurationSettings {
  singleSelection?: boolean;
  idField?: string;
  textField?: string;
  disabledField?: string;
  enableCheckAll?: boolean;
  selectAllText?: string;
  unSelectAllText?: string;
  allowSearchFilter?: boolean;
  clearSearchFilter?: boolean;
  maxHeight?: number;
  itemsShowLimit?: number;
  limitSelection?: number;
  searchPlaceholderText?: string;
  noDataAvailablePlaceholderText?: string;
  noFilteredDataAvailablePlaceholderText?: string;
  closeDropDownOnSelection?: boolean;
  showSelectedItemsAtTop?: boolean;
  defaultOpen?: boolean;
  allowRemoteDataSearch?: boolean;
}
