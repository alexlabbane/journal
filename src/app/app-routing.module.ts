import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { EntryViewComponent } from './entry-view/entry-view.component';
import { NewEntryComponent } from './new-entry/new-entry.component';
import { SettingsComponent } from './settings/settings.component';


const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch : "full"},
  {path: "home", component: EntryViewComponent},
  {path: "new-entry", component: NewEntryComponent},
  {path: "settings", component: SettingsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
