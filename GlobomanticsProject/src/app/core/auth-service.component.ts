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
      post_logout_redirect_uri: `${Constants.clientRoot}signout-callback`,
      // metadata: {
      //   issuer: `${Constants.stsAuthority}`,
      //   authorization_endpoint: `${Constants.stsAuthority}authorize?audience=projects-api`,
      //   jwks_uri: `${Constants.stsAuthority}.well-known/jwks.json`,
      //   token_endpoint: `${Constants.stsAuthority}oauth/token`,
      //   userinfo_endpoint: `${Constants.stsAuthority}userinfo`,
      //   end_session_endpoint: `${Constants.stsAuthority}v2/logout?client_id=${Constants.clientId}&returnTo=${encodeURI(Constants.clientRoot)}signout-callback`
      // }
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

  // Completes the login process after the user has been redirected back to the application from the authorization server
  completeLogin() {
    return this._userManager.signinRedirectCallback().then(user => {
      // Update the _user with the property with the returned User object
      this._user = user;

      // Publish a boolean value to the _loginChangedSubject observable
      this._loginChangedSubject.next(!!user && !user.expired);

      // Return the user object
      return user;
    });
  }

  // Initiate the logout process
  logout() {
    this._userManager.signoutRedirect();
  }

  // Update the internal state of the AuthService to reflect the user's logout status
  completeLogout() {
    // Clear user's login state
    this._user = null;

    // Processes the response from the authentication provider's logout page and complete the logout process
    return this._userManager.signoutRedirectCallback();
  }

  // retrieve the access token for the currently authenticated user
  getAccessToken() {
    return this._userManager.getUser().then(user => {
      if (!!user && !user.expired) {
        return user.access_token;
      }
      else {
        return null;
      }
    });
  }
}