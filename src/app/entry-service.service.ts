import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class EntryServiceService {

  nextID : Number = -1;
  tags : Set<String> = new Set();

  //For edits
  isEdit : boolean = false; //Denotes whether or not event is being edited on new event page
  editID : number = -1;
  editObject : any = null;

  constructor(public database : AngularFireDatabase) { 

    //Subscribe to nextID
    this.database.object('/nextID').valueChanges().subscribe((value : Number) => {
      this.nextID = value;
    });

    //Subscribe to tags
    this.database.object('/tags').valueChanges().subscribe((tagString : String) => {
      let tagList = tagString.split(",").sort();
      this.tags = new Set();
      tagList.forEach((tag) => {
        if(tag.length > 0) this.tags.add(tag);
      });
    });
  }

}
