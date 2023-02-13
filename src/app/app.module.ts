import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SwiperModule } from 'swiper/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// Import your library
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import {AuthUserInterceptor} from './auth-interceptor/auth-user.interceptor';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularFireModule} from "@angular/fire";
import {environment} from "../environments/environment";
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SwiperModule,
    BrowserAnimationsModule,
    SlickCarouselModule,
    SharedModule,
    ReactiveFormsModule,
    // Angular Firebase Config
    AngularFireModule.initializeApp(environment.firebaseConfig),
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthUserInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
