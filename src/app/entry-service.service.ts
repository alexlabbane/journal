import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { EntryViewComponent } from './entry-view/entry-view.component';
import { Observable } from 'rxjs';
import { of } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class EntryServiceService {
  nextID : Number = -1;

  constructor(public database : AngularFireDatabase) { 
    //Subscribe to nextID
    this.database.object('/nextID').valueChanges().subscribe((value : Number) => {
      this.nextID = value;
    });
  }
}
