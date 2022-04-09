import { Injectable } from '@angular/core';

type FlyingTextOptions = {
  color?: string;
  selector?: string;
  timeoutMs?: number;
  left?: number;
  top?: number;
  size?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  movingRange?: number;
};

@Injectable({
  providedIn: 'root',
})
export class FlyingTextService {
  private readonly defaultOptions: Required<FlyingTextOptions> = {
    selector: 'body',
    color: 'black',
    timeoutMs: 2000,
    size: 26,
    top: 45,
    left: 45,
    direction: 'up',
    movingRange: 10,
  };

  constructor() {}

  public popMessage(text: string, opts?: FlyingTextOptions): void {
    const options = this.mergeOptions(opts);

    const element = this.createElement(options);
    element.innerText = text;
    const wrapper = document
      .querySelector(options.selector)
      ?.appendChild(element);

    if (!wrapper) {
      throw Error(`Selector ${options.selector} was not found!`);
    }

    element.className = element.className.replace('hidden', '');
    setTimeout(() => {
      switch (options.direction) {
        case 'up':
        case 'down': {
          const newHeight =
            options.top + options.direction == 'up'
              ? options.movingRange
              : -options.movingRange;
          element.style.top = `${options.top + newHeight}%`;
          break;
        }
        case 'left':
        case 'right': {
          const newWidth =
            options.left + options.direction == 'right'
              ? options.movingRange
              : -options.movingRange;
          element.style.left = `${options.left + newWidth}%`;
          break;
        }
      }

      //   element.style.top = `${options.top - 10}%`;
      element.style.opacity = '0';
    }, 10);

    setTimeout(() => element.remove(), options.timeoutMs);
  }

  private createElement(options: Required<FlyingTextOptions>): HTMLDivElement {
    const element = document.createElement('div');
    element.className = `font-size-${options.size} color-${options.color} font-weight-600 hidden`;
    element.style.transition = `all ${options.timeoutMs}ms ease`;
    element.style.top = `${options.top}%`;
    element.style.left = `${options.left}%`;
    element.style.position = 'absolute';
    return element;
  }

  private mergeOptions(
    options?: FlyingTextOptions
  ): Required<FlyingTextOptions> {
    if (!options) {
      return this.defaultOptions;
    }

    return {
      color: options.color || this.defaultOptions.color,
      selector: options.selector || this.defaultOptions.selector,
      timeoutMs: options.timeoutMs || this.defaultOptions.timeoutMs,
      top: options.top || this.defaultOptions.top,
      left: options.left || this.defaultOptions.left,
      size: options.size || this.defaultOptions.size,
      direction: options.direction || this.defaultOptions.direction,
      movingRange: options.movingRange || this.defaultOptions.movingRange,
    };
  }
}
