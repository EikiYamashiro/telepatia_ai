import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="logo-icon">🏥</span>
          <h1>Telepatía</h1>
        </div>
        <p class="subtitle">AI Assistant for Medical Analysis</p>
      </div>
    </header>
  `,
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {}
