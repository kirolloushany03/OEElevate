import { Injectable } from '@angular/core';
import { State, Selector } from '@ngxs/store';

export interface AuthStateModel {
    items: string[];
}

@State<AuthStateModel>({
    name: 'auth',
    defaults: {
        items: []
    }
})
@Injectable()
export class AuthState {
    @Selector()
    static getState(state: AuthStateModel) {
        return state;
    }

}
