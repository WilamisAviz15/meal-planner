import { AuthGuard } from './shared/auth/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './account/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { SchedulesComponent } from './pages/schedules/schedules.component';
import { AutenticationComponent } from './account/autentication/autentication.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [],
    canActivate: [AuthGuard],
  },
  {
    path: 'schedules',
    component: SchedulesComponent,
    canActivate: [AuthGuard],
  },

  {
    path: '',
    component: AutenticationComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
