import { Component, OnInit } from '@angular/core';
import { StorageService } from 'src/app/services/storage-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public isSidebarOpen: boolean = false;
  public routes: SidebarItem[] = [
    {
      route: APPLICATION_ROUTE.GAME,
      text: 'Play',
      iconClass: 'mdi mdi-cards-outline',
    },
    {
      route: APPLICATION_ROUTE.INSTRUCTIONS,
      text: 'Instructions',
      iconClass: 'mdi mdi-information-outline',
    },
    {
      route: APPLICATION_ROUTE.LEADERBOARD,
      text: 'Leaderboard',
      iconClass: 'mdi mdi-trophy-outline',
    },
  ];
  constructor(private storageService: StorageService) {}

  ngOnInit(): void {
    const sidebarState = this.storageService.getSidebarState();
    if (typeof sidebarState == 'boolean') {
      this.isSidebarOpen = sidebarState;
    }
  }

  public toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.storageService.setSidebarState(this.isSidebarOpen);
  }
}
