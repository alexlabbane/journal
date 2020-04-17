import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  //TODO: Move filtering from entry-view to filterservice
  //Serve active entries as observable to be subscribed to in entry-view
  //Will allow more easily searching by tags and searching by filter string
  entries = []; //Stores all journal entries
  activeEntries = []; //Stores entries that match current filter
  filter = "";
  words = []; //Stores list of sets; each set contains entry words in order
  activeSearchTags = []; //Stores list of active tags to filter by

  constructor(private database : AngularFireDatabase) { }

  subscribeToDatabase() {
    console.log("init");
    //Subscribe to journal entries
    this.database.list('/entries').valueChanges().subscribe((values : []) => {
      this.entries = [];
      this.words = [];

      values.sort(function(a : any, b : any) {
        let aDate = new Date(a.date);
        let bDate = new Date(b.date);
        return bDate.getTime() - aDate.getTime();
      });

      values.forEach((value) => {
        let toPush : any = value;
        let tags : String = toPush.tags;

        //Create word set for each entry
        let entry = toPush.text
        let wordSet = new Set();
        let text = this.stripTextHTML(entry);
        let wordList = text.split(" ");

        for(let j = 0; j < wordList.length; j++) {
          let word = wordList[j].trim().toLowerCase();
          if(word.length > 0) wordSet.add(word);
        }
        //console.log(wordSet);
        this.words.push(wordSet);

        toPush.tags = new Set(tags.split(","));
        toPush.tags.delete('');
        if(toPush.name.length > 0 && toPush.text.length > 0) this.entries.push(value);
      });
      console.log("DONE");
      this.filterItems();
    });     
  }

  stripTextHTML(html) {
    let stripped = "";
    let valid = true; //Valid if not between html tags

    for(let i = 0; i < html.length; i++) {
      if(html[i] == "<") {
        valid = false;
      } else if(html[i] == ">") {
        valid = true;
        stripped += " ";
      } else {
        if(valid) stripped += html[i];
      }
    }

    //console.log("Stripped: " + stripped);
    return stripped;
  }

  filterItems() {
    this.activeEntries = [];
    let filterWords = this.filter.split(" ");
    //If no filter
    if(this.filter.trim().length == 0 && this.activeSearchTags.length == 0) {
      this.activeEntries = this.entries;
      return;
    }

    let requiredMatches = this.activeSearchTags.length; //For Tags
    //console.log("Search tag length: " + this.activeSearchTags.length);
    for(let i = 0; i < this.entries.length; i++) {
      requiredMatches = this.activeSearchTags.length;
      //console.log("try");
      //Filter by Tag
      let entry : any = this.entries[i];
      let matches = 0;
      for(let j = 0; j < this.activeSearchTags.length; j++) {
        if(!entry.tags.has(this.activeSearchTags[j])) break;
        else matches = matches + 1;
      }

      console.log(matches + " " + requiredMatches);
      if(matches != requiredMatches) continue;
      //Filter by Text
      requiredMatches = filterWords.length;
      if(this.filter.trim().length == 0) requiredMatches = 0;
      matches = 0;
      for(let j = 0; j < filterWords.length; j++) {
        if(this.words[i].has(filterWords[j].toLowerCase())) matches += 1;
        else break;
      }

      console.log(matches + " " + requiredMatches);
      if(matches != requiredMatches) continue;

      //Add if both passed
      console.log("add");
      this.activeEntries.push(entry);
    }
  }

  setFilter(newFilter) {
    this.filter = newFilter;
    console.log("The new filter: " + this.filter);
  }

  getFilter() {
    return this.filter;
  }
}
