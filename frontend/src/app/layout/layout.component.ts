import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet],
  styleUrl: './layout.component.css',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class LayoutComponent {

}
