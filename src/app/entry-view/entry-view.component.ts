import { Component, OnInit, Inject, ComponentFactoryResolver } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { Data, Router } from '@angular/router';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { EntryServiceService } from '../entry-service.service';
import { identifierModuleUrl } from '@angular/compiler';
import { FilterService } from '../filter.service';

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

  constructor(public dialog : MatDialog, public database : AngularFireDatabase, public EntryService : EntryServiceService, public filterService : FilterService) { }

  ngOnInit() { 
    this.filterService.subscribeToDatabase();
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

  openDialog(name, tags, text, date, dateString, id) {
    const dialogRef = this.dialog.open(EventDialog, {
      height: '80%',
      width: '800px',
      data : {
        name: name,
        tags: tags,
        text: text,
        date : date,
        dateString : dateString,
        id : id
      }
    });
  }

  filterItems() {
    this.filterService.activeSearchTags = this.activeSearchTags;
    this.filterService.filterItems();
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
    public database : AngularFireDatabase,
    public router : Router,
    public entryService : EntryServiceService,
    public dialogRef: MatDialogRef<EventDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Data) { 
      console.log(data);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

  editClick() {
    //TODO edit item based on data.id
    console.log("edit");
    this.entryService.isEdit = true;
    this.entryService.editID = this.data.id;
    this.entryService.editObject = this.data;

    this.dialogRef.close();
    this.router.navigateByUrl('/new-entry');
  }

  deleteClick() {
    //TODO delete item based on data.id
    //Open a confirmation dialog
    let result = window.confirm("Are you sure you would like to delete this journal entry? It cannot be recovered.");
    
    if(result) {
      //Find event and delete it from the database
      let deletedID = this.data.id;
      let outerSub = this.database.list('/entries').valueChanges().subscribe((values) => {
        let index = 0;
        values.forEach((value : any) => {
          if(value.id == deletedID) {
            let indexToDelete = index;
            let innerSub = this.database.list('/entries').snapshotChanges().subscribe((snaps) => {
              let currentIndex = 0;
              snaps.forEach((snap) => {
                if(currentIndex == indexToDelete) {
                  this.database.list('/entries/' + snap.key).remove();
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

    this.dialogRef.close();
  }

}
