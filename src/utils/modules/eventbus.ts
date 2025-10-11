class EventBus {
  events: Record<string, Set<(...args: any[]) => void>> = {};

  on(eventName: string, callback: (...args: any[]) => void) {
    (this.events[eventName] ??= new Set()).add(callback);
  }

  emit(eventName: string, ...args: any[]) {
    this.events[eventName]?.forEach((callback) => callback(...args));
  }

  off(eventName: string, callback: (...args: any[]) => void) {
    this.events[eventName]?.delete(callback);
  }

  once(eventName: string, callback: (...args: any[]) => void) {
    const wrapper = (...args: any[]) => {
      callback(...args);
      this.off(eventName, wrapper);
    };
    this.on(eventName, wrapper);
  }
}

export const bus = new EventBus();
