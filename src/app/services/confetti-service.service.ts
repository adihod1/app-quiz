import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfettiService {
  public start(expireMs: number): void {
    startConfetti();
    if (expireMs) {
      setTimeout(() => this.stop(), expireMs);
    }
  }

  public stop(): void {
    stopConfetti();
  }
}
