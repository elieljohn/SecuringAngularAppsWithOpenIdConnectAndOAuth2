import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/auth-service.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin-callback',
  template: `<div></div>`
})

export class SigninRedirectCallbackComponent implements OnInit {
  constructor(private _authService: AuthService,
              private _router: Router) { }

  ngOnInit() {
    // Call the completeLogin() method
    this._authService.completeLogin().then(user => {
      // Component navigates to the root path of the application using the Router service
      this._router.navigate(['/'], { replaceUrl: true });
    })
  }
}