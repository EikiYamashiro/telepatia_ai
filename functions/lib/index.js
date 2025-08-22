"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transcribeAudioFile = exports.uploadAudioFile = exports.generateDiagnosis = exports.extractMedicalInfo = exports.transcribeAudio = exports.helloWorld = void 0;
// API v2
const https_1 = require("firebase-functions/v2/https");
const options_1 = require("firebase-functions/v2/options");
const gemini_service_1 = require("./services/gemini.service");
const transcription_service_1 = require("./services/transcription.service");
const upload_service_1 = require("./services/upload.service");
// Define região padrão (São Paulo) e, se quiser, limites globais
(0, options_1.setGlobalOptions)({
    region: "southamerica-east1",
    // memory: "256MiB", // Limite de memória
    // timeoutSeconds: 60, // Timeout padrão
});
// Função de teste
exports.helloWorld = (0, https_1.onRequest)((req, res) => {
    res.json({ message: 'Hello from Firebase Functions!' });
});
// Função de transcrição usando o serviço real
exports.transcribeAudio = (0, https_1.onRequest)(async (req, res) => {
    try {
        const { audioUrl } = req.body;
        if (!audioUrl) {
            res.status(400).json({ error: 'URL do áudio é obrigatória' });
            return;
        }
        console.log(`🎵 Recebida solicitação de transcrição para: ${audioUrl}`);
        // Usar o serviço de transcrição
        const transcriptionService = new transcription_service_1.TranscriptionService();
        const result = await transcriptionService.transcribeAudio(audioUrl);
        console.log(`✅ Transcrição concluída com sucesso. Confiança: ${result.confidence}`);
        res.json({
            transcription: result.transcription,
            confidence: result.confidence,
            language: result.language,
            duration: result.duration,
            audioUrl: audioUrl
        });
    }
    catch (error) {
        console.error('❌ Erro na transcrição:', error);
        // Tratar erros específicos
        if (error.message.includes('URL deve usar HTTP ou HTTPS')) {
            res.status(400).json({ error: 'URL deve usar HTTP ou HTTPS' });
        }
        else if (error.message.includes('Formato não suportado')) {
            res.status(400).json({ error: error.message });
        }
        else if (error.message.includes('URL inválida')) {
            res.status(400).json({ error: 'URL inválida' });
        }
        else {
            res.status(500).json({ error: 'Erro interno do servidor na transcrição' });
        }
    }
});
// Função de extração de informações médicas usando Gemini
exports.extractMedicalInfo = (0, https_1.onRequest)(async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || typeof text !== 'string') {
            res.status(400).json({ error: 'Texto é obrigatório' });
            return;
        }
        // Validar tamanho do texto
        if (text.length > 5000) {
            res.status(400).json({ error: 'Texto muito longo. Máximo 5000 caracteres.' });
            return;
        }
        // Usar o serviço Gemini para extrair informações
        const geminiService = new gemini_service_1.GeminiService();
        const extractedInfo = await geminiService.extractMedicalInfo(text);
        res.json(extractedInfo);
    }
    catch (error) {
        console.error('Erro na extração de informações médicas:', error);
        // Tratar erros específicos
        if (error.message.includes('GEMINI_API_KEY')) {
            res.status(500).json({
                error: 'Serviço de IA não configurado. Entre em contato com o administrador.'
            });
        }
        else if (error.message.includes('JSON válido')) {
            res.status(500).json({
                error: 'Erro no processamento da resposta da IA. Tente novamente.'
            });
        }
        else {
            res.status(500).json({
                error: 'Erro interno do servidor na extração de informações médicas'
            });
        }
    }
});
// Função de geração de diagnóstico usando Gemini
exports.generateDiagnosis = (0, https_1.onRequest)(async (req, res) => {
    var _a;
    try {
        const medicalData = req.body;
        if (!medicalData) {
            res.status(400).json({ error: 'Dados médicos são obrigatórios' });
            return;
        }
        console.log(`🧠 Recebida solicitação de diagnóstico para paciente: ${((_a = medicalData.patient) === null || _a === void 0 ? void 0 : _a.name) || 'N/A'}`);
        // Usar o Gemini para gerar diagnóstico
        const geminiService = new gemini_service_1.GeminiService();
        const diagnosis = await geminiService.generateDiagnosis(medicalData);
        console.log(`✅ Diagnóstico gerado com sucesso`);
        res.json({
            result: diagnosis,
            timestamp: new Date().toISOString()
        });
    }
    catch (error) {
        console.error('❌ Erro na geração de diagnóstico:', error);
        // Tratar erros específicos
        if (error.message.includes('GEMINI_API_KEY')) {
            res.status(500).json({
                error: 'Serviço de IA não configurado. Entre em contato com o administrador.'
            });
        }
        else {
            res.status(500).json({ error: 'Erro interno do servidor na geração de diagnóstico' });
        }
    }
});
// Função de upload de arquivo de áudio
exports.uploadAudioFile = (0, https_1.onRequest)(async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            res.status(400).json({ error: 'Nenhum arquivo de áudio enviado' });
            return;
        }
        const audioFile = req.files.file;
        console.log(`📤 Recebido arquivo: ${audioFile.originalname} (${audioFile.size} bytes)`);
        // Fazer upload para Firebase Storage
        const uploadService = new upload_service_1.UploadService();
        const uploadResult = await uploadService.uploadAudioFile(audioFile.buffer, audioFile.originalname, audioFile.mimetype);
        console.log(`✅ Upload concluído: ${uploadResult.url}`);
        res.json({
            success: true,
            file: uploadResult,
            message: 'Arquivo enviado com sucesso'
        });
    }
    catch (error) {
        console.error('❌ Erro no upload:', error);
        res.status(500).json({ error: 'Erro interno do servidor no upload' });
    }
});
// Função de transcrição de arquivo de áudio direto
exports.transcribeAudioFile = (0, https_1.onRequest)(async (req, res) => {
    try {
        // Debug: ver o que está chegando
        console.log('🔍 Debug - req.method:', req.method);
        console.log('🔍 Debug - req.headers:', req.headers);
        console.log('🔍 Debug - req.body:', req.body);
        // Verificar se temos os dados do arquivo
        if (!req.body || !req.body.data) {
            console.log('❌ Dados não encontrados no body');
            res.status(400).json({ error: 'Dados não encontrados' });
            return;
        }
        const { filename, contentType, size, data } = req.body;
        // Detectar se é URL ou arquivo base64
        if (data.startsWith('http')) {
            console.log('🌐 Processando URL de áudio:', data);
            await processAudioUrl(data, res);
        }
        else {
            console.log(`🎵 Recebido arquivo: ${filename} (${size} bytes)`);
            await processAudioFile(data, filename, contentType, size, res);
        }
    }
    catch (error) {
        console.error('❌ Erro na transcrição:', error);
        res.status(500).json({ error: 'Erro interno do servidor na transcrição' });
    }
});
// Função para processar URL de áudio
async function processAudioUrl(audioUrl, res) {
    try {
        console.log('🎯 Baixando áudio da URL:', audioUrl);
        // Fazer download do arquivo
        const https = require('https');
        const http = require('http');
        const protocol = audioUrl.startsWith('https') ? https : http;
        const audioBuffer = await new Promise((resolve, reject) => {
            protocol.get(audioUrl, (response) => {
                if (response.statusCode !== 200) {
                    reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
                    return;
                }
                const chunks = [];
                response.on('data', (chunk) => chunks.push(chunk));
                response.on('end', () => resolve(Buffer.concat(chunks)));
                response.on('error', reject);
            }).on('error', reject);
        });
        console.log(`✅ Download concluído: ${audioBuffer.length} bytes`);
        // Processar o arquivo baixado
        await processAudioFile(audioBuffer.toString('base64'), 'audio_from_url', 'audio/mp4', audioBuffer.length, res);
    }
    catch (error) {
        console.error('❌ Erro no download da URL:', error);
        res.status(500).json({ error: `Erro ao baixar áudio da URL: ${error.message}` });
    }
}
// Função para processar arquivo de áudio
async function processAudioFile(data, filename, contentType, size, res) {
    try {
        // Converter base64 para buffer
        const audioBuffer = Buffer.from(data, 'base64');
        // SOLUÇÃO ALTERNATIVA: Usar Google Speech-to-Text diretamente com dados base64
        try {
            console.log('🎯 Tentando transcrição direta com Google Speech-to-Text...');
            const transcriptionService = new transcription_service_1.TranscriptionService();
            console.log('✅ TranscriptionService criado com sucesso');
            // Criar um arquivo temporário local para o Google Speech-to-Text
            const os = require('os');
            const tempDir = os.tmpdir(); // Pega o diretório temporário correto do sistema
            const tempFilePath = require('path').join(tempDir, `audio_${Date.now()}_${filename}`);
            console.log('📁 Criando arquivo temporário:', tempFilePath);
            console.log('📁 Diretório temporário do sistema:', tempDir);
            try {
                require('fs').writeFileSync(tempFilePath, audioBuffer);
                console.log('✅ Arquivo temporário criado com sucesso');
                // Verificar se o arquivo foi criado
                const fs = require('fs');
                if (fs.existsSync(tempFilePath)) {
                    console.log('✅ Arquivo temporário existe e pode ser lido');
                    const stats = fs.statSync(tempFilePath);
                    console.log('📊 Tamanho do arquivo temporário:', stats.size, 'bytes');
                }
                else {
                    console.log('❌ Arquivo temporário não foi criado');
                }
            }
            catch (fileError) {
                console.error('❌ Erro ao criar arquivo temporário:', fileError);
                throw fileError;
            }
            // Usar o serviço de transcrição com arquivo local
            console.log('🎵 Chamando transcribeLocalFile...');
            const transcriptionResult = await transcriptionService.transcribeLocalFile(tempFilePath);
            console.log('✅ transcribeLocalFile retornou:', transcriptionResult);
            // Limpar arquivo temporário
            try {
                require('fs').unlinkSync(tempFilePath);
                console.log('✅ Arquivo temporário removido');
            }
            catch (cleanupError) {
                console.error('⚠️ Erro ao remover arquivo temporário:', cleanupError);
            }
            console.log(`✅ Transcrição direta concluída com sucesso`);
            res.json({
                success: true,
                transcription: transcriptionResult.transcription,
                confidence: transcriptionResult.confidence,
                language: transcriptionResult.language,
                message: 'Transcrição concluída com sucesso'
            });
        }
        catch (transcriptionError) {
            console.log('⚠️ Transcrição direta falhou, usando fallback...');
            console.error('❌ Erro detalhado:', transcriptionError);
            console.error('❌ Stack trace:', transcriptionError.stack);
            // FALLBACK: Transcrição mock para desenvolvimento
            const mockTranscription = `[TRANSCRIÇÃO MOCK] Arquivo de áudio "${filename}" recebido com sucesso. 
      Tamanho: ${size} bytes. 
      Tipo: ${contentType}.
      
      Para transcrição real, configure o Firebase Storage ou use um arquivo de áudio compatível com Google Speech-to-Text.`;
            res.json({
                success: true,
                transcription: mockTranscription,
                confidence: 0.95,
                language: 'pt-BR',
                message: 'Transcrição mock (configure Storage para transcrição real)'
            });
        }
    }
    catch (error) {
        console.error('❌ Erro no processamento do arquivo:', error);
        res.status(500).json({ error: `Erro ao processar arquivo: ${error.message}` });
    }
}
//# sourceMappingURL=index.js.map