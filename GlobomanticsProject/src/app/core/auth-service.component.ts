import { Injectable } from "@angular/core";
import { User, UserManager } from "oidc-client";
import { Subject } from "rxjs";
import { CoreModule } from "./core.module";
import { Constants } from "../constants";


@Injectable({ providedIn: CoreModule })
export class AuthService {
  private _userManager: UserManager;
  private _user: User;
  private _loginChangedSubject = new Subject<boolean>();

  loginChanged = this._loginChangedSubject.asObservable();

  constructor() {
    const stsSettings = {
      authority: Constants.stsAuthority,
      client_id: Constants.clientId,
      redirect_uri: `${Constants.clientRoot}signin-callback`,
      scope: 'openid profile projects-api',
      response_type: 'code',
      post_logout_redirect_uri: `${Constants.clientRoot}signout-callback`
    };
    // Configure the UserManager using the settings in stsSettings
    this._userManager = new UserManager(stsSettings);
  }

  // Trigger a redirect of the current window to the authorization endpoint
  login() {
    return this._userManager.signinRedirect();
  }

  // Checking whether the user is currently logged in or not
  isLoggedIn(): Promise<boolean> {
    return this._userManager.getUser().then(user => {
      const userCurrent = !!user && !user.expired;
      if (this._user !== user) {
        // Boolean to indicate the change in the user's login state
        this._loginChangedSubject.next(userCurrent);
      }

      // Update the _user property with the current user value
      this._user = user;

      // Boolean indicating whether the user is logged in or not
      return userCurrent;
    });
  }
}