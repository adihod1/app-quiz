import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage-service.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  public leaderboardItems: ExtendedQuizLeadboard[] = [];
  public tableHeaders: TableHeader[] = [
    { name: 'Rank', sortField: 'rank', sortType: 'number' },
    { name: 'Name', sortField: 'name', sortType: 'string' },
    { name: 'Score', sortField: 'score', sortType: 'number' },
    {
      name: 'Number Of Questiones',
      sortField: 'numOfQuestiones',
      sortType: 'number',
    },
    { name: 'Date', sortField: 'date', sortType: 'number' },
  ];

  public sortBy: TableHeader = this.tableHeaders.find(
    (t) => t.sortField == 'score'
  )!;
  public sortDirection: 'asc' | 'desc' = 'desc';

  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    const table = this.storageService.getLeaderboardTable();
    table.sort((a, b) => b.score - a.score);
    this.leaderboardItems = table.map((o, i) => ({
      ...o,
      rank: i + 1,
    }));
    this.sortTable();
  }

  public normalizeDate(date: number): string {
    return new Date(date).toISOString().replace(/[TZ]/g, ' ').split('.')[0];
  }

  public isHighestScore(item: QuizLeadboard): boolean {
    const highestScore = Math.max(...this.leaderboardItems.map((l) => l.score));
    return item.score == highestScore;
  }

  public sortTable() {
    this.leaderboardItems.sort((a, b) => {
      const prop_a = a[this.sortBy.sortField];
      const prop_b = b[this.sortBy.sortField];
      if (this.sortDirection == 'asc') {
        return prop_a > prop_b ? 1 : prop_a < prop_b ? -1 : 0;
      } else {
        return prop_a > prop_b ? -1 : prop_a < prop_b ? 1 : 0;
      }
    });
  }

  public setSortBy(sortByItem: TableHeader): void {
    if (this.sortBy == sortByItem) {
      this.sortDirection = this.sortDirection == 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = sortByItem;
      this.sortDirection = 'desc';
    }
    this.sortTable();
  }
}
