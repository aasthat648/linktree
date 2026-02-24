import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-link',
  imports: [CommonModule, IconsModule],
  templateUrl: './link.html',
})
export class Link {
  userEmail$!: Observable<string>;

  constructor(private authStore: AuthStore) {
    this.userEmail$ = this.authStore.user$.pipe(
      filter((user): user is any => !!user),
      map((user) => user.email),
    );
  }
}
