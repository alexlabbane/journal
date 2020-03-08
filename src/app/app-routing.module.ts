import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { EntryViewComponent } from './entry-view/entry-view.component';
import { NewEntryComponent } from './new-entry/new-entry.component';
import { SettingsComponent } from './settings/settings.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './auth-guard.service';


const routes: Routes = [
  {path: "", redirectTo: "login", pathMatch : "full"},
  {path: "home", component: EntryViewComponent, canActivate : [AuthGuardService]},
  {path: "new-entry", component: NewEntryComponent, canActivate : [AuthGuardService]},
  {path: "settings", component: SettingsComponent, canActivate : [AuthGuardService]},
  {path: "login", component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
