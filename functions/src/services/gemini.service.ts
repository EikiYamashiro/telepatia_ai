import { GoogleGenerativeAI } from '@google/generative-ai';

export interface MedicalExtractionResult {
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

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    // Usar apenas variáveis de ambiente
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
              throw new Error('GEMINI_API_KEY not configured. Set the environment variable or use $env:GEMINI_API_KEY="your-key" in PowerShell');
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    // Usar o modelo GRATUITO do Gemini compatível com v1beta
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async extractMedicalInfo(text: string): Promise<MedicalExtractionResult> {
    try {
      const prompt = `
        Analyze the following medical text and extract structured information.
        
        TEXT: ${text}
        
        Extract and return ONLY a valid JSON with the following structure:
        {
          "symptoms": ["symptom1", "symptom2", "symptom3"],
          "patient": {
            "name": "patient name if mentioned",
            "age": numeric age if mentioned,
            "identificationNumber": "identification number if mentioned",
            "gender": "gender if mentioned"
          },
          "consultationReason": "consultation reason in a clear sentence",
          "additionalNotes": "relevant additional observations if any"
        }
        
        IMPORTANT:
        - Return ONLY the JSON, without additional text
        - If any information is not present, use null or empty string
        - Maintain the exact specified format
        - Use double quotes for strings
        - For symptoms, always return an array, even if empty
        LANGUAGE: ENGLISH ONLY - NO PORTUGUESE
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const textResponse = response.text();
      
      // Limpar o texto para extrair apenas o JSON
      const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Response does not contain valid JSON');
      }

      const jsonString = jsonMatch[0];
      const extractedData = JSON.parse(jsonString);

      // Validar e normalizar os dados
      return this.validateAndNormalize(extractedData);
    } catch (error) {
      console.error('Error extracting medical information:', error);
      throw new Error('Failed to extract medical information');
    }
  }

  /**
   * Generates medical diagnosis based on extracted data
   */
  async generateDiagnosis(medicalData: any): Promise<string> {
    try {
      const prompt = `
        As a medical specialist, analyze the following medical data and generate a complete diagnosis:

        PATIENT DATA:
        ${JSON.stringify(medicalData, null, 2)}

        CRITICAL INSTRUCTION: You MUST respond in ENGLISH ONLY. Do not use Portuguese, Spanish, or any other language.

        Please provide a structured response in English with:

        1. PRIMARY DIAGNOSIS: Identify the most likely medical condition
        2. DIFFERENTIAL DIAGNOSES: List other possibilities to consider
        3. RECOMMENDED TREATMENT: Specific therapeutic protocol
        4. RECOMMENDATIONS: Patient guidance
        5. FOLLOW-UP: When to return for reassessment

        Use appropriate but accessible medical language. Be specific and practical.
        Respond only with medical content, without introductions or conclusions.
        LANGUAGE: ENGLISH ONLY - NO PORTUGUESE
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (!text || text.trim().length === 0) {
        throw new Error('Empty AI response');
      }

      return text.trim();
    } catch (error: any) {
      console.error('❌ Error generating diagnosis:', error);
      
      if (error.message.includes('API key')) {
        throw new Error('GEMINI_API_KEY not configured');
      }
      
      throw new Error(`Failed to generate diagnosis: ${error.message}`);
    }
  }

  private validateAndNormalize(data: any): MedicalExtractionResult {
    // Garantir que symptoms seja sempre um array
    const symptoms = Array.isArray(data.symptoms) ? data.symptoms : [];
    
    // Garantir que patient tenha a estrutura correta
    const patient = {
      name: data.patient?.name || null,
      age: typeof data.patient?.age === 'number' ? data.patient.age : null,
      identificationNumber: data.patient?.identificationNumber || null,
      gender: data.patient?.gender || null
    };

    // Garantir que consultationReason seja uma string
    const consultationReason = typeof data.consultationReason === 'string' 
      ? data.consultationReason.trim() 
      : 'Consultation reason not specified';

    const additionalNotes = typeof data.additionalNotes === 'string' 
      ? data.additionalNotes.trim() 
      : null;

    return {
      symptoms,
      patient,
      consultationReason,
      additionalNotes
    };
  }
}
