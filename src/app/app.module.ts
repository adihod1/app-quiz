import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './page-layout/sidebar/sidebar.component';
import { QuizBoardComponent } from './pages/quiz-board/quiz-board.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { InstructionsComponent } from './pages/instructions/instructions.component';
import { NavbarComponent } from './page-layout/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuizMenuComponent } from './pages/quiz-menu/quiz-menu.component';
import { FooterComponent } from './page-layout/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    QuizBoardComponent,
    LeaderboardComponent,
    InstructionsComponent,
    NavbarComponent,
    QuizMenuComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
