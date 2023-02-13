import {PagesComponent} from './pages.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserAuthGuard} from '../auth-guard/user-auth.guard';
import {UserAuthStateGuard} from '../auth-guard/user-auth-state.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
      },
      {
        path: 'products/details',
        loadChildren: () => import ('./product-details/product-details.module').then(m => m.ProductDetailsModule)
      },
      {
        path: 'pc-builder',
        loadChildren: () => import ('./pc-build/pc-build.module').then(m => m.PcBuildModule)
      },
      {
        path: 'compare',
        loadChildren: () =>
          import('./compare/compare.module').then((m) => m.CompareModule),
      },
      {
        path: 'contact-us',
        loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsModule)
      },
      {
        path: 'offers',
        loadChildren: () => import('./offers/offers.module').then(m => m.OffersModule)
      },
      {
        path: 'products',
        loadChildren: () => import('./product-list/product-list.module').then(m => m.ProductListModule)
      },
      {
        path: 'login',
        loadChildren: () => import('./user/login/login.module').then(m => m.LoginModule),
        canActivate: [UserAuthStateGuard],
      },
      {
        path: 'registration',
        loadChildren: () => import('./user/registration/registration.module').then(m => m.RegistrationModule),
        canActivate: [UserAuthStateGuard],
      },

      {
        path: 'cart',
        loadChildren: () => import('./user/cart/cart.module').then(m => m.CartModule),
        canActivate: [UserAuthGuard],
      },
      {
        path: 'checkout',
        loadChildren: () => import('./user/payment/payment.module').then(m => m.PaymentModule),
        canActivate: [UserAuthGuard],
      },
      {
        path: 'shipping',
        loadChildren: () => import('./user/shipping-info/shipping-info.module').then(m => m.ShippingInfoModule),
        canActivate: [UserAuthGuard],
      },

      {
        path: 'complete_order',
        loadChildren: () => import('./user/confirmation/confirmation.module').then(m => m.ConfirmationModule),
        canActivate: [UserAuthGuard],
      },
      {
        path: 'account',
        loadChildren: () => import('./user/account/account.module').then(m => m.AccountModule),
        canActivate: [UserAuthGuard],
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
        path: 'pages',
        loadChildren: () => import('./additional-page-view/additional-page-view.module').then(m => m.AdditionalPageViewModule),
        data: {preload: false, delay: false}
      },
      {
        pathMatch:'full',
        path: ':slug',
        loadChildren: () => import('./promo-product-list/promo-product-list.module').then(m => m.PromoProductListModule)
      },
      {
        path: 'offer-product',
        loadChildren: () => import('./promo-offer-product-details/promo-offer-product-details.module').then(m => m.PromoOfferProductDetailsModule)
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UserAuthGuard, UserAuthStateGuard]
})
export class PagesRoutingModule {
}
