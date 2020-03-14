import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  username = '';
  password = '';
  submitted = false;

  constructor(private router : Router, private database : AngularFireDatabase, private http : HttpClient) { }

  ngOnInit() {
    if(sessionStorage.getItem('loggedIn') == "true") {
      //this.router.navigateByUrl('/home');
    }
  }

  onSubmit() {
    const httpOptions = {
      withCredentials : true
    };

    this.submitted = true; //Triggers progress spinner to show

    this.http.get("https://us-central1-material-journal.cloudfunctions.net/authenticateUser?username=" + this.username + "&password=" + this.password).subscribe((authenticated) => {
      if(authenticated) {
        //console.log("Yes");
        this.router.navigateByUrl('/home');
        sessionStorage.setItem('loggedIn', 'true');
      } else {
        //console.log("No");
        window.alert("Username or Password incorrect.");
        sessionStorage.setItem('loggedIn', 'false');
        this.submitted = false;
      }
    });

  }

}
