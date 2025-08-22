import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-diagnosis-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="diagnosis-card">
      <div class="card-header">
        <h4>🔬 Diagnosis and Treatment</h4>
        <button 
          class="btn btn-secondary copy-btn"
          (click)="copyToClipboard()"
          title="Copy diagnosis"
        >
          📋 Copy
        </button>
      </div>
      
      <div class="diagnosis-content">
        <div class="markdown-content" [innerHTML]="renderMarkdown(diagnosis)"></div>
      </div>
    </div>
  `,
  styleUrls: ['./diagnosis-card.component.css']
})
export class DiagnosisCardComponent {
  @Input() diagnosis!: string;

  copyToClipboard() {
    navigator.clipboard.writeText(this.diagnosis).then(() => {
      // Could emit event or use toast service here
      console.log('Diagnosis copied to clipboard');
    }).catch(err => {
      console.error('Error copying:', err);
    });
  }

  renderMarkdown(text: string): string {
    // Simple markdown rendering for basic formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/^### (.*$)/gim, '<h3>$1</h3>') // H3
      .replace(/^## (.*$)/gim, '<h4>$1</h4>') // H4
      .replace(/^# (.*$)/gim, '<h5>$1</h5>') // H5
      .replace(/^- (.*$)/gim, '<li>$1</li>') // List items
      .replace(/\n\n/g, '<br><br>') // Double line breaks
      .replace(/\n/g, '<br>'); // Single line breaks
  }
}
