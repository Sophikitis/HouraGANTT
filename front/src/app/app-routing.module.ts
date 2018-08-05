import { HomeComponent } from './components/home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BeforeLoginService } from './services/before-login.service';
import { AfterLoginService } from './services/after-login.service';

const appRoutes: Routes = [
    {
        path: '',
        component: LoginComponent,
    },
    {
        path: 'test',
        component: HomeComponent,
        canActivate: [AfterLoginService]
    },
    {
        path : 'dashboard',
        component: DashboardComponent,
        canActivate: [AfterLoginService]
    },
    { path: '**', redirectTo: '' }

];

@NgModule({
    imports: [  RouterModule.forRoot(appRoutes,{useHash:true})],
    exports: [RouterModule]
})
export class AppRoutingModule { }


