import { NgModule } from '@angular/core';
import {
  LucideAngularModule,
  Cannabis,
  Link,
  Pencil,
  ChartLine,
  CircleUserRound,
  Instagram,
  Linkedin,
  Twitter,
  Github,
  Facebook,
  Slack,
  Youtube,
  Mail,
  Twitch,
  Plus,
} from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      // Add icons here
      Cannabis,
      Link,
      Pencil,
      ChartLine,
      CircleUserRound,
      Instagram,
      Linkedin,
      Twitter,
      Github,
      Facebook,
      Slack,
      Youtube,
      Mail,
      Twitch,
      Plus,
    }),
  ],

  exports: [LucideAngularModule],
})
export class IconsModule {}
