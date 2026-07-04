import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
// @ts-ignore
import { userStore, login, logout } from 'shared_store/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  user: any = null;
  usernameInput: string = '';
  unsubscribe: any;
  activeTab: string = 'profile';
  favoriteCount: number = 0;

  constructor(
    private cdr: ChangeDetectorRef,
    public userProfileService: UserProfileService
  ) {}

  ngOnInit() {
    if (userStore) {
      this.unsubscribe = userStore.subscribe((state: any) => {
        this.user = state.user;
        this.cdr.detectChanges();
      });
      this.user = userStore.getState().user;
    }

    this.userProfileService.activeTab$.subscribe(tab => {
      this.activeTab = tab;
      this.cdr.detectChanges();
    });

    this.userProfileService.favoriteCount$.subscribe(count => {
      this.favoriteCount = count;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  handleLogin() {
    if (this.usernameInput.trim()) {
      login(this.usernameInput.trim());
      this.usernameInput = '';
    }
  }

  handleLogout() {
    logout();
  }

  setTab(tab: string) {
    this.userProfileService.setActiveTab(tab);
  }
}

