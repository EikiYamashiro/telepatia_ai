import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Transcrição -->
    <div class="result-card" *ngIf="transcription">
      <div class="card-header">
        <h3 class="card-title">
          <span class="title-icon">📝</span>
          Transcrição
        </h3>
        <button 
          class="btn-copy" 
          (click)="copyToClipboard(transcription, 'transcription')"
          [class.copied]="copiedStates.transcription"
        >
          <svg *ngIf="!copiedStates.transcription" class="copy-icon" viewBox="0 0 24 24" fill="none">
            <path d="M8 2V4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V16H20V18C20 20.2091 18.2091 22 16 22H6C3.79086 22 2 20.2091 2 18V6C2 3.79086 3.79086 2 6 2H8Z" fill="currentColor"/>
            <path d="M10 2H14V4H10V2Z" fill="currentColor"/>
            <path d="M16 2H18C19.1046 2 20 2.89543 20 4V6H18V4H16V2Z" fill="currentColor"/>
          </svg>
          <svg *ngIf="copiedStates.transcription" class="copy-icon" viewBox="0 0 24 24" fill="none">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
          </svg>
          {{ copiedStates.transcription ? 'Copiado!' : 'Copiar' }}
        </button>
      </div>
      <div class="result-content">{{ transcription }}</div>
    </div>

    <!-- Extração Estruturada -->
    <div class="result-card" *ngIf="medicalJson">
      <div class="card-header">
        <h3 class="card-title">
          <span class="title-icon">📊</span>
          Dados Estruturados
        </h3>
        <button 
          class="btn-copy" 
          (click)="copyToClipboard(medicalJson, 'medicalJson')"
          [class.copied]="copiedStates.medicalJson"
        >
          <svg *ngIf="!copiedStates.medicalJson" class="copy-icon" viewBox="0 0 24 24" fill="none">
            <path d="M8 2V4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V16H20V18C20 20.2091 18.2091 22 16 22H6C3.79086 22 2 20.2091 2 18V6C2 3.79086 3.79086 2 6 2H8Z" fill="currentColor"/>
            <path d="M10 2H14V4H10V2Z" fill="currentColor"/>
            <path d="M16 2H18C19.1046 2 20 2.89543 20 4V6H18V4H16V2Z" fill="currentColor"/>
          </svg>
          <svg *ngIf="copiedStates.medicalJson" class="copy-icon" viewBox="0 0 24 24" fill="none">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
          </svg>
          {{ copiedStates.medicalJson ? 'Copiado!' : 'Copiar' }}
        </button>
      </div>
      <div class="result-content json-content">{{ medicalJson }}</div>
      
      <div class="card-actions">
        <button 
          (click)="onGenerateDiagnosis()" 
          [disabled]="!medicalObj || loading"
          [class.loading]="loading"
          class="btn btn-success"
        >
          <span *ngIf="!loading">🧠 Gerar Diagnóstico</span>
          <span *ngIf="loading">Gerando...</span>
        </button>
      </div>
    </div>

    <!-- Diagnóstico -->
    <div class="result-card diagnosis-card" *ngIf="diagnosis">
      <div class="card-header">
        <h3 class="card-title">
          <span class="title-icon">🏥</span>
          Diagnóstico Clínico
        </h3>
        <button 
          class="btn-copy" 
          (click)="copyToClipboard(diagnosis, 'diagnosis')"
          [class.copied]="copiedStates.diagnosis"
        >
          <svg *ngIf="!copiedStates.diagnosis" class="copy-icon" viewBox="0 0 24 24" fill="none">
            <path d="M8 2V4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V16H20V18C20 20.2091 18.2091 22 16 22H6C3.79086 22 2 20.2091 2 18V6C2 3.79086 3.79086 2 6 2H8Z" fill="currentColor"/>
            <path d="M10 2H14V4H10V2Z" fill="currentColor"/>
            <path d="M16 2H18C19.1046 2 20 2.89543 20 4V6H18V4H16V2Z" fill="currentColor"/>
          </svg>
          <svg *ngIf="copiedStates.diagnosis" class="copy-icon" viewBox="0 0 24 24" fill="none">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
          </svg>
          {{ copiedStates.diagnosis ? 'Copiado!' : 'Copiar' }}
        </button>
      </div>
      <div class="result-content diagnosis-content">{{ diagnosis }}</div>
    </div>
  `,
  styleUrls: ['./results.component.css']
})
export class ResultsComponent {
  @Input() transcription = '';
  @Input() medicalJson = '';
  @Input() medicalObj: any = null;
  @Input() diagnosis = '';
  @Input() loading = false;
  
  @Output() generateDiagnosis = new EventEmitter<void>();

  copiedStates = {
    transcription: false,
    medicalJson: false,
    diagnosis: false
  };

  async copyToClipboard(text: string, type: keyof typeof this.copiedStates) {
    try {
      await navigator.clipboard.writeText(text);
      this.copiedStates[type] = true;
      
      setTimeout(() => {
        this.copiedStates[type] = false;
      }, 2000);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  }

  onGenerateDiagnosis() {
    this.generateDiagnosis.emit();
  }
}
