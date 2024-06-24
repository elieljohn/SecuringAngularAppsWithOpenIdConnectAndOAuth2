import { Injectable } from "@angular/core";
import { CoreModule } from "./core.module";
import { User, UserManager } from "oidc-client";
import { Constants } from "../constants";


@Injectable({ providedIn: CoreModule })
export class AuthService {
  private _userManager: UserManager;
  private _user: User;

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
    // Initialize _userManager in the constructor
    this._userManager = new UserManager(stsSettings);
  }
}