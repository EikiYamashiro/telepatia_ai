export interface EnvironmentConfig {
  GEMINI_API_KEY: string;
  NODE_ENV: string;
}

export function getEnvironmentConfig(): EnvironmentConfig {
  const config: EnvironmentConfig = {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    NODE_ENV: process.env.NODE_ENV || 'development'
  };

  // Validações
  if (!config.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY não configurada. A extração de informações médicas não funcionará.');
  }

  return config;
}

export function validateEnvironment(): void {
  const config = getEnvironmentConfig();
  
  if (!config.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY é obrigatória para o funcionamento da aplicação');
  }
}
