import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngxs/store';
import TextBox, { Properties as TextBoxProperties } from 'devextreme/ui/text_box';
import { GetUserInfo } from './auth/state/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(private store: Store) {
    const devicesConfig = [
      { deviceType: 'desktop' as const },
      { deviceType: 'tablet' as const },
      { deviceType: 'phone' as const },
    ];

    devicesConfig.forEach(deviceConfig => {
      TextBox.defaultOptions<TextBoxProperties>({
        device: deviceConfig,
        options: {
          validationMessageMode: 'always',
          valueChangeEvent: 'change'
        }
      });
    });

    this.store.dispatch(new GetUserInfo())
  }
}
