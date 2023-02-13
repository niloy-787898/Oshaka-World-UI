import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WindowService {


  constructor(
    @Inject(PLATFORM_ID) private platformId: any
  ) {
  }

  // @ts-ignore
  get windowRef() {
    if (isPlatformBrowser(this.platformId)) {
      return window;
    }
  }
}
