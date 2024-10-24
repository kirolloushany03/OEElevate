import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import TextBox, { Properties as TextBoxProperties } from 'devextreme/ui/text_box';
import Toast, { Properties as ToastProperties } from 'devextreme/ui/toast';
import { GetUserInfo } from './auth/state/auth.actions';

@Component({
  selector: 'oee-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor(private store: Store) {
    const allDevicesConfig = [
      { deviceType: 'desktop' as const },
      { deviceType: 'tablet' as const },
      { deviceType: 'phone' as const },
    ];

    allDevicesConfig.forEach(deviceConfig => {
      TextBox.defaultOptions<TextBoxProperties>({
        device: deviceConfig,
        options: {
          validationMessageMode: 'always',
          valueChangeEvent: 'change'
        }
      });

      Toast.defaultOptions<ToastProperties>({
        device: deviceConfig,
        options: {
          position: {
            at: {
              x: 'right',
              y: 'bottom'
            },
            my: {
              x: 'right',
              y: 'bottom'
            },
            offset: {
              x: -10,
              y: -10
            }
          }
        }
      })
    });

    this.store.dispatch(new GetUserInfo())
  }
}
