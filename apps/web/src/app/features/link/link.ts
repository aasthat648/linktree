import { LinkService } from '@/app/core/services/link-service';
import { IconsModule } from '@/app/shared/components/icons';
import { AuthStore } from '@/app/store/auth';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateLinkBody } from '@linktree/validation';
import { ToastrService } from 'ngx-toastr';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-link',
  imports: [CommonModule, IconsModule, FormsModule],
  templateUrl: './link.html',
})
export class Link {
  UserName$!: Observable<string>;
  showPopup = false;
  selectedItems: any[] = [];
  isCardOpen = false;

  constructor(
    private authStore: AuthStore,
    private linkService: LinkService,
    private toastr: ToastrService,
  ) {
    this.UserName$ = this.authStore.user$.pipe(
      filter((user): user is any => !!user),
      map((user) => user.username),
    );
  }

  socialItems = [
    { platform: 'instagram', icon: 'images/insta.png' },
    { platform: 'facebook', icon: 'images/facebook.png' },
    { platform: 'youtube', icon: 'images/youtube.png' },
    { platform: 'spotify', icon: 'images/spotify.png' },
    { platform: 'slack', icon: 'images/slack.png' },
    { platform: 'x', icon: 'images/x.png' },
    { platform: 'snapchat', icon: 'images/snapchat.png' },
    { platform: 'github', icon: 'images/github.png' },
    { platform: 'linkedin', icon: 'images/linkedin.png' },
    { platform: 'discord', icon: 'images/discord.png' },
    { platform: 'telegram', icon: 'images/telegram.png' },
    { platform: 'substack', icon: 'images/substack.png' },
    { platform: 'pinterest', icon: 'images/pinterest.png' },
    { platform: 'twitch', icon: 'images/twitch.png' },
    { platform: 'whatsapp', icon: 'images/whatsapp.png' },
    { platform: 'threads', icon: 'images/threads.png' },
    { platform: 'reddit', icon: 'images/reddit.png' },
    { platform: 'mail', icon: 'images/mail.png' },
    { platform: 'applemusic', icon: 'images/applemusic.png' },
  ];

  selectSocial(item: any) {
    this.selectedItems.push({
      platform: item.platform,
      title: '',
      link: '',
      icon: item.icon,
      enabled: true,
    });
    this.togglePopup();
  }

  saveSingleLink(index: number) {
    const item = this.selectedItems[index];

    if (!item.title || !item.link) {
      this.toastr.error('Please fill both Title and Link.');
      return;
    }

    const payload: CreateLinkBody = {
      platform: item.platform,
      title: item.title,
      link: item.link,
    };

    this.linkService.createLink(payload).subscribe({
      next: (res) => {
        console.log('Link saved!', res);
        this.toastr.success(`${item.platform} link saved successfully!`);
        item.enabled = false;
      },
      error: (err) => {
        console.error('Failed to save link', err);
        this.toastr.error('Failed to save link. Try again.');
      },
    });
  }

  deleteLink(index: number) {
    this.selectedItems.splice(index, 1);
  }

  togglePopup() {
    this.showPopup = !this.showPopup;
  }
  openCard() {
    this.isCardOpen = true;
  }

  openLinkInTab(link: string | undefined) {
    if (!link) return;

    if (link) {
      window.open(link, '_blank');
    }
  }

  // openLinkInTab(link: string | undefined) {
  //   if (!link) return;

  //   const formattedLink = link.startsWith('http') ? link : `https://${link}`;
  //   window.open(formattedLink, '_blank');
  // }
}
