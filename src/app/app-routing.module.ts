import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { EntryViewComponent } from './entry-view/entry-view.component';
import { NewEntryComponent } from './new-entry/new-entry.component';


const routes: Routes = [
  {path: "", redirectTo: "home", pathMatch : "full"},
  {path: "home", component: EntryViewComponent},
  {path: "new-entry", component: NewEntryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
