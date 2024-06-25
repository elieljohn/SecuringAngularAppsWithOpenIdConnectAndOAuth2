import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth-service.component';

@Component({
  selector: 'app-signout-callback',
  template: `<div></div>`
})

export class SignoutRedirectCallbackComponent implements OnInit {
  constructor(private _authService: AuthService,
              private _router: Router) { }

  ngOnInit() {
    // Call completeLogout from AuthService
    this._authService.completeLogout().then(_ => {
      // Navigate to the root path of the application
      this._router.navigate(['/'], { replaceUrl: true });
    })
  }
}