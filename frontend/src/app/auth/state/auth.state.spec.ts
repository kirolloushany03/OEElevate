import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { AuthState, AuthStateModel } from './auth.state';

describe('Auth state', () => {
    let store: Store;

    beforeEach(() => {
      TestBed.configureTestingModule({
       providers: [provideStore([AuthState])]
      
      });

      store = TestBed.inject(Store);
    });

    it('should create an empty state', () => {
        const actual = store.selectSnapshot(AuthState.getState);
        const expected: AuthStateModel = {
            items: []
        };
        expect(actual).toEqual(expected);
    });

});
