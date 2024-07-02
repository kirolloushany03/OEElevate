import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { GetUserInfo, Login, Logout, SignUp } from './auth.actions';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { catchError, map, tap } from 'rxjs';
import { storeLocally } from '../../utlils/operators';

export interface AuthStateModel {
    token: string | null;
    loggedIn: boolean | null;
    userInfo: any;
    signUpError: string | null;
    loginError: string | null;
}

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        token: null,
        loggedIn: null,
        userInfo: null,
        signUpError: null,
        loginError: null
    }
})
@Injectable()
export class AuthState {
    constructor (private authService: AuthService, private router: Router) {}

    @Selector()
    static isLoggedIn(state: AuthStateModel) {
        return state?.loggedIn;
    }

    @Action(Login)
    login({ patchState }: StateContext<AuthStateModel>, { payload }: Login) {
        return this.authService.login(payload).pipe(
            map((res:any) => res['access_token']),
            storeLocally('token'),
            tap({
                next: (access_token:any) => {
                    patchState({
                        token: access_token,
                        loggedIn: true,
                        loginError: null
                    });
                    this.router.navigate(['/']);
                },
                error: error => patchState({
                    loginError: error.error
                })
            })
        );
    }

    @Action(GetUserInfo)
    getUserInfo({ patchState, dispatch }: StateContext<AuthStateModel>) {
        patchState({
            token: localStorage.getItem('token'),
        })

        return this.authService.getUserInfo().pipe(
            tap({
                next: (userInfo) => {
                    patchState({
                        userInfo,
                        loggedIn: true
                    });
                },
            }),
        );
    }

    @Action(SignUp)
    signUp({ patchState }: StateContext<AuthStateModel>, {payload}: SignUp) {
        return this.authService.register(payload).pipe(
            tap({
                next: () => {
                    patchState({
                        signUpError: null
                    });
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    patchState({
                        signUpError: error.error
                    });
                }
            })
        );
    }

    @Action(Logout)
    logout({ patchState }: StateContext<AuthStateModel>) {
        patchState({
            token: null,
            loggedIn: false,
        });
        this.router.navigate(['/']);
    }
}
