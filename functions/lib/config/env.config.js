"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvironmentConfig = getEnvironmentConfig;
exports.validateEnvironment = validateEnvironment;
function getEnvironmentConfig() {
    const config = {
        GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
        NODE_ENV: process.env.NODE_ENV || 'development'
    };
    // Validações
    if (!config.GEMINI_API_KEY) {
        console.warn('⚠️  GEMINI_API_KEY não configurada. A extração de informações médicas não funcionará.');
    }
    return config;
}
function validateEnvironment() {
    const config = getEnvironmentConfig();
    if (!config.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY é obrigatória para o funcionamento da aplicação');
    }
}
//# sourceMappingURL=env.config.js.map