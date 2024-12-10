import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createAuthStore() {
  const { subscribe, set } = writable<string | null>(
    browser ? localStorage.getItem('adminToken') : null
  );

  return {
    subscribe,
    setToken: (token: string) => {
      if (browser) {
        localStorage.setItem('adminToken', token);
        set(token);
      }
    },
    clearToken: () => {
      if (browser) {
        localStorage.removeItem('adminToken');
        set(null);
      }
    },
    isAdmin: () => {
      return browser && localStorage.getItem('adminToken') !== null;
    }
  };
}

export const authStore = createAuthStore();