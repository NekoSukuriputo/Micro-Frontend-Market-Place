import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
// @ts-ignore
import { userStore, login, logout } from 'shared_store/store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (userStore) {
      this.unsubscribe = userStore.subscribe((state: any) => {
        this.user = state.user;
        this.cdr.detectChanges();
      });
      this.user = userStore.getState().user;
    }
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
}
