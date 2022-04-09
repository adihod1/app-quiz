import { Injectable } from '@angular/core';
import { objectToQuerystring } from '../utils/url-helpers';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly endpoint: string = 'https://opentdb.com/';

  constructor() {}

  public async getCategories(): Promise<ApiCategoryResponse[]> {
    const response = await fetch(this.endpoint + 'api_category.php');
    const json = (await response.json()) as ApiCategoriesResponse;
    return json.trivia_categories;
  }

  public async getQuestions(params: ApiGetQuestionsOptions): Promise<QuizQuestions> {
    const queryString = objectToQuerystring(params);
    const response = await fetch(this.endpoint + `api.php${queryString}`);
    const json = (await response.json()) as QuizQuestions;
    return json;
  }
}
