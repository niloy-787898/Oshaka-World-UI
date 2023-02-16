import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesComponent} from './pages.component';
import {RouterModule, Routes} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {SidenavListComponent} from './components/sidenav-list/sidenav-list.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AdminAuthRoleGuard} from '../../auth-guard/admin-auth-role.guard';
import {ProductTableComponent} from './components/product-table/product-table.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {ProductViewTableOneComponent} from './components/product-view-table-one/product-view-table-one.component';


const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'carousel',
        loadChildren: () => import('./carousels/carousels.module').then(m => m.CarouselsModule)
      },
      {
        path: 'shop-info',
        loadChildren: () => import('./shop-info/shop-info.module').then(m => m.ShopInfoModule)
      },
      {
        path: 'attributes',
        loadChildren: () => import('./attributes/attributes.module').then(m => m.AttributesModule)
      },
      {
        path: 'tags',
        loadChildren: () => import('./tags/tags.module').then(m => m.TagsModule)
      },
      {
        path: 'brands',
        loadChildren: () => import('./brands/brands.module').then(m => m.BrandsModule)
      },
      {
        path: 'categories',
        loadChildren: () => import('./categories/categories.module').then(m => m.CategoriesModule)
      },
      {
        path: 'sub-categories',
        loadChildren: () => import('./sub-categories/sub-categories.module').then(m => m.SubCategoriesModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./products/products.module').then(m => m.ProductsModule)
      },
      {
        path: 'add-product',
        loadChildren: () => import('./products/add-product/add-product.module').then(m => m.AddProductModule)
      },
      {
        path: 'banner',
        loadChildren: () => import('./banner/banner.module').then(m => m.BannerModule)
      },
      {
        path: 'image-gallery',
        loadChildren: () => import('./image-gallery/image-gallery.module').then(m => m.ImageGalleryModule)
      },
      {
        path: 'image-folder',
        loadChildren: () => import('./image-folder/image-folder.module').then(m => m.ImageFolderModule)
      },
      {
        path: 'shipping-charge',
        loadChildren: () => import('./shipping-charge/shipping-charge.module').then(m => m.ShippingChargeModule)
      },
      {
        path: 'orders',
        loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
      },
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule)
      },
      {
        path: 'payments',
        loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsModule)
      },
      {
        path: 'customers',
        loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)
      },
      {
        path: 'my-profile',
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
      },
      {
        path: 'reviews',
        loadChildren: () => import('./reviews/reviews.module').then(m => m.ReviewsModule)
      },
      {
        path: 'vendor-identification',
        loadChildren: () => import('./vendor-identification/vendor-identification.module').then(m => m.VendorIdentificationModule)
      },
      {
        path: 'reset-password',
        loadChildren: () => import('./reset-password/reset-password.module').then(m => m.ResetPasswordModule),
        data: {preload: false, delay: true}
      },
    ]
  },
];

@NgModule({
  declarations: [
    PagesComponent,
    HeaderComponent,
    SidenavListComponent,
    ProductTableComponent,
    ProductViewTableOneComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    RouterModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatNativeDateModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    PipesModule,
    FormsModule,
    NgxPaginationModule
  ],
  exports: [
    ProductViewTableOneComponent
  ],
  providers: [AdminAuthRoleGuard]
})
export class PagesModule {
}
