import { ProfileService } from '@/app/core/services/profile-service';
import { ThemeService } from '@/app/core/services/theme-service';
import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { environment } from '@/environment/environment';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpdateProfileBody, UpdateThemeBody } from '@linktree/validation';
import { filter, forkJoin, map, Observable } from 'rxjs';

type PageType = 'main' | 'header' | 'wallpaper' | 'buttons' | 'text' | 'colors';
@Component({
  selector: 'app-design',
  imports: [CommonModule, IconsModule, FormsModule],
  templateUrl: './design.html',
})
export class Design {
  selectedStyle: string = 'fill';
  backgroundColor: string = '#ECEEF1';
  currentPage: PageType = 'main';
  gradientColor1: string = '#8B5CF6';
  gradientColor2: string = '#60A5FA';
  buttonStyle: string = 'solid';
  buttonRadius: string = 'rounder';
  buttonShadow: string = 'none';
  buttonColor: string = '#FFFFFF';
  buttonTextColor: string = '#000000';
  imagePreview: string | ArrayBuffer | null = null;
  pageTextColor = '#000000';
  titleColor = '#000000';
  avatarUrl: string = '';
  name: string = '';
  selectedFile: File | null = null;
  theme: any = null;

  constructor(
    private authStore: AuthStore,
    private profileService: ProfileService,
    private cd: ChangeDetectorRef,
    private themeService: ThemeService,
  ) {}

  styles = [
    { id: 'fill', label: 'Fill' },
    { id: 'gradient', label: 'Gradient' },
    { id: 'blur', label: 'Blur' },
    { id: 'pattern', label: 'Pattern' },
    { id: 'image', label: 'Image' },
    { id: 'video', label: 'Video' },
  ];

  selectStyle(id: string) {
    this.selectedStyle = id;
  }

  openPage(page: PageType) {
    this.currentPage = page;
  }

  goBack() {
    this.currentPage = 'main';
  }

  ngOnInit(): void {
    // Load profile + theme together
    forkJoin({
      profile: this.profileService.getProfile(),
      theme: this.themeService.getTheme(),
    }).subscribe({
      next: ({ profile, theme }) => {
        // Profile
        if (profile?.data) {
          this.name = profile.data.display_name ?? 'checkin';
          this.avatarUrl = profile.data.avatar_url
            ? `${environment.backend}${profile.data.avatar_url}`
            : (profile.data.avatar_url ?? '');
        }

        // Theme
        if (theme?.data) {
          this.theme = theme.data;

          // Example: apply theme to your variables
          this.backgroundColor = this.theme.background?.value ?? this.backgroundColor;
          this.buttonColor = this.theme.button?.color ?? this.buttonColor;
          this.buttonTextColor = this.theme.button?.textColor ?? this.buttonTextColor;
          this.buttonStyle = this.theme.button?.style ?? this.buttonStyle;
          this.buttonRadius = this.theme.button?.radius ?? this.buttonRadius;
          this.pageTextColor = this.theme.text?.pageColor ?? this.pageTextColor;
          this.titleColor = this.theme.text?.titleColor ?? this.titleColor;
          this.selectedStyle = this.theme.wallpaper?.style ?? this.selectedStyle;
          this.gradientColor1 = this.theme.wallpaper?.gradient1 ?? this.gradientColor1;
          this.gradientColor2 = this.theme.wallpaper?.gradient2 ?? this.gradientColor2;
          this.imagePreview = this.theme.wallpaper?.image ?? null;
        }
        console.log('api called');

        this.cd.detectChanges();
      },
      error: (err) => console.error('Failed to load profile or theme', err),
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarUrl = reader.result as string;
      this.cd.detectChanges();
    };
    reader.readAsDataURL(file);

    this.uploadFile(file);
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    this.profileService.uploadAvatar(formData).subscribe({
      next: (res: any) => {
        this.avatarUrl = `${environment.backend}${res?.data?.path}`; // returned from backend
        console.log('Image: ', { image: this.avatarUrl });
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Upload failed', err);
      },
    });
  }

  saveProfile() {
    const payload: UpdateProfileBody = {
      display_name: this.name,

      avatar_url: this.avatarUrl.includes(environment.backend)
        ? this.avatarUrl.replace(environment.backend, '')
        : (this.avatarUrl ?? ''), // Send the relative URL
    };

    console.log('payload', payload);

    this.profileService.UpdateProfile(payload).subscribe({
      next: (res) => {
        console.log('Profile updated:', res.data);
        this.cd.detectChanges();
      },
      error: (err) => console.error('Update failed:', err),
    });
  }

  saveTheme() {
    type BackgroundType = 'solid' | 'gradient' | 'image';
    const bgType: BackgroundType =
      this.selectedStyle === 'fill' ? 'solid' : (this.selectedStyle as BackgroundType);

    const bgValue: string =
      this.selectedStyle === 'fill'
        ? this.backgroundColor
        : this.selectedStyle === 'gradient'
          ? `linear-gradient(to right, ${this.gradientColor1}, ${this.gradientColor2})`
          : (this.imagePreview as string) || '';

    const payload: UpdateThemeBody = {
      background: {
        type: bgType,
        value: bgValue,
      },
      button: {
        variant: this.buttonStyle as 'solid' | 'outline',
        radius: this.buttonRadius as 'square' | 'rounded',
        color: this.buttonColor,
        textColor: this.buttonTextColor,
      },
      text: {
        font: 'Link Sans',
        pageColor: this.pageTextColor,
        titleColor: this.titleColor,
      },
    };

    this.themeService.updateTheme(payload).subscribe({
      next: (res) => {
        console.log('Theme updated:', res.data);
        alert('Theme updated successfully!');
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Failed to update theme', err);
        alert('Failed to update theme');
      },
    });
  }
}
