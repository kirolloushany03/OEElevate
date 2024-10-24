import { Injectable } from '@angular/core';
import { State, Selector, Action, StateContext } from '@ngxs/store';
import { GetUserInfo, Login, Logout, SignUp } from './auth.actions';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { storeLocally } from '../../utlils/operators';
import { UserInfo } from '../../models/auth';

export interface AuthTokens {
    access_token?: string;
    refresh_token?: string;
}

export interface AuthStateModel {
    token: string | null;
    loggedIn: boolean | null;
    userInfo: UserInfo | null;
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

    @Selector()
    static userInfo(state: AuthStateModel) {
        return state?.userInfo;
    }

    @Selector()
    static isEmployee(state: AuthStateModel) {
        return state?.userInfo?.is_employee || true
    }

    @Selector()
    static isAdmin(state: AuthStateModel) {
        return !(state?.userInfo?.is_employee) || false
    }

    @Action(Login)
    login({ patchState }: StateContext<AuthStateModel>, { payload }: Login) {
        return this.authService.login(payload).pipe(
            map((res) => res['access_token']),
            storeLocally('token'),
            tap({
                next: (access_token) => {
                    patchState({
                        token: access_token as string,
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
                next: (userInfo: unknown) => {
                    patchState({
                        userInfo: userInfo as UserInfo,
                        loggedIn: true
                    });
                },
                error: (_error) => {
                    patchState({
                        token: null,
                        loggedIn: false
                    });
                    dispatch(new Logout());
                }
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
        localStorage.removeItem('token');
    }
}
