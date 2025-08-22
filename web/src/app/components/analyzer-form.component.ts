import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-analyzer-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="analyzer-card">
      <h2 class="card-title">Análise de Dados Médicos</h2>
      
      <!-- URL do Áudio -->
      <div class="form-group">
        <label class="form-label" for="audioUrl">
          <span class="label-icon">🎵</span>
          URL do Áudio
        </label>
        <div class="input-group">
          <input 
            id="audioUrl"
            [(ngModel)]="audioUrl" 
            placeholder="Cole aqui a URL do arquivo de áudio..."
            class="form-input"
            [class.error]="showAudioError"
            (input)="clearAudioError()"
          >
          <button 
            (click)="onTranscribe()" 
            [disabled]="loading || !audioUrl.trim()"
            class="btn btn-primary"
            [class.loading]="loading"
          >
            <span *ngIf="!loading">Transcrever</span>
            <span *ngIf="loading">Transcrevendo...</span>
          </button>
        </div>
        <div *ngIf="showAudioError" class="error-message">
          Informe uma URL de áudio válida
        </div>
      </div>

      <!-- Separador -->
      <div class="separator">
        <span>ou</span>
      </div>

      <!-- Texto Médico -->
      <div class="form-group">
        <label class="form-label" for="freeText">
          <span class="label-icon">📝</span>
          Texto Médico
        </label>
        <div class="input-group">
          <textarea 
            id="freeText"
            [(ngModel)]="localFreeText" 
            rows="4" 
            placeholder="Digite ou cole o texto médico aqui..."
            class="form-textarea"
            [class.error]="showTextError"
            (input)="clearTextError(); freeTextChange.emit(localFreeText)"
          ></textarea>
          <button 
            (click)="onExtract()" 
            [disabled]="loading || !freeText.trim()"
            class="btn btn-primary"
            [class.loading]="loading"
          >
            <span *ngIf="!loading">Extrair Dados</span>
            <span *ngIf="loading">Extraindo...</span>
          </button>
        </div>
        <div *ngIf="showTextError" class="error-message">
          Forneça um texto para extrair
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./analyzer-form.component.css']
})
export class AnalyzerFormComponent {
  @Input() audioUrl = '';
  @Input() freeText = '';
  @Input() loading = false;
  
  @Output() audioUrlChange = new EventEmitter<string>();
  @Output() freeTextChange = new EventEmitter<string>();
  @Output() transcribe = new EventEmitter<void>();
  @Output() extract = new EventEmitter<void>();

  showAudioError = false;
  showTextError = false;
  
  // Valor local para o textarea
  localFreeText = '';

  // Setter para inicializar localFreeText quando freeText mudar
  set freeTextInput(value: string) {
    this.freeText = value;
    this.localFreeText = value;
  }

  get freeTextInput(): string {
    return this.freeText;
  }

  onTranscribe() {
    console.log('🔍 onTranscribe chamado!');
    console.log('🔍 audioUrl:', this.audioUrl);
    console.log('🔍 loading:', this.loading);
    
    if (!this.audioUrl.trim()) {
      this.showAudioError = true;
      return;
    }
    this.transcribe.emit();
  }

  onExtract() {
    console.log('🔍 onExtract chamado!');
    console.log('🔍 localFreeText:', this.localFreeText);
    console.log('🔍 freeText input:', this.freeText);
    console.log('🔍 loading:', this.loading);
    
    // Usar o valor local em vez do input
    const textToUse = this.localFreeText || this.freeText;
    
    if (!textToUse.trim()) {
      console.log('❌ freeText vazio no componente filho');
      this.showTextError = true;
      return;
    }
    
    console.log('✅ freeText válido, emitindo evento...');
    this.extract.emit();
  }

  clearAudioError() {
    this.showAudioError = false;
  }

  clearTextError() {
    this.showTextError = false;
  }
}
