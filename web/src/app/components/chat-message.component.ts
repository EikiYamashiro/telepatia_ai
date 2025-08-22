import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExtractedDataCardComponent } from './extracted-data-card.component';
import { DiagnosisCardComponent } from './diagnosis-card.component';
import { ExtractedData } from '../services/chat.store';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    type: 'text' | 'extractedData' | 'diagnosis';
    data?: any;
  };
}

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule, ExtractedDataCardComponent, DiagnosisCardComponent],
  template: `
    <div class="message" [ngClass]="message.type + '-message'">
      <div class="message-avatar">
        {{ message.type === 'user' ? '👤' : '🤖' }}
      </div>
      <div class="message-content">
        <!-- Text Message -->
        <div *ngIf="!message.metadata || message.metadata.type === 'text'" class="text-content">
          <p>{{ message.content }}</p>
        </div>

        <!-- Extracted Data Card -->
        <app-extracted-data-card
          *ngIf="message.metadata?.type === 'extractedData' && message.metadata?.data"
          [data]="message.metadata!.data"
          [showGenerateDiagnosisButton]="showGenerateDiagnosisButton"
          (onDataUpdated)="onDataUpdated.emit($event)"
          (onGenerateDiagnosis)="onGenerateDiagnosis.emit()"
        ></app-extracted-data-card>

        <!-- Diagnosis Card -->
        <app-diagnosis-card
          *ngIf="message.metadata?.type === 'diagnosis' && message.metadata?.data"
          [diagnosis]="message.metadata!.data"
        ></app-diagnosis-card>
      </div>
    </div>
  `,
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent {
  @Input() message!: ChatMessage;
  @Input() showGenerateDiagnosisButton = true; // Novo input para controlar visibilidade
  @Output() onDataUpdated = new EventEmitter<ExtractedData>();
  @Output() onGenerateDiagnosis = new EventEmitter<void>();

  ngOnInit() {
    console.log('💬 ChatMessage renderizado:', {
      type: this.message.type,
      content: this.message.content,
      metadata: this.message.metadata
    });
  }
}
