import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title = 'EduRoom';

  /* Limpieza total de Bootstrap */
  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = 'auto';
        document.querySelectorAll('.modal-backdrop')
          .forEach(el => el.remove());
      });
  }
}
