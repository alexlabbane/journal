import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { EntryServiceService } from '../entry-service.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  settings = [];
  currentTagInput = "";

  constructor(public database : AngularFireDatabase, public entryService : EntryServiceService) { }

  ngOnInit() {}

  addTag() {
    let tagsList = this.currentTagInput.split(",");
    let newTags = false;

    for(let i = 0; i < tagsList.length; i++) {
      tagsList[i] = tagsList[i].trim();
      if(!this.entryService.tags.has(tagsList[i])) {
        this.entryService.tags.add(tagsList[i]);
        newTags = true;
      }
    }

    this.currentTagInput = '';
    if(!newTags) return; //No new tags qualify, so don't modify any data

    let tagString = ""
    this.entryService.tags.forEach((tag) => {
      tagString += tag;
      tagString += ",";
    });

    this.database.database.ref('/tags').set(tagString);
  }

  removeTag(tag) {
    this.entryService.tags.delete(tag);

    let tagString = ""
    this.entryService.tags.forEach((tag) => {
      tagString += tag;
      tagString += ",";
    });

    this.database.database.ref('/tags').set(tagString);
  }

}
