import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  private listeners: Map<APP_EVENT_TOPIC, Set<Function>> = new Map();

  constructor() {}

  public listen(topic: APP_EVENT_TOPIC, handler: Function): void {
    if (this.listeners.has(topic)) {
      this.listeners.get(topic)!.add(handler);
    } else {
      this.listeners.set(topic, new Set([handler]));
    }
  }

  public notify(topic: APP_EVENT_TOPIC, data?: any): void {
    const hnadlers = this.listeners.get(topic);
    if (!hnadlers) {
      return;
    }
    hnadlers.forEach((handler) => {
      try {
        handler(data);
      } catch (e) {
        console.error(e);
      }
    });
  }
}
