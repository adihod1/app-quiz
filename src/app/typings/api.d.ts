declare type ApiCategoriesResponse = {
  trivia_categories: ApiCategoryResponse[];
};

declare type ApiCategoryResponse = {
  id: number;
  name: string;
};
