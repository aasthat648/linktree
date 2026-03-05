import { ProfileService } from '@/app/core/services/profile-service';
import { AuthStore } from '@/app/store/auth';
import { Component, ChangeDetectorRef } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UpdateProfileBody } from '@linktree/validation';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-username',
  imports: [ReactiveFormsModule],
  templateUrl: './username.html',
})
export class Username {
  usernameForm = new FormGroup({
    username: new FormControl('', Validators.required),
  });

  loading: boolean = false;

  constructor(
    private authStore: AuthStore,
    private router: Router,
    private profileService: ProfileService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((res) => {
      if (res?.data?.username) {
        this.usernameForm.patchValue({ username: res.data.username });
        this.cd.detectChanges();
      }
    });
  }

  // username.ts
  handleUsername() {
    const username = this.usernameForm.value.username?.trim();

    if (!username) {
      this.toastr.error('Please enter a valid username');
      return;
    }

    this.loading = true;

    this.profileService.updateUsername(username).subscribe({
      next: (res) => {
        this.loading = false;

        if (res?.data?.username) {
          const currentUser = this.authStore.snapshot;

          if (currentUser) {
            this.authStore.setUser({ ...currentUser, username: res.data.username });
          }

          this.toastr.success('Username updated successfully');
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.toastr.error(err?.error?.message || 'Failed to update username');
      },
    });
  }
}
