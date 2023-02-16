import {AfterViewInit, Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {Meta} from '@angular/platform-browser';

import {menuItemsVendor} from '../../core/utils/vendor-menu';
import {MenuAdmin} from "../../interfaces/core/menu-admin";
import {MenuCtrService} from "../../services/core/menu-ctr.service";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, AfterViewInit {

  @Output() @ViewChild('sidenav', {static: true}) theSidenav;
  @Input() isAdminMenu = false;
  @Input() sideNavMenuList: any[];

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        return result.matches;
      })
    );

  isMidDevice$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Medium)
    .pipe(
      map(result => {
        return result.matches;
      })
    );

  // Store Data
  menuList: MenuAdmin[] = [];


  constructor(
    private breakpointObserver: BreakpointObserver,
    private meta: Meta,
    private menuCtrService: MenuCtrService,
  ) {
  }

  ngOnInit() {
    // Google No Index
    this.googleNoIndex();

    this.menuList = menuItemsVendor;
  }

  ngAfterViewInit(): void {
    this.menuCtrService.expandActiveSubMenu(this.menuList);
  }


  /**
   * SEO TITLE
   * SEO META TAGS
   */

  private googleNoIndex() {
    this.meta.updateTag({name: 'robots', content: 'noindex'});
    this.meta.updateTag({name: 'googlebot', content: 'noindex'});
  }

}
