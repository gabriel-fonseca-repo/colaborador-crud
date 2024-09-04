import { Component } from '@angular/core';
import { LayoutComponent } from './layout/layout.component';
import { NavComponent } from './nav/nav.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LayoutComponent, NavComponent],
  styleUrl: './app.component.css',
  template: `
    <main>
      <header>
        <app-nav />
      </header>
      <section>
        <app-layout />
      </section>
      <footer>
      </footer>
    </main>
  `
})
export class AppComponent {
  title = 'Colaborador CRUD';
}
