import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/services/events.service';
import { StorageService } from 'src/app/services/storage-service.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  public playerName: string = '';
  public playerScore: number = 0;
  constructor(
    private stogareService: StorageService,
    private events: EventsService
  ) {}

  ngOnInit(): void {
    this.updateName();
    this.updateScore();

    this.events.listen(APP_EVENT_TOPIC.ADDED_SCORE, () => this.updateScore());
    this.events.listen(APP_EVENT_TOPIC.NAME_CHANGED, () => this.updateName());
  }

  private updateName() {
    const currentName = this.playerName;
    const newName = this.stogareService.getLatestPlayerName();
    this.playerName = newName;
    if (currentName != newName) {
      this.updateScore();
    }
  }

  private updateScore() {
    const table = this.stogareService.getLeaderboardTable();
    this.playerScore = Math.max(
      0,
      ...table.filter((t) => t.name == this.playerName).map((t) => t.score)
    );
  }
}
