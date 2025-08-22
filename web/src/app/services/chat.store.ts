import { Injectable, signal, computed } from '@angular/core';

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: any;
}

export interface ExtractedData {
  symptoms: string[];
  patient: {
    name?: string;
    age?: number;
    identificationNumber?: string;
    gender?: string;
  };
  consultationReason: string;
  additionalNotes?: string;
}

export interface ChatState {
  messages: ChatMessage[];
  extractedData: ExtractedData | null;
  diagnosis: string | null;
  loading: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ChatStore {
  // State
  private _messages = signal<ChatMessage[]>([]);
  private _extractedData = signal<ExtractedData | null>(null);
  private _diagnosis = signal<string | null>(null);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  // Computed values
  messages = this._messages.asReadonly();
  extractedData = this._extractedData.asReadonly();
  diagnosis = this._diagnosis.asReadonly();
  loading = this._loading.asReadonly();
  error = this._error.asReadonly();

  // Computed
  hasExtractedData = computed(() => this._extractedData() !== null);
  canGenerateDiagnosis = computed(() => this._extractedData() !== null && !this._loading());

  constructor() {
    this.initializeWelcomeMessage();
  }

  private initializeWelcomeMessage() {
    const welcomeMessage: ChatMessage = {
      id: this.generateId(),
      type: 'assistant',
      content: 'Olá! Sou seu assistente médico. Cole um texto médico ou envie um link de áudio para que eu possa extrair informações e gerar diagnósticos.',
      timestamp: new Date(),
      metadata: { isWelcome: true }
    };
    this._messages.set([welcomeMessage]);
  }

  // Actions
  addUserMessage(content: string) {
    const message: ChatMessage = {
      id: this.generateId(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    this._messages.update(messages => [...messages, message]);
  }

  addAssistantMessage(content: string, metadata?: any) {
    const message: ChatMessage = {
      id: this.generateId(),
      type: 'assistant',
      content,
      timestamp: new Date(),
      metadata
    };
    this._messages.update(messages => [...messages, message]);
  }

  setExtractedData(data: ExtractedData) {
    this._extractedData.set(data);
    
    // Add assistant message with extracted data
    this.addAssistantMessage('Dados extraídos com sucesso!', {
      type: 'extractedData',
      data
    });
  }

  updateExtractedData(data: ExtractedData) {
    this._extractedData.set(data);
    
    // Update the last extracted data message
    this._messages.update(messages => {
      // Find last index manually since findLastIndex might not be available
      let lastMessageIndex = -1;
      for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].metadata?.type === 'extractedData') {
          lastMessageIndex = i;
          break;
        }
      }
      
      if (lastMessageIndex !== -1) {
        const updatedMessages = [...messages];
        updatedMessages[lastMessageIndex] = {
          ...updatedMessages[lastMessageIndex],
          metadata: { ...updatedMessages[lastMessageIndex].metadata, data }
        };
        return updatedMessages;
      }
      return messages;
    });
  }

  setDiagnosis(diagnosis: string) {
    this._diagnosis.set(diagnosis);
    
    // Add assistant message with diagnosis
    this.addAssistantMessage('Diagnóstico gerado com sucesso!', {
      type: 'diagnosis',
      content: diagnosis
    });
  }

  setLoading(loading: boolean) {
    this._loading.set(loading);
  }

  setError(error: string | null) {
    this._error.set(error);
  }

  clearError() {
    this._error.set(null);
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Reset conversation (keep welcome message)
  resetConversation() {
    this._extractedData.set(null);
    this._diagnosis.set(null);
    this._error.set(null);
    this.initializeWelcomeMessage();
  }
}
