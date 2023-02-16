import {Component, Input, OnInit} from '@angular/core';
import {MenuCtrService} from "../../../../services/core/menu-ctr.service";
import {MenuAdmin} from "../../../../interfaces/core/menu-admin";



@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  @Input() public navItem;
  @Input() menuItems: MenuAdmin[];
  @Input() menuParentId: string = null;

  parentMenu: MenuAdmin[] = [];


  constructor(
    private menuCtrService: MenuCtrService
  ) {
  }

  ngOnInit() {
    this.parentMenu = this.menuItems.filter(item => item.parentId === this.menuParentId);
    console.log(this.parentMenu);
  }

  onClick(menuId) {
    this.menuCtrService.toggleMenuItem(menuId);
    this.menuCtrService.closeOtherSubMenus(this.menuItems, menuId);
  }


  sideLinkClick() {
    if (window.innerWidth > 599) {
      this.navItem.open();
    } else {
      this.navItem.close();
    }
  }

}
