import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {AddAddressComponent} from '../../../../shared/dialog-view/add-address/add-address.component';
import {UserDataService} from '../../../../services/common/user-data.service';
import {ReloadService} from '../../../../services/core/reload.service';
import {AddNewAdressComponent} from '../../../../shared/components/add-new-adress/add-new-adress.component';
import {User} from '../../../../interfaces/common/user.interface';
import {Address} from '../../../../interfaces/common/address.interface';
import {StorageService} from '../../../../services/core/storage.service';
import {UserService} from '../../../../services/common/user.service';
import {DATABASE_KEY} from '../../../../core/utils/global-variable';

@Component({
  selector: 'app-address-book',
  templateUrl: './address-book.component.html',
  styleUrls: ['./address-book.component.scss']
})
export class AddressBookComponent implements OnInit, OnDestroy {
  @ViewChild('address') address: AddNewAdressComponent;

  // Store data
  user: User;
  addressInfo: Address[] = [];
  clickActive = [];
  isUserAuth: boolean = false;

  //Static data
  selectedAddress: any;


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
   * Http Req Handle
   * getUserAddress()
   * deleteAddressById()
   * getLoggedInUserData()
   */


  private getUserAddress() {
    this.subDataOne = this.userDataService.getUserAddress()
      .subscribe(res => {
        this.addressInfo = res.data
      }, err => {
        console.log(err);
      });
  }

  deleteAddressById(index) {
    this.subDataTwo = this.userDataService.deleteAddressById(this.addressInfo[index]._id)
      .subscribe(res => {
        console.log(res.message);
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
   * openAddressDialog()
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
   * Select Address Div
   */
  onSelectAddress(address, i) {
    this.selectedAddress = address;
    this.storageService.storeDataToSessionStorage(DATABASE_KEY.selectedShippingAddress, this.selectedAddress);
    this.clickActive = [];
    this.clickActive[i] = true;
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
