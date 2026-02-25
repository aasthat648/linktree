import { AuthStore } from '@/app/store/auth';
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-account',
  imports: [AsyncPipe],
  templateUrl: './account.html',
})
export class Account {
  userEmail$!: Observable<string>;
  constructor(private authStore: AuthStore) {
    this.userEmail$ = this.authStore.user$.pipe(
      filter((user): user is any => !!user),
      map((user) => user.email),
    );
  }
}
