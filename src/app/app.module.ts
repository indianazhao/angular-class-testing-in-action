import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { APP_ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { FrontComponent } from './front/front.component';
import { LlamaPageComponent } from './llama-page/llama-page.component';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { AppNotificationsComponent } from './app-notifications/app-notifications.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES),
    ReactiveFormsModule,
    NgbToastModule,
  ],
  declarations: [
    AppComponent,
    FrontComponent,
    LlamaPageComponent,
    LoginComponent,
    RegistrationComponent,
    AppNotificationsComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
