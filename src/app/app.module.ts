import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms'
import { NavComponent } from './nav/nav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog'
import { EntryViewComponent } from './entry-view/entry-view.component'
import { EventDialog } from './entry-view/entry-view.component';
import { NewEntryComponent } from './new-entry/new-entry.component'
import { MatFormFieldModule} from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'
import { MatSelectModule } from '@angular/material/select'
import { AngularFireModule } from '@angular/fire'
import { AngularFireDatabaseModule } from '@angular/fire/database'
import { AngularEditorModule } from '@kolkov/angular-editor';
import { environment } from '../environments/environment';
import { SettingsComponent } from './settings/settings.component'

if (!environment.firebase) {
  if (!environment.firebase.apiKey) {
    window.alert("configErrMsg");
  } else if (environment.firebase.storageBucket === '') {
    window.alert("bucketErrMsg");
  }
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    EntryViewComponent,
    EventDialog,
    NewEntryComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatToolbarModule,
    FormsModule,
    MatDialogModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    AngularEditorModule
  ],
  entryComponents : [EventDialog],
  providers: [HttpClientModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
