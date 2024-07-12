import { TestBed } from '@angular/core/testing';
import {  provideStore,  Store } from '@ngxs/store';
import { MachinesState, MachinesStateModel } from './machines.state';
import { GetMachines } from './machines.actions';

describe('Machines store', () => {
  let store: Store;
  beforeEach(() => {
    TestBed.configureTestingModule({
       providers: [provideStore([MachinesState])]

    });

    store = TestBed.inject(Store);
  });

  it('should create an action and add an item', () => {
    const expected: MachinesStateModel = {
      items: ['item-1']
    };
    store.dispatch(new GetMachines('item-1'));
    const actual = store.selectSnapshot(MachinesState.getState);
    expect(actual).toEqual(expected);
  });

});
