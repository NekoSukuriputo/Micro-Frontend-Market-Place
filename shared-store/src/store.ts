// A simple vanilla JS Pub/Sub store
class Store {
  private state: any;
  private listeners: Function[];

  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(newState: any) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: Function) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const cartStore = new Store({ items: [] });
export const userStore = new Store({ user: null });

export const addToCart = (product: any) => {
  const currentItems = cartStore.getState().items;
  const existing = currentItems.find((i: any) => i.id === product.id);
  if (existing) {
    const updated = currentItems.map((i: any) => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
    cartStore.setState({ items: updated });
  } else {
    cartStore.setState({ items: [...currentItems, { ...product, quantity: 1 }] });
  }
};

export const removeFromCart = (productId: number) => {
  const currentItems = cartStore.getState().items;
  cartStore.setState({ items: currentItems.filter((i: any) => i.id !== productId) });
};

export const clearCart = () => {
  cartStore.setState({ items: [] });
};

export const login = (username: string) => {
  userStore.setState({ user: { username, loggedInAt: new Date().toISOString() } });
};

export const logout = () => {
  userStore.setState({ user: null });
};
