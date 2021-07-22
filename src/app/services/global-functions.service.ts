import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class GlobalFunctionsService {

  public sign = '&#x20B1;&#x2C60;';

  constructor(private location: Location, private sanitizer: DomSanitizer) { }

  public back(): void {
    this.location.back();
  }
}
