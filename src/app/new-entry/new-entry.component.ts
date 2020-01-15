import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
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
  isEdit : boolean;
  editedID : number;

  constructor(public database : AngularFireDatabase, public router : Router, public entryService : EntryServiceService) { }

  ngOnInit() {
    this.currentDate = new Date();
    this.isEdit = this.entryService.isEdit;
    this.editedID = this.entryService.editID;
    console.log(this.entryService.editID + " is edit id");
    this.entryService.isEdit = false;

    if(this.isEdit) {
      //Update content to match object being edited
      let entry = this.entryService.editObject;

      this.currentNameInput = entry.name;
      this.currentDate = new Date(entry.date);
      this.htmlContent = entry.text;
      
      this.currentTags = entry.tags
    }

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
    if(this.isEdit) {
      //console.log("Updating entry");
      this.updateEntry();
    } else {

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

      //console.log("Entry HTML:", this.htmlContent);
      this.database.database.ref('/entries').push(object);
    }

    this.isEdit = false;

    this.router.navigateByUrl('/home');
  }

  updateEntry() {
    //Called on event submission if event is an edit    
    let outerSub = this.database.list('/entries').valueChanges().subscribe((values) => {
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
        id : this.entryService.editObject.id
      };

      let editedID = this.entryService.editID;
      //console.log("Editing id " + this.editedID);
      let index = 0;
      values.forEach((value : any) => {
        //console.log("test");
        //console.log(editedID + " " + value.id);
        if(value.id == editedID) {
          let editedIndex = index;
          //console.log("Edited ID found");
          let innerSub = this.database.list('/entries').snapshotChanges().subscribe((snapshots) => {
            let currentIndex = 0;
            snapshots.forEach((snapshot) => {
              //console.log("Current " + currentIndex  + "Edited " + editedIndex);
              if(currentIndex == editedIndex) {
                //console.log("Update fired");
                this.database.object('/entries/' + snapshot.key).update(object);
              }
              currentIndex += 1;
            });
            innerSub.unsubscribe();
          });  
        }

        index += 1;
      });

      outerSub.unsubscribe();
    });
  }
}