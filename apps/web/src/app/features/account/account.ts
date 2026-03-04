import { ProfileService } from '@/app/core/services/profile-service';
import { AuthStore } from '@/app/store/auth';
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpdateProfileBody } from '@linktree/validation';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-account',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './account.html',
})
export class Account {
  userName$!: Observable<string>;
  Name$!: Observable<string>;
  avatarUrl: string = '';
  name: string = '';
  username: string = '';
  bio: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private authStore: AuthStore,
    private profileService: ProfileService,
  ) {
    this.userName$ = this.authStore.user$.pipe(
      filter((user): user is any => !!user),
      map((user) => user.username),
    );
    this.Name$ = this.authStore.user$.pipe(
      filter((user): user is any => !!user),
      map((user) => user.name),
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = (e) => (this.avatarUrl = reader.result as string);
      reader.readAsDataURL(file);

      this.uploadFile(file);
    }
  }

  async uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res: any = await this.profileService.uploadAvatar(formData).toPromise();
      this.avatarUrl = res.data.url;
    } catch (err) {
      console.error('Failed to upload avatar:', err);
    }
  }

  saveProfile() {
    const payload: UpdateProfileBody = {
      display_name: this.name,
      username: this.username,
      bio: this.bio ?? '',
      avatar_url: this.avatarUrl ?? '', // Send the relative URL
    };

    this.profileService.UpdateProfile(payload).subscribe({
      next: (res) => {
        console.log('Profile updated:', res.data);
        // Optionally update AuthStore here
      },
      error: (err) => console.error('Update failed:', err),
    });
  }
}
