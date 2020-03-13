import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  //TODO: Move filtering from entry-view to filterservice
  //Serve active entries as observable to be subscribed to in entry-view
  //Will allow more easily searching by tags and searching by filter string

  filter = "";

  constructor() { }

  setFilter(newFilter) {
    this.filter = newFilter;
  }

  getFilter() {
    return this.filter;
  }
}
