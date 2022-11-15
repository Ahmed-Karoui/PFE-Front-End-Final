import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthenticationGuard } from './core/auth/authentication.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import(`./login/login.module`).then((m) => m.LoginModule) },
  { path: 'error', loadChildren: () => import(`./errorpages/errorpages.module`).then((m) => m.ErrorpagesModule) },
  { path: 'layout', loadChildren: () => import(`./all-modules/all-modules.module`).then((m) => m.AllModulesModule),canActivate: [AuthenticationGuard],},
  { path: '**', redirectTo: '/login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
