import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { UserService } from './services/common/user.service';
import localeBn from '@angular/common/locales/bn';
import { registerLocaleData } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('scroll') scroll: ElementRef;


  constructor(
    private userService: UserService,
    private router: Router
  ) {
    registerLocaleData(localeBn, 'bn');
    this.userService.autoUserLoggedIn();
  }


  /**
   * scrollTop();
   */
  scrollTop() {
    window.scrollTo(0, 0);
  }
  @HostListener('window:scroll')
  hideShowScrollBtn() {
    if (window.scrollY > 400) {
      this.scroll.nativeElement.style.display = 'flex';
    } else {
      this.scroll.nativeElement.style.display = 'none';
    }
  }
}
