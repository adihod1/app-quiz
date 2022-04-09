import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly leaderboardTableKey: string = 'quiz_app_leaderboards';
  private readonly latestPlayerNameKey: string = 'quiz_app_latest_player_name';
  private readonly imageSearchCaching: string = 'quiz_app_image_cache';
  private readonly sidebarStateKey: string = 'quiz_app_sidebar_state';
  private readonly maxLeaderboardItems: number = 50;

  constructor() {
    if (!localStorage.getItem(this.leaderboardTableKey)) {
      this.saveTable([]);
    }
    if (!localStorage.getItem(this.imageSearchCaching)) {
      this.saveImagesCache({});
    }
  }

  //leaderboards

  public getHighestScore(): number {
    const table = this.getLeaderboardTable();
    if (!table.length) {
      return 0;
    }
    return Math.max(...table.map((t) => t.score));
  }

  public getLeaderboardTable(): QuizLeadboard[] {
    return JSON.parse(localStorage.getItem(this.leaderboardTableKey)!);
  }

  public addToLeaderboard(data: QuizLeadboard): void {
    const table = this.getLeaderboardTable();
    table.push(data);
    this.saveTable(table);
  }

  private saveTable(table: QuizLeadboard[]): void {
    if (table.length > this.maxLeaderboardItems) {
      table.sort((a, b) => b.score - a.score);
      table.length = this.maxLeaderboardItems;
    }
    localStorage.setItem(this.leaderboardTableKey, JSON.stringify(table));
  }

  //quiz-game
  public saveLatestPlayerName(name: string): void {
    localStorage.setItem(this.latestPlayerNameKey, name);
  }

  public getLatestPlayerName(): string {
    return localStorage.getItem(this.latestPlayerNameKey) || '';
  }

  //google image api
  public getImagesUrlsCache(): GoogleImageUrlsCache {
    return JSON.parse(localStorage.getItem(this.imageSearchCaching)!);
  }

  public addImageToCache(search: string, urls: string[]): void {
    const cache = this.getImagesUrlsCache();
    cache[search] = urls;
    this.saveImagesCache(cache);
  }

  private saveImagesCache(cache: GoogleImageUrlsCache): void {
    localStorage.setItem(this.imageSearchCaching, JSON.stringify(cache));
  }

  //sidebar

  public getSidebarState(): null | boolean {
    const item = localStorage.getItem(this.sidebarStateKey);
    try {
      return JSON.parse(item!) as boolean;
    } catch (e) {
      return null;
    }
  }

  public setSidebarState(state: boolean): void {
    localStorage.setItem(this.sidebarStateKey, state.toString());
  }
}
