import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructionsComponent } from './pages/instructions/instructions.component';
import { LeaderboardComponent } from './pages/leaderboard/leaderboard.component';
import { QuizMenuComponent } from './pages/quiz-menu/quiz-menu.component';

const routes: Routes = [
  { path: APPLICATION_ROUTE.GAME, component: QuizMenuComponent },
  { path: APPLICATION_ROUTE.LEADERBOARD, component: LeaderboardComponent },
  { path: APPLICATION_ROUTE.INSTRUCTIONS, component: InstructionsComponent },

  { path: '**', redirectTo: APPLICATION_ROUTE.GAME },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
