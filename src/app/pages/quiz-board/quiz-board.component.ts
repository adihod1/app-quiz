import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { timingSafeEqual } from 'crypto';
import { ConfettiService } from 'src/app/services/confetti-service.service';
import { EventsService } from 'src/app/services/events.service';
import { FlyingTextService } from 'src/app/services/flying-text.service';
import { GoogleImageSearchService } from 'src/app/services/google-image-search.service';
import { StorageService } from 'src/app/services/storage-service.service';
import { capitalizeText } from 'src/app/utils/string-utils';

@Component({
  selector: 'app-quiz-board',
  templateUrl: './quiz-board.component.html',
  styleUrls: ['./quiz-board.component.scss'],
})
export class QuizBoardComponent implements OnInit, OnDestroy {
  @Input() gameConfig!: QuizGameConfiguration;
  @Output() onGameEnd: EventEmitter<any> = new EventEmitter();
  private readonly MULTIPLE_TIME_LIMIT_SEC: number = 30;
  private readonly BOOLEAN_TIME_LIMIT_SEC: number = 15;

  public questions: Question[] = [];
  public question!: Question;
  public questionTimeLeft!: number;
  public questionIndex: number = 0;
  public totalScore: number = 0;
  public isGameEnded: boolean = false;
  public gameTips: QuizTipObject[] = [
    {
      tip: QUIZ_TIP_TYPE.FIFTHY_FIFTHY,
      name: '50/50',
      used: false,
      weight: 10,
      class: 'fa fa-percent',
    },
    {
      tip: QUIZ_TIP_TYPE.FIRST_LETTER,
      name: 'Show First Letter',
      used: false,
      weight: 20,
      class: 'fa fa-font',
    },
    {
      tip: QUIZ_TIP_TYPE.IMAGE,
      name: 'Show Image',
      used: false,
      weight: 15,
      class: 'fa fa-picture-o',
    },
  ];

  public usedTips: string[] = [];
  public capitalizeText = capitalizeText;

  private questionTimeTimeout: number = 0;
  private questionTimeInterval: number = 0;

  constructor(
    private stogareService: StorageService,
    private imageService: GoogleImageSearchService,
    private confetti: ConfettiService,
    private flyingMessage: FlyingTextService,
    private events: EventsService
  ) {}

  ngOnInit(): void {
    this.questions = this.gameConfig.questions;
    if (!this.questions) {
      console.error('questions undefined');
    }
    console.log('quiz-board', this.questions);
    this.gameHandler();
  }

  ngOnDestroy(): void {
    this.confetti.stop();
  }

  private gameHandler(): void {
    if (this.questionIndex + 1 > this.questions.length) {
      return this.endGame();
    }
    this.prepareQuestion();
  }

  private prepareQuestion(): void {
    this.question = {
      category: this.questions[this.questionIndex].category,
      correct_answer: this.questions[this.questionIndex].correct_answer,
      difficulty: this.questions[this.questionIndex].difficulty,
      incorrect_answers: this.questions[this.questionIndex].incorrect_answers,
      question: this.questions[this.questionIndex].question,
      type: this.questions[this.questionIndex].type,
      allAnswers: this.getAllAnswers(),
      disabledAnswers: [],
      usedTips: [],
      imageLinks: this.questions[this.questionIndex].imageLinks || [],
      timeLimit:
        this.questions[this.questionIndex].type == 'boolean'
          ? this.BOOLEAN_TIME_LIMIT_SEC
          : this.MULTIPLE_TIME_LIMIT_SEC,
    };
    this.questionIndex++;

    this.startTimer();
  }

  public endGame(): void {
    this.isGameEnded = true;
    this.isNewHighestScore();
    const newScoreObject: QuizLeadboard = {
      name: this.gameConfig.playerName,
      score: this.totalScore,
      date: Date.now(),
      numOfQuestiones: this.questions.length,
    };
    this.stogareService.addToLeaderboard(newScoreObject);
    this.events.notify(APP_EVENT_TOPIC.ADDED_SCORE, newScoreObject);
  }

  public onAnswerClick(answer: string): void {
    const score = this.calcScore(answer);
    if (score != 0) {
      this.changeScore(score);
    } else {
      this.flyingMessage.popMessage('Wrong Answer', {
        color: 'red',
        size: 40,
        left: 60,
        top: 30,
      });
    }
    this.stopTimer();
    this.gameHandler();
  }

  private changeScore(num: number): void {
    const prefix = num >= 0 ? '+' : '-';
    const message = `${prefix}${Math.abs(num)}`;
    this.totalScore += num;

    const color = num > 0 ? 'light-green' : 'red';

    this.flyingMessage.popMessage(message, {
      color,
      size: 50,
      left: 64,
      top: 30,
    });
  }

  public onTipClickSelect(tip: QuizTipObject): void {
    tip.used = true;
    this.changeScore(-tip.weight);
    this.question.usedTips!.push(tip.tip);
    this.usedTips.push(tip.name);

    switch (tip.tip) {
      case QUIZ_TIP_TYPE.FIFTHY_FIFTHY:
        this.handleFifthyTip();
        break;
      case QUIZ_TIP_TYPE.FIRST_LETTER:
        this.handleFirstLetterTip();
        break;
      case QUIZ_TIP_TYPE.IMAGE:
        this.handleImageTip();
        break;
    }
  }

  public onStartOverClick(): void {
    this.onGameEnd.emit(this.totalScore);
  }

  private isNewHighestScore(): void {
    const highestScore = this.stogareService.getHighestScore();
    if (this.totalScore > highestScore) {
      this.flyingMessage.popMessage('New High Score!', {
        color: 'pink',
        size: 80,
        left: 35,
        top: 40,
        timeoutMs: 6000,
      });
      this.confetti.start(1000 * 5);
    }
  }

  private handleFirstLetterTip(): void {
    this.flyingMessage.popMessage(this.question.correct_answer[0], {
      color: 'theme',
      size: 60,
      left: 75,
      top: 41,
      direction: 'left',
      timeoutMs: 3500,
    });
  }

  private handleFifthyTip(): void {
    while (
      this.question.disabledAnswers!.length <
      this.question.allAnswers!.length / 2
    ) {
      const randomIndex = Math.floor(
        Math.random() * this.question.allAnswers!.length
      );
      const ans = this.question.allAnswers![randomIndex];
      if (
        !this.question.disabledAnswers!.includes(ans) &&
        ans != this.question.correct_answer
      ) {
        this.question.disabledAnswers!.push(ans);
      }
    }
  }

  private async handleImageTip(): Promise<void> {
    const links = await this.imageService.getImageURLsByKeywords(
      this.question.type == 'boolean' ? 
      this.question.imageLinks![1] :
      this.question.correct_answer
    );
    this.question.tipImage = links[1];
  }

  private calcScore(answer: string): number {
    if (this.question.correct_answer != answer) {
      return 0;
    }
    let multiplier: number = 0;
    switch (this.question.difficulty) {
      case 'easy': {
        multiplier = 1;
        break;
      }
      case 'medium': {
        multiplier = 5;
        break;
      }
      case 'hard': {
        multiplier = 10;
        break;
      }
    }
    return Math.round(this.questionTimeLeft * multiplier);
  }

  private getAllAnswers(): string[] {
    const answers: string[] = [
      ...this.questions[this.questionIndex].incorrect_answers,
      this.questions[this.questionIndex].correct_answer,
    ];

    const randomArray = answers
      .map((ans) => ({
        ans,
        rand: Math.random(),
      }))
      .sort((a, b) => a.rand - b.rand);

    return randomArray.map((obj) => obj.ans);
  }

  private startTimer(): void {
    this.questionTimeLeft = this.question.timeLimit!;
    let timeLeft = this.question.timeLimit! - 1;
    this.questionTimeInterval = setInterval(() => {
      this.questionTimeLeft = timeLeft--;
    }, 1000) as unknown as number;

    this.questionTimeTimeout = setTimeout(() => {
      this.stopTimer();
      this.gameHandler();
    }, this.question.timeLimit! * 1000) as unknown as number;
  }

  private stopTimer(): void {
    clearTimeout(this.questionTimeTimeout);
    clearInterval(this.questionTimeInterval);
  }
}
