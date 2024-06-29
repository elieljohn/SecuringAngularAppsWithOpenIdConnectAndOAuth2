import { Component, OnInit } from '@angular/core';
import { AuthService } from './core/auth-service.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  isLoggedIn = false;

  constructor(private _authService: AuthService) {
    // Update isLoggedIn to the new login state value whenever the loginChanged observable emits a new value
    this._authService.loginChanged.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    })
  }

  ngOnInit() {
    // Call isLoggedIn from AuthService, which returns a Promise
    this._authService.isLoggedIn().then(loggedIn => {
      // Update AppComponent's isLoggedIn when the Promise is returned
      this.isLoggedIn = loggedIn;
    })
  }

  // Triggers a redirect of the current window to the authorization endpoint
  login() {
    this._authService.login();
  }

  // Calls logout() from AuthService
  logout() {
    this._authService.logout();
  }

  // validate if the user is an admin
  isAdmin() {
    return this._authService.authContext && this._authService.authContext.isAdmin;
  }
}
