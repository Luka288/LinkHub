import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly routeData = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let route: ActivatedRoute = this.activatedRoute;
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route.snapshot?.data;
      }),
    ),
    { initialValue: this.activatedRoute.snapshot.data },
  );
}
