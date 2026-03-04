import { HomeService } from '@/app/core/services/home-service';
import { ProfileService } from '@/app/core/services/profile-service';
import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { environment } from '@/environment/environment';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Route,
  Router,
  RouterLink,
  RouterOutlet,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, RouterOutlet, CommonModule, IconsModule,RouterModule],
  templateUrl: './dashboard.html',
})
export class dashboardLayout {
  pageName = '';
  showRightSidebar = false;
  avatarUrl: string = '';
  name: string = '';
  username: string = '';
  links: any[] = [];
  theme: any;

  socialItems=[
    { platform: 'instagram', icon: '/images/instagram.png' },
    { platform: 'facebook', icon: '/images/facebook.png' },
    { platform: 'youtube', icon: '/images/youtube.png' },
    { platform: 'spotify', icon: '/images/spotify.png' },
    { platform: 'slack', icon: '/images/slack.png' },
    { platform: 'x', icon: '/images/x.png' },
    { platform: 'snapchat', icon: '/images/snapchat.png' },
    { platform: 'github', icon: '/images/github.png' },
    { platform: 'linkedin', icon: '/images/linkedin.png' },
    { platform: 'discord', icon: '/images/discord.png' },
    { platform: 'telegram', icon: '/images/telegram.png' },
    { platform: 'substack', icon: '/images/substack.png' },
    { platform: 'pinterest', icon: '/images/pinterest.png' },
    { platform: 'twitch', icon: '/images/twitch.png' },
    { platform: 'whatsapp', icon: '/images/whatsapp.png' },
    { platform: 'threads', icon: '/images/threads.png' },
    { platform: 'reddit', icon: '/images/reddit.png' },
    { platform: 'mail', icon: '/images/mail.png' },
    { platform: 'applemusic', icon: '/images/applemusic.png' },
  ]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authStore: AuthStore,
    private profileService: ProfileService, 
    private homeService: HomeService,
    private cd: ChangeDetectorRef,
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      let currentRoute = this.route;

      while (currentRoute.firstChild) {
        currentRoute = currentRoute.firstChild;
      }

      this.pageName = currentRoute.snapshot.data?.['name'] || '';
      this.showRightSidebar = currentRoute.snapshot.data?.['rightSidebar'] || false;
    });
  }

  ngOnInit(): void {
    this.profileService.getProfile().subscribe((res) => {
      console.log('res', res);
      if (res && res.data) {
        this.name = res.data.display_name ?? 'checkin';
        this.username = res.data.username ?? '';
        if (res.data.avatar_url) {
          this.avatarUrl = `${environment.backend}${res?.data?.avatar_url}`;
        } else {
          this.avatarUrl = res.data.avatar_url ?? '';
        }

        console.log('Hello: ', this.avatarUrl);
        this.cd.detectChanges();
      }
    });

     const path = this.router.url.slice(1);
    this.homeService.getHomePage(path).subscribe((res) => {
      if (res && res.data) {
        this.name = res.data.profile.display_name ?? this.name;
        this.username = res.data.user.username ?? this.username;
        if (res.data.profile.avatar_url) {
          this.avatarUrl = `${environment.backend}${res?.data?.profile?.avatar_url}`;
        }

        // Map links with icons
        this.links = res.data.links.map((link: any) => {
          const iconItem = this.socialItems.find(
            (item) => item.platform === link.platform.toLowerCase(),
          );
          return {
            ...link,
            icon: iconItem ? iconItem.icon : '',
          };
        });

        this.theme = res.data.theme;
        this.cd.detectChanges();
      }
    });
  }
   

  logout() {
    this.authStore.clear();
    this.router.navigate(['/login']);
  }
}
