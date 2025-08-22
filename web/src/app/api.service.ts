import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = '/api'; // via proxy.conf.json

  transcribeAudio(audioUrl: string) {
    return this.http.post<{ transcription: string }>(
      `${this.base}/transcribeAudio`,
      { audioUrl }
    );
  }

  extractMedicalInfo(text: string) {
    return this.http.post<any>(`${this.base}/extractMedicalInfo`, { text });
  }

  generateDiagnosis(payload: any) {
    return this.http.post<{ result: string }>(
      `${this.base}/generateDiagnosis`,
      payload
    );
  }

  // Transcribe audio from file upload
  transcribeAudioFile(fileData: { filename: string; contentType: string; size: number; data: string; type: 'file' | 'gdrive' }) {
    return this.http.post<any>('/api/transcribeAudioFile', fileData);
  }
}
