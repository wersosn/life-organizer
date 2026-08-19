type Listener = (...args: any[]) => void;

class AuthEventEmitter {
  private listeners: Record<string, Listener[]> = {};

  on(event: string, listener: Listener) {
    if (!this.listeners[event]) {
        this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
    return () => this.off(event, listener);
  }

  off(event: string, listener: Listener) {
    this.listeners[event] = (this.listeners[event] ?? []).filter(l => l !== listener);
  }

  emit(event: string, ...args: any[]) {
    (this.listeners[event] ?? []).forEach(l => l(...args));
  }
}

export const authEvents = new AuthEventEmitter();

export const AUTH_EVENTS = {
  TOKEN_REFRESHED: "tokenRefreshed",
  SESSION_EXPIRED: "sessionExpired",
} as const;