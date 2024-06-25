import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { UiState, UiStateModel } from './ui.state';

describe('Ui state', () => {
    let store: Store;

    beforeEach(() => {
      TestBed.configureTestingModule({
       providers: [provideStore([UiState])]
      
      });

      store = TestBed.inject(Store);
    });

    it('should create an empty state', () => {
        const actual = store.selectSnapshot(UiState.getState);
        const expected: UiStateModel = {
            items: []
        };
        expect(actual).toEqual(expected);
    });

});
