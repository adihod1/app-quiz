import { Injectable } from '@angular/core';
import * as $ from 'jquery';

export interface opts {
  opacity: number;
  showSpinner: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class OverlayService {
  private readonly selector = '#spinner-service';
  private readonly spinnerStyle: string =
    '<div id="overlay">' +
    '<div class="over-spinner-wrapper">' +
    '<i class="over-spinner fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i>' +
    '<span class="sr-only">Loading...</span>' +
    '</div>' +
    '<label class="bottom-spinner"></label>' +
    '<br/></div>';

  private template: string = '';
  private overlayId: string = '';

  constructor() {}

  public start(): void {
    this.overlayId = 'overlay';
    this.template = this.spinnerStyle;
    $(this.selector).append(this.template).fadeIn();
  }

  public stop(): void {
    $(this.selector)
      .children('#' + this.overlayId)
      .fadeOut(200);
    $(this.selector)
      .children('#' + this.overlayId)
      .remove();
  }
}
