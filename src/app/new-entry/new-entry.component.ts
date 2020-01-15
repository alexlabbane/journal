import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { MatDatepicker } from '@angular/material/datepicker'
import { Router } from '@angular/router';
import { EntryServiceService } from '../entry-service.service';

@Component({
  selector: 'app-new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.scss']
})
export class NewEntryComponent implements OnInit {

  currentTagInput = '';
  currentTags : Set<any> = new Set();
  currentTextInput = '';
  currentNameInput = '';
  currentDate : Date;
  dateString : string;
  htmlContent : string;

  constructor(public database : AngularFireDatabase, public router : Router, public entryService : EntryServiceService) { }

  ngOnInit() {
    this.currentDate = new Date();
    this.dateString = this.currentDate.toLocaleDateString();
  }

  updateDate() {
    console.log("Updated");
    this.dateString = this.currentDate.toLocaleDateString();
  }

  addTag(tag : String) {
    if(tag.length > 0) this.currentTags.add(tag);

    this.currentTagInput = '';
  }

  removeTag(tag) {
    this.currentTags.delete(tag);
  }

  onSubmit() {
    let tagString = "";
    this.currentTags.forEach((tag) => {
      tagString += tag;
      tagString += ',';
    });
    tagString = tagString.substr(0, tagString.length - 1); //Remove extra comma

    let object = {
      name : this.currentNameInput,
      text : this.htmlContent,
      tags : tagString,
      date : this.currentDate.toISOString(),
      dateString : this.dateString,
      id : this.entryService.nextID
    };

    let subscription = this.database.object('/nextID').valueChanges().subscribe((value : number) => {
      this.database.database.ref('/nextID').set(value + 1);
      subscription.unsubscribe();
    });

    console.log("Entry HTML:", this.htmlContent);
    this.database.database.ref('/entries').push(object);
    this.router.navigateByUrl('/home');
  }
}