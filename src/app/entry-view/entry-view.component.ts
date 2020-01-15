import { Component, OnInit, Inject, ComponentFactoryResolver } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Data } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { EntryServiceService } from '../entry-service.service';

@Component({
  selector: 'app-entry-view',
  templateUrl: './entry-view.component.html',
  styleUrls: ['./entry-view.component.scss']
})
export class EntryViewComponent implements OnInit {
  
  entries = []
  activeEntries = [];
  activeSearchTags = [];
  hidePreview = false;
  currentDate = new Date();

  constructor(public dialog : MatDialog, public database : AngularFireDatabase, public EntryService : EntryServiceService) { }

  ngOnInit() { 
    //Subscribe to journal entries
    this.database.list('/entries').valueChanges().subscribe((values : []) => {
      this.entries = [];
      
      values.sort(function(a : any, b : any) {
        let aDate = new Date(a.date);
        let bDate = new Date(b.date);
        return bDate.getTime() - aDate.getTime();
      });

      values.forEach((value) => {
        let toPush : any = value;
        let tags : String = toPush.tags;

        toPush.tags = new Set(tags.split(","));
        toPush.tags.delete('');
        if(toPush.name.length > 0 && toPush.text.length > 0) this.entries.push(value);
      });

      this.filterItems();
    }); 
  }

  ngAfterViewInit() { }

  openDialog(name, tags, text, date, dateString) {
    const dialogRef = this.dialog.open(EventDialog, {
      height: '80%',
      width: '800px',
      data : {
        name: name,
        tags: tags,
        text: text,
        date : date,
        dateString : dateString
      }
    });
  }

  filterItems() {
    this.activeEntries = [];
    //Filter by tag
    let requiredMatches = this.activeSearchTags.length;
    for(let i = 0; i < this.entries.length; i++) {
      let entry : any = this.entries[i];
      let matches = 0;
      for(let j = 0; j < this.activeSearchTags.length; j++) {
        if(!entry.tags.has(this.activeSearchTags[j])) break;
        else matches = matches + 1;
      }
      if(matches == requiredMatches) this.activeEntries.push(entry);
    }

    //TODO: Filter by search terms
  }

  filterDate() {
    console.log(this.currentDate.toISOString());
    let compareDate = new Date(this.currentDate.valueOf() + 24 * 60 * 60 * 1000);

    this.filterItems();
    for(let i = 0; i < this.activeEntries.length; i++) {
      let entryDate : Date = new Date(this.activeEntries[i].date);
      if (entryDate >= compareDate) {
        this.activeEntries.splice(i, 1);
        i--;
      } 
    }
  }

  search(elem) {
    //TODO: Place elem as only item in filter bar to search for tag
    //Fires when a tag is clicked on
    console.log(elem);
    for(let i = 0; i < this.activeSearchTags.length; i++) {
      if(this.activeSearchTags[i] == elem) return;
    }

    this.activeSearchTags.push(elem);
    this.filterItems();
  }

  unsearch(elem) {
    for(let i = 0; i < this.activeSearchTags.length; i++) {
      if (this.activeSearchTags[i] == elem) {
        this.activeSearchTags.splice(i, 1);
      }
    }
    this.filterItems();
  }

}

@Component({
  selector: "entry-dialog-",
  templateUrl: "entry-dialog.html",
  styleUrls: ["entry-dialog.scss"]
})
export class EventDialog {
  constructor(
    public dialogRef: MatDialogRef<EventDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Data) { 
      console.log(data);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
