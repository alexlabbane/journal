import { Component, OnInit } from '@angular/core';
import { $ } from 'protractor';
import { Router } from '@angular/router';

@Component({
  selector: 'nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  constructor(public router : Router) { }

  ngOnInit() { }

  distributeSideNav() {
    const navLinks = document.querySelectorAll('.link');
    let windowHeight = window.innerHeight - 114;
    let marginEach = windowHeight / (1 + navLinks.length) - 10;
    for(let i = 0; i < navLinks.length; i++) {
      let margin = 0;
      let navLink = navLinks[i] as HTMLElement;

      if(i == 0) margin = 64 +marginEach;
      else margin = marginEach;


      navLink.style.marginTop = margin.toString() + 'px';
      console.log(margin);
      console.log("Set");
    }
  }

  ngAfterContentInit() {    
    //Add event listener for window resize
    window.addEventListener('resize', () => {
      this.distributeSideNav(); //For event listener
    });
    this.distributeSideNav(); //On init
  }

  toggleNavigationLinks() {
    this.distributeSideNav();

    const hamburger = document.querySelector('.right');
    const sideNav = document.querySelector('.sideNav');
    
    sideNav.classList.toggle('sideNavActive');
    hamburger.classList.toggle('hamburgerActive');
  }
}
