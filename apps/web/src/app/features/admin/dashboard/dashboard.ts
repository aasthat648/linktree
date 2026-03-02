import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconsModule } from '@/app/shared/components/icons';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, IconsModule],
  templateUrl: './dashboard.html',
})
export class AdminDashboard {}
