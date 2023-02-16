import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {environment} from "../environments/environment";
import {VendorAuthGuard} from "./auth-guard/vendor-auth.guard";
import {VendorAuthStateGuard} from "./auth-guard/vendor-auth-state.guard";


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: environment.vendorLoginUrl,
    canActivate: [VendorAuthStateGuard],
    loadChildren: () => import('./vendor/vendor-auth/vendor-auth.module').then(m => m.VendorAuthModule)
  },
  {
    path: environment.vendorBaseUrl,
    canActivate: [VendorAuthGuard],
    loadChildren: () => import('./vendor/pages/pages.module').then(m => m.PagesModule)
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./vendor/pages/reset-password/reset-password.module').then(m => m.ResetPasswordModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule)
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy',
    preloadingStrategy: PreloadAllModules,
    // initialNavigation: 'enabled',
    anchorScrolling: 'enabled',
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
