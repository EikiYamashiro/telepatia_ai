import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';
import { HeaderComponent } from './components/header.component';
import { ChatMessageComponent } from './components/chat-message.component';
import { ExtractedData } from './services/chat.store';

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
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    ChatMessageComponent
  ],
  template: `
    <div class="app-container" ngSkipHydration>
      <app-header></app-header>
      
      <main class="main-content">
        <div class="chat-container">
          <!-- Messages Area -->
          <div class="messages-area" #messagesArea>
                         <!-- Welcome Message -->
             <div class="message assistant-message" *ngIf="messages().length === 0">
               <div class="message-avatar">🤖</div>
               <div class="message-content">
                 <h3>Hello! I'm your medical assistant</h3>
                 <p>Paste a medical text or send an audio link to start the analysis.</p>
               </div>
             </div>

            <!-- Chat Messages -->
            <app-chat-message
              *ngFor="let message of messages()"
              [message]="message"
              [showGenerateDiagnosisButton]="showGenerateDiagnosisButton()"
              (onDataUpdated)="onDataUpdated($event)"
              (onGenerateDiagnosis)="onDiagnose()"
            ></app-chat-message>

                         <!-- Loading Indicator -->
             <div class="message assistant-message" *ngIf="loading()">
               <div class="message-avatar">🤖</div>
               <div class="message-content">
                 <div class="loading-indicator">
                   <div class="spinner"></div>
                   <p>Processing your request...</p>
                 </div>
               </div>
             </div>
          </div>

          <!-- Input Area -->
          <div class="input-area">
            <!-- Audio Input Section -->
            <div class="audio-input-section" *ngIf="showAudioInput()">
                                         <!-- Audio URL -->
       <div class="input-group">
                 <input
                   type="text"
                   class="audio-input"
                   placeholder="Or paste the audio file URL..."
                   [(ngModel)]="audioUrlValue"
                   [disabled]="loading()"
                 />
                 <button
                   class="btn audio-btn"
                   (click)="onTranscribe()"
                   [disabled]="loading() || !audioUrlValue.trim()"
                 >
                   🌐 Transcribe
                 </button>
               </div>
            </div>

            <!-- Text Input Section -->
            <div class="text-input-section">
              <div class="input-group">
                                 <textarea
                   class="text-input"
                   placeholder="Paste your medical text here..."
                   [(ngModel)]="freeTextValue"
                   (keydown.enter)="onEnterKey($event)"
                   [disabled]="loading()"
                   rows="1"
                 ></textarea>
                <div class="input-actions">
                                     <button
                     class="btn send-btn"
                     (click)="onExtract()"
                     [disabled]="loading() || !freeTextValue.trim()"
                   >
                     📋 Extract
                   </button>
                   <button
                     class="btn audio-btn"
                     (click)="toggleAudioInput()"
                     [disabled]="loading() || !canUseAudio()"
                   >
                     🎵 Audio
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private api = inject(ApiService);
  
  // Chat state
  messages = signal<ChatMessage[]>([]);
  loading = signal(false);
  
  // Input values
  freeTextValue = '';
  audioUrlValue = '';
  showAudioInput = signal(false);

  
  // Current conversation data
  currentExtractedData: ExtractedData | null = null;
  showGenerateDiagnosisButton = signal(true); // Controla visibilidade do botão
  canUseAudio = signal(true); // Controla quando o áudio pode ser usado

  ngOnInit() {
    this.scrollToBottom();
  }

  // Add message to chat
  private addMessage(type: 'user' | 'assistant', content: string, metadata?: any) {
    const message: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      metadata
    };
    
    console.log('📝 Adicionando mensagem:', { type, content, metadata });
    
    this.messages.update(messages => [...messages, message]);
    this.scrollToBottom();
  }

  // Extract medical information
  async onExtract() {
    const text = this.freeTextValue.trim();
         if (!text) {
       alert('Please provide a medical text to extract information.');
       return;
     }
     if (text.length < 10) {
       alert('The text must have at least 10 characters for effective extraction.');
       return;
     }

    // Add user message
    this.addMessage('user', text, { type: 'text' });
    
    // Clear input and start loading
    this.freeTextValue = '';
    this.loading.set(true);
    
    // Reset states for new conversation
    this.showGenerateDiagnosisButton.set(true);
    this.canUseAudio.set(false); // Desabilita áudio durante processamento

    try {
      const result = await firstValueFrom(this.api.extractMedicalInfo(text));
      
             // Add assistant message with extracted data
       this.addMessage('assistant', 'Data extracted successfully!', {
         type: 'extractedData',
         data: result
       });
      
      this.currentExtractedData = result;
      
    } catch (e: any) {
      console.error('❌ Erro na API:', e);
             this.addMessage('assistant', `Error extracting data: ${e.error?.error || e.message || 'Unknown error'}`, {
         type: 'text'
       });
    } finally {
      this.loading.set(false);
    }
  }

  // Transcribe audio
  async onTranscribe() {
         const url = this.audioUrlValue.trim();
     if (!url) {
       alert('Provide a valid audio URL');
       return;
     }

     // Add user message (only the URL)
     this.addMessage('user', `🎵 Audio sent: ${url}`, { type: 'text' as const });
    
    this.loading.set(true);
    
    try {
      const result = await firstValueFrom(this.api.transcribeAudio(url));
      
      // NÃO adicionar nova mensagem do usuário aqui - apenas usar a transcrição
      // this.addMessage('user', result.transcription, { type: 'text' as const });
      
      // Clear audio input and close modal
      this.audioUrlValue = '';
      this.showAudioInput.set(false);
      
      // Automatically extract data from transcription (sem adicionar nova mensagem)
      this.freeTextValue = result.transcription;
      await this.onExtract();
      
    } catch (e: any) {
      console.error('❌ API Error:', e);
      this.addMessage('assistant', `Error transcribing audio: ${e.error?.error || e.message || 'Unknown error'}`, {
        type: 'text' as const
      });
    } finally {
      this.loading.set(false);
    }
  }

  // Generate diagnosis
  async onDiagnose() {
    if (!this.currentExtractedData) {
      alert('No extracted data available to generate diagnosis.');
      return;
    }

    this.loading.set(true);
    
    // Hide the generate diagnosis button
    this.showGenerateDiagnosisButton.set(false);
    
    try {
      const result = await firstValueFrom(this.api.generateDiagnosis(this.currentExtractedData));
      
      // Add assistant message with diagnosis
      this.addMessage('assistant', 'Diagnosis generated successfully!', {
        type: 'diagnosis',
        data: result.result
      });
      
      // Re-enable audio for new conversation
      this.canUseAudio.set(true);
      
    } catch (e: any) {
      console.error('❌ Erro na API:', e);
      this.addMessage('assistant', `Error generating diagnosis: ${e.error?.error || e.message || 'Unknown error'}`, {
        type: 'text'
      });
      
      // Re-enable the button if there was an error
      this.showGenerateDiagnosisButton.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  // Handle data updates from extracted data card
  onDataUpdated(event: any) {
    const updatedData = event as ExtractedData;
    console.log('✅ Data updated:', updatedData);
    this.currentExtractedData = updatedData;
    
    // Update the last extracted data message
    this.messages.update(messages => {
      const lastIndex = messages.length - 1;
      for (let i = lastIndex; i >= 0; i--) {
        if (messages[i].metadata?.type === 'extractedData') {
          messages[i] = {
            ...messages[i],
            metadata: { 
              type: 'extractedData' as const, 
              data: updatedData 
            }
          };
          break;
        }
      }
      return messages;
    });
  }

  // Handle Enter key
  onEnterKey(event: any) {
    if (!this.freeTextValue.trim() || this.loading()) {
      return;
    }
    if (event && !event.shiftKey) {
      event.preventDefault();
      this.onExtract();
    }
  }

  // Toggle audio input
  toggleAudioInput() {
    this.showAudioInput.update(show => !show);
  }





  // Transcribe audio from Google Drive link
  async onTranscribeGoogleDrive() {
    if (!this.audioUrlValue.trim()) {
      alert('Please enter a Google Drive link.');
      return;
    }

    this.loading.set(true);

    try {
      // Enviar link do Google Drive
      const result = await firstValueFrom(this.api.transcribeAudioFile({
        filename: 'audio_from_drive',
        contentType: 'audio/mp4', // Assumir formato comum
        size: 0, // Tamanho desconhecido
        data: this.audioUrlValue.trim(),
        type: 'gdrive' // Indicar que é link do Google Drive
      }));
      
      // Add transcription as user message
      this.addMessage('user', (result as any).transcription, { type: 'text' as const });
      
      // Clear audio input and close modal
      this.audioUrlValue = '';
      this.showAudioInput.set(false);
      
      // Automatically extract data from transcription
      this.freeTextValue = (result as any).transcription;
      await this.onExtract();
      
    } catch (e: any) {
      console.error('❌ API Error:', e);
      this.addMessage('assistant', `Error transcribing audio: ${e.error?.error || e.message || 'Unknown error'}`, {
        type: 'text' as const
      });
    } finally {
      this.loading.set(false);
    }
  }



  // Scroll to bottom
  private scrollToBottom() {
    // Verificar se estamos no browser antes de acessar document
    if (typeof document !== 'undefined') {
      setTimeout(() => {
        const messagesArea = document.querySelector('.messages-area');
        if (messagesArea) {
          messagesArea.scrollTop = messagesArea.scrollHeight;
        }
      }, 100);
    }
  }
}
