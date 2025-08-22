"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const storage_1 = require("@google-cloud/storage");
const uuid_1 = require("uuid");
class UploadService {
    constructor() {
        this.isLocal = process.env.FUNCTIONS_EMULATOR === 'true';
        if (this.isLocal) {
            // Em desenvolvimento local, usar emulador
            this.storage = new storage_1.Storage({
                projectId: process.env.FIREBASE_PROJECT_ID || 'telepatia-a2b3d',
                apiEndpoint: process.env.FIREBASE_STORAGE_EMULATOR_HOST || 'http://localhost:9199'
            });
            this.bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'telepatia-a2b3d.appspot.com';
            console.log('📁 Upload Service inicializado para EMULADOR LOCAL');
        }
        else {
            // Em produção, usar Google Cloud Storage
            this.storage = new storage_1.Storage();
            this.bucketName = process.env.FIREBASE_STORAGE_BUCKET || 'telepatia-a2b3d.appspot.com';
            console.log(`📁 Upload Service inicializado para bucket: ${this.bucketName}`);
        }
    }
    /**
     * Faz upload de um arquivo de áudio para Firebase Storage
     */
    async uploadAudioFile(audioBuffer, originalName, contentType) {
        try {
            // Gerar nome único para o arquivo
            const fileExtension = this.getFileExtension(originalName);
            const filename = `audio/${(0, uuid_1.v4)()}.${fileExtension}`;
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
        }
        catch (error) {
            console.error('❌ Erro no upload:', error);
            throw new Error(`Falha no upload: ${error.message}`);
        }
    }
    /**
     * Extrai a extensão do arquivo
     */
    getFileExtension(filename) {
        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex === -1)
            return 'mp3'; // Padrão
        return filename.substring(lastDotIndex + 1).toLowerCase();
    }
    /**
     * Remove um arquivo do storage
     */
    async deleteFile(filename) {
        try {
            const bucket = this.storage.bucket(this.bucketName);
            const file = bucket.file(filename);
            await file.delete();
            console.log(`🗑️  Arquivo removido: ${filename}`);
        }
        catch (error) {
            console.error('❌ Erro ao remover arquivo:', error);
        }
    }
}
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map