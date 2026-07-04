import { create } from 'zustand';

// Assuming shared_store provides shopStore and toggleFavorite via module federation
// In development, we might not have types for it, so we use any
const getSharedStore = async () => {
  // We need to dynamically import it because it's a remote module
  try {
    const storeModule = await import('shared_store/store');
    return storeModule;
  } catch (error) {
    console.warn("Failed to load shared_store", error);
    return null;
  }
};

interface ProductState {
  searchQuery: string;
  sortBy: string;
  favorites: number[];
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: string) => void;
  toggleFavoriteLocal: (id: number) => void;
  syncFavorites: (favs: number[]) => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  searchQuery: '',
  sortBy: 'name-asc',
  favorites: [],
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),
  toggleFavoriteLocal: async (id) => {
    // 1. Update global store (this will trigger a sync back to us via subscription)
    const shared = await getSharedStore();
    if (shared && shared.toggleFavorite) {
      shared.toggleFavorite(id);
    } else {
      // Fallback local update if global store is unavailable
      const favs = get().favorites;
      if (favs.includes(id)) {
        set({ favorites: favs.filter(f => f !== id) });
      } else {
        set({ favorites: [...favs, id] });
      }
    }
  },
  syncFavorites: (favs) => set({ favorites: favs }),
}));

// Initialize the bridge
getSharedStore().then((shared) => {
  if (shared && shared.shopStore) {
    // Initial sync
    useProductStore.getState().syncFavorites(shared.shopStore.getState().favorites);
    
    // Subscribe to future changes
    shared.shopStore.subscribe((state: any) => {
      useProductStore.getState().syncFavorites(state.favorites);
    });
  }
});
