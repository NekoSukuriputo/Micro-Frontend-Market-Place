import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private activeTabSubject = new BehaviorSubject<string>('profile');
  private favoriteCountSubject = new BehaviorSubject<number>(0);
  
  public activeTab$: Observable<string> = this.activeTabSubject.asObservable();
  public favoriteCount$: Observable<number> = this.favoriteCountSubject.asObservable();

  constructor() {
    this.initSharedStore();
  }

  private async initSharedStore() {
    try {
      // @ts-ignore
      const storeModule = await import('shared_store/store');
      if (storeModule && storeModule.shopStore) {
        // Initial sync
        const favs = storeModule.shopStore.getState().favorites;
        this.favoriteCountSubject.next(favs.length);
        
        // Subscribe to changes
        storeModule.shopStore.subscribe((state: any) => {
          this.favoriteCountSubject.next(state.favorites.length);
        });
      }
    } catch (e) {
      console.warn('Failed to connect to shared_store', e);
    }
  }

  setActiveTab(tab: string) {
    this.activeTabSubject.next(tab);
  }
}
