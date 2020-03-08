import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private router : Router) { }

  canActivate(): boolean {
    if (sessionStorage.getItem('loggedIn') != 'true') {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}
