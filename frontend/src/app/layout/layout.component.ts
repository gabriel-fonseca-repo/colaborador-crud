import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataTableComponent } from "../data-table/data-table.component";

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, DataTableComponent],
  styleUrl: './layout.component.css',
  template: `
    <router-outlet></router-outlet>
  `,
})
export class LayoutComponent {

}
