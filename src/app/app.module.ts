import { APP_ROUTES } from './app.routes';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { FrontComponent } from './front/front.component';
import { HttpClientModule } from '@angular/common/http';
import { LlamaRemoteService } from './_services/llama-remote/llama-remote.service';
import { RouterModule } from '@angular/router';
import { LlamaPageComponent } from './llama-page/llama-page.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES),
    ReactiveFormsModule,
  ],
  declarations: [
    AppComponent,
    FrontComponent,
    LlamaPageComponent,
    LoginComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
