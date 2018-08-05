

import { MaterializeModule } from 'angular2-materialize';
import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import '../polyfills';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { ElectronService } from './providers/electron.service';

import { WebviewDirective } from './directives/webview.directive';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { LoginService } from './providers/login.service';
import { TaskService } from './services/task.service';
import { LinkService } from './services/link.service';
import { UserService } from './services/user.service';

import { TokenService } from './services/token.service';
import { AfterLoginService } from './services/after-login.service';
import { BeforeLoginService } from './services/before-login.service';
import { AuthService } from './services/auth.service';

import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { DashboardService } from './providers/dashboard.service';
import { GanttComponent } from './components/gantt/gantt.component';
import { RessourcesComponent } from './components/ressources/ressources.component';
import { RessourcesService } from './providers/ressources.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    WebviewDirective,
    LoginComponent,
    DashboardComponent,
    ToolbarComponent,
    GanttComponent,
    RessourcesComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MaterializeModule,

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    ElectronService,
    AuthService,
    AuthGuardService,
    JwtHelperService,
    LoginService,
    DashboardService,
    TaskService,
    LinkService,
    RessourcesService,
    UserService,
    TokenService,
    AfterLoginService,
    BeforeLoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
