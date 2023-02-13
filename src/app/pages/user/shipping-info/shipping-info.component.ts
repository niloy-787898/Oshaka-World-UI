import {Subscription} from 'rxjs';
import {AddNewAdressComponent} from '../../../shared/components/add-new-adress/add-new-adress.component';
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';

import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {AddAddressComponent} from '../../../shared/dialog-view/add-address/add-address.component';
import {User} from '../../../interfaces/common/user.interface';
import {UiService} from '../../../services/core/ui.service';
import {UserDataService} from '../../../services/common/user-data.service';
import {ReloadService} from '../../../services/core/reload.service';
import {StorageService} from '../../../services/core/storage.service';
import {DATABASE_KEY} from '../../../core/utils/global-variable';
import {Address} from '../../../interfaces/common/address.interface';
import {UserService} from '../../../services/common/user.service';

@Component({
  selector: 'app-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.scss']
})
export class ShippingInfoComponent implements OnInit, OnDestroy {
  @ViewChild('address') address: AddNewAdressComponent;

  // Store data
  user: User;
  addressInfo: Address[] = [];
  isUserAuth: boolean = false;

  //Static data
  selectedAddress: Address = null;


  // Subscriptions
  private subReload: Subscription;
  private subUserListener: Subscription;
  private subDataOne: Subscription;
  private subDataTwo: Subscription;
  private subDataThree: Subscription;

  constructor(
    private userDataService: UserDataService,
    private reloadService: ReloadService,
    private storageService: StorageService,
    private uiService: UiService,
    private router: Router,
    public dialog: MatDialog,
    public userService: UserService,
  ) {
  }


  ngOnInit(): void {
    //On user login status change
    this.subUserListener = this.userService.getUserStatusListener().subscribe(() => {
      this.isUserAuth = this.userService.getUserStatus();
      if (this.isUserAuth) {
        this.getLoggedInUserData();
      }
    });

    // Normal user status
    this.isUserAuth = this.userService.getUserStatus();
    if (this.isUserAuth) {
      this.getLoggedInUserData();
    }

    //Address Function Reload
    this.subReload = this.reloadService.refreshData$
      .subscribe(() => {
        this.getUserAddress();
      });
    // Base Data
    this.getUserAddress();

  }


  /**
   * On Submit
   */
  onSubmitSelectedAddress() {
    if (this.selectedAddress) {
      this.router.navigate(['checkout']);
    } else {
      this.uiService.warn('Please Select an Address');
    }
  }


  /**
   * Http Req Handle
   * getUserAddress()
   * deleteAddressById()
   * getLoggedInUserData()
   */


  private getUserAddress() {
    this.subDataOne = this.userDataService.getUserAddress()
      .subscribe(res => {
        this.addressInfo = res.data;
        this.getSelectedAddress();
      }, err => {
        console.log(err);
      });
  }

  deleteAddressById(index) {
    this.subDataTwo = this.userDataService.deleteAddressById(this.addressInfo[index]._id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshData$();
      }, err => {
        console.log(err);
      });
  }

  private getLoggedInUserData() {
    const select = 'name';
    this.subDataThree = this.userDataService.getLoggedInUserData(select)
      .subscribe(res => {
        this.user = res.data;
      }, error => {
        console.log(error);
      });
  }


  /**
   * Dialog Component
   * openAddressDialog
   */
  openAddressDialog(data?: Address) {
    this.dialog.open(AddAddressComponent, {
      data: data,
      panelClass: ['theme-dialog'],
      width: '100%',
      maxWidth: '850px',
      maxHeight: '100%',
      autoFocus: false,
      disableClose: false
    });
  }


  /**
   * Select & Get Active Address
   * onSelectAddress()
   */
  onSelectAddress(address: Address) {
    this.selectedAddress = address;
    this.storageService.storeDataToSessionStorage(DATABASE_KEY.selectedShippingAddress, {_id: this.selectedAddress._id});
  }

  private getSelectedAddress() {
    const addressData = this.storageService.getDataFromSessionStorage(DATABASE_KEY.selectedShippingAddress);
    if (addressData) {
      const fAddress = this.addressInfo.find(f => f._id === addressData._id);
      if (fAddress) {
        this.selectedAddress = fAddress;
      }
    }
  }


  /**
   * Ng On Destroy
   */

  ngOnDestroy(): void {
    if (this.subReload) {
      this.subReload.unsubscribe()
    }
    if (this.subUserListener) {
      this.subUserListener.unsubscribe()
    }
    if (this.subDataOne) {
      this.subDataOne.unsubscribe()
    }
    if (this.subDataTwo) {
      this.subDataTwo.unsubscribe()
    }
    if (this.subDataThree) {
      this.subDataThree.unsubscribe()
    }
  }


}
