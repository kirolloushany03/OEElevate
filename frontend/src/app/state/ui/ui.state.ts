import { Injectable } from '@angular/core';
import { State, Selector } from '@ngxs/store';

export interface UiStateModel {
    items: string[];
}

@State<UiStateModel>({
    name: 'ui',
    defaults: {
        items: []
    }
})
@Injectable()
export class UiState {

    @Selector()
    static getState(state: UiStateModel) {
        return state;
    }

}
