import { Storage } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  contentType: string;
}

export class UploadService {
  private storage: Storage;
  private bucketName: string;
  private isLocal: boolean;

  constructor() {
    this.isLocal = process.env.FUNCTIONS_EMULATOR === 'true';
    
    if (this.isLocal) {
      // Em desenvolvimento local, usar emulador
      this.storage = new Storage({
        projectId: process.env.FIREBASE_PROJECT_ID || 'telepatia-a2b3d',
        apiEndpoint: process.env.FIREBASE_STORAGE_EMULATOR_HOST || 'http://localhost:9199'
      });
      this.bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'telepatia-a2b3d.appspot.com';
      console.log('📁 Upload Service inicializado para EMULADOR LOCAL');
    } else {
      // Em produção, usar Google Cloud Storage
      this.storage = new Storage();
      this.bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'telepatia-a2b3d.appspot.com';
      console.log(`📁 Upload Service inicializado para bucket: ${this.bucketName}`);
    }
  }

  /**
   * Faz upload de um arquivo de áudio para Firebase Storage
   */
  async uploadAudioFile(audioBuffer: Buffer, originalName: string, contentType: string): Promise<UploadResult> {
    try {
      // Gerar nome único para o arquivo
      const fileExtension = this.getFileExtension(originalName);
      const filename = `audio/${uuidv4()}.${fileExtension}`;
      
      console.log(`📤 Iniciando upload: ${filename}`);

      // Criar referência do arquivo
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(filename);

      // Configurar metadados
      const metadata = {
        contentType: contentType,
        metadata: {
          originalName: originalName,
          uploadedAt: new Date().toISOString(),
          purpose: 'medical-transcription'
        }
      };

      // Fazer upload
      await file.save(audioBuffer, metadata);

      // Tornar o arquivo público
      await file.makePublic();

      // Gerar URL pública
      const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filename}`;

      console.log(`✅ Upload concluído: ${publicUrl}`);

      return {
        url: publicUrl,
        filename: filename,
        size: audioBuffer.length,
        contentType: contentType
      };

    } catch (error: any) {
      console.error('❌ Erro no upload:', error);
      throw new Error(`Falha no upload: ${error.message}`);
    }
  }

  /**
   * Extrai a extensão do arquivo
   */
  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) return 'mp3'; // Padrão
    return filename.substring(lastDotIndex + 1).toLowerCase();
  }

  /**
   * Remove um arquivo do storage
   */
  async deleteFile(filename: string): Promise<void> {
    try {
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(filename);
      await file.delete();
      console.log(`🗑️  Arquivo removido: ${filename}`);
    } catch (error: any) {
      console.error('❌ Erro ao remover arquivo:', error);
    }
  }
}
