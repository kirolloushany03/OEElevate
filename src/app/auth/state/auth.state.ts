import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { Login, Logout } from './auth.actions';

export interface AuthStateModel {
    loggedIn: boolean;
}

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        loggedIn: true
    }
})
@Injectable()
export class AuthState {
    @Selector()
    static isLoggedIn(state: AuthStateModel) {
        return state?.loggedIn;
    }

    @Action(Login)
    login({ patchState }: StateContext<AuthStateModel>, { email, password }: Login) {
        patchState({
            loggedIn: true
        });
    }

    @Action(Logout)
    logout({ patchState }: StateContext<AuthStateModel>) {
        patchState({
            loggedIn: false
        });
    }
}
