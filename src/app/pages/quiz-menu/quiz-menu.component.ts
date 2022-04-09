import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api-service.service';
import { EventsService } from 'src/app/services/events.service';
import { GoogleImageSearchService } from 'src/app/services/google-image-search.service';
import { OverlayService } from 'src/app/services/overlay-service.service';
import { StorageService } from 'src/app/services/storage-service.service';
import { htmlDecode } from 'src/app/utils/string-utils';

@Component({
  selector: 'app-quiz-menu',
  templateUrl: './quiz-menu.component.html',
  styleUrls: ['./quiz-menu.component.scss'],
})
export class QuizMenuComponent implements OnInit {
  public config: QuizConfiguration[] = [];
  public isGameRunning: boolean = false;
  public questions: Question[] = [];
  public playerName: string = '';

  public isNamePicked: boolean = false;

  private quizDifficultySelect: QuizDifficultyObject[] = [];

  constructor(
    private apiService: ApiService,
    private stogareService: StorageService,
    private overlay: OverlayService,
    private imageService: GoogleImageSearchService,
    private events: EventsService
  ) {}

  ngOnInit(): void {
    this.playerName = this.stogareService.getLatestPlayerName();
    this.initQuizNumberOfQuestionConfiguration();
    this.initQuizTypeConfiguration();
    this.initQuizDifficultyConfiguration();
    this.initQuizCategoriesConfiguration();
  }

  private initQuizDifficultyConfiguration(): void {
    const difficultyTypeConfiguration: QuizConfiguration<QUIZ_OPTION_TYPE.QUIZ_DIFFICULTY> =
      {
        type: QUIZ_OPTION_TYPE.QUIZ_DIFFICULTY,
        label: 'Quiz Difficulty',
        placeholder: 'Please Select Quiz Difficulty',
        settings: {
          singleSelection: true,
          idField: 'id',
          textField: 'text',
          enableCheckAll: false,
          allowSearchFilter: false,
        },
        data: [
          { id: '*', text: 'Any difficulty' },
          { id: 'easy', text: 'Easy' },
          { id: 'medium', text: 'Medium' },
          { id: 'hard', text: 'Hard' },
        ],
        selectedData: '*',
      };
    this.config.push(difficultyTypeConfiguration);
  }

  private initQuizTypeConfiguration(): void {
    const quizTypeConfiguration: QuizConfiguration<QUIZ_OPTION_TYPE.QUIZ_TYPE> =
      {
        type: QUIZ_OPTION_TYPE.QUIZ_TYPE,
        label: 'Quiz Type',
        placeholder: 'Please Select Quiz Type',
        settings: {
          singleSelection: true,
          idField: 'id',
          textField: 'text',
          enableCheckAll: false,
          allowSearchFilter: false,
        },
        data: [
          { id: '*', text: 'Any Type' },
          { id: 'boolean', text: 'True / False' },
          { id: 'multiple', text: 'Multiple Choice' },
        ],
        selectedData: '*',
      };
    this.config.push(quizTypeConfiguration);
  }

  private async initQuizCategoriesConfiguration(): Promise<void> {
    this.overlay.start();
    try {
      const categories = await this.apiService.getCategories();
      const categoriesConfiguration: QuizConfiguration<QUIZ_OPTION_TYPE.QUIZ_CATEGORY> =
        {
          type: QUIZ_OPTION_TYPE.QUIZ_CATEGORY,
          label: 'Quiz Categories',
          placeholder: 'Please Select Quiz Categories',
          settings: {
            singleSelection: true,
            idField: 'id',
            textField: 'text',
            enableCheckAll: false,
            allowSearchFilter: false,
          },
          data: [
            { id: '*', text: 'Any Category' },
            ...categories.map((cat) => ({
              id: cat.id,
              text: cat.name,
            })),
          ],
          selectedData: '*',
        };
      this.config.push(categoriesConfiguration);
    } catch (e) {
      console.error(e);
    }
    this.overlay.stop();
  }

  private initQuizNumberOfQuestionConfiguration(): void {
    const NumberOfQuestionConfiguration: QuizConfiguration<QUIZ_OPTION_TYPE.QUIZ_NUMBER_OF_QUESTIONS> =
      {
        type: QUIZ_OPTION_TYPE.QUIZ_NUMBER_OF_QUESTIONS,
        label: 'Quiz Number Of Questions',
        settings: {
          singleSelection: true,
          idField: 'id',
          textField: 'text',
          enableCheckAll: false,
          allowSearchFilter: false,
        },
        data: [
          { id: 5, text: '5' },
          { id: 10, text: '10' },
          { id: 20, text: '20' }
        ],
        selectedData: 5,
      };
    this.config.push(NumberOfQuestionConfiguration);
  }

  public onItemSelect(item: any) {
    console.log(this.config);
    console.log(this.quizDifficultySelect);
  }
  public onSelectAll(items: any) {
    console.log(items);
  }

  public onClickNext(): void {
    this.isNamePicked = true;
    this.stogareService.saveLatestPlayerName(this.playerName);
    this.events.notify(APP_EVENT_TOPIC.NAME_CHANGED, this.playerName);
  }

  public onClickBack(): void {
    this.isNamePicked = false;
  }

  public async onClickStart(): Promise<void> {
    this.overlay.start();

    const quizDifficulty = this.config.find(
      (obj) => obj.type == QUIZ_OPTION_TYPE.QUIZ_DIFFICULTY
    );
    const quizType = this.config.find(
      (obj) => obj.type == QUIZ_OPTION_TYPE.QUIZ_TYPE
    );
    const quizCategory = this.config.find(
      (obj) => obj.type == QUIZ_OPTION_TYPE.QUIZ_CATEGORY
    );
    const quizNumberOfQuestions = this.config.find(
      (obj) => obj.type == QUIZ_OPTION_TYPE.QUIZ_NUMBER_OF_QUESTIONS
    );

    try {
      const getQuestions = await this.apiService.getQuestions({
        difficulty: this.setUrlParam(quizDifficulty?.selectedData!),
        type: this.setUrlParam(quizType?.selectedData!),
        category: this.setUrlParam(quizCategory?.selectedData!),
        amount: this.setUrlParam(quizNumberOfQuestions?.selectedData!),
      });
      console.log(getQuestions);

      if (!getQuestions || getQuestions.response_code != 0) {
        console.error('questions undefined');
        return;
      }

      this.questions = getQuestions.results;
      //sanitize html &&
      this.questions.forEach((q) => {
        q.question = htmlDecode(q.question) || q.question;
        q.correct_answer = htmlDecode(q.correct_answer) || q.correct_answer;
        q.incorrect_answers = q.incorrect_answers.map(
          (a) => htmlDecode(a) || a
        );
      });

      const imagesPromises: Promise<string[]>[] = [];
      this.questions.forEach((q) =>
        imagesPromises.push(
          this.imageService
            .getImageURLsByKeywords(q.question)
            .then((links) => (q.imageLinks = links))
        )
      );
      await Promise.all(imagesPromises);

      this.isGameRunning = true;
    } catch (e) {
      console.error(e);
    }

    this.overlay.stop();
  }

  public gameEndListener(score: number): void {
    this.isGameRunning = false;
  }

  private setUrlParam(
    id: QuizObject<string | number>['id']
  ): string | undefined {
    if (!id || id == '*') {
      return;
    }
    return String(id);
  }
}
