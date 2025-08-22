# 🏥 Telepatía - Firebase Functions

## 🚀 Environment Variables Setup

### **📋 Required Variables:**

#### **1. Google Gemini API Key**
```bash
# PowerShell
$env:GEMINI_API_KEY="your-gemini-key-here"

# CMD
set GEMINI_API_KEY=your-gemini-key-here

# Linux/Mac
export GEMINI_API_KEY="your-gemini-key-here"
```

**🔑 How to get:**
- Visit: https://makersuite.google.com/app/apikey
- Create a new API key
- Copy and paste in the command above

#### **2. Firebase Configuration (Optional - has fallback)**
```bash
# PowerShell
$env:FIREBASE_PROJECT_ID="telepatia-a2b3d"
$env:FIREBASE_STORAGE_BUCKET="telepatia-a2b3d.appspot.com"

# CMD
set FIREBASE_PROJECT_ID=telepatia-a2b3d
set FIREBASE_STORAGE_BUCKET=telepatia-a2b3d.appspot.com
```

### **🔧 Local Development Configuration:**

#### **Option 1: Environment Variables (Recommended)**
```bash
# PowerShell - Execute before running the emulator
$env:GEMINI_API_KEY="your-gemini-key-here"
$env:FIREBASE_PROJECT_ID="telepatia-a2b3d"
$env:FIREBASE_STORAGE_BUCKET="telepatia-a2b3d.appspot.com"
$env:FIREBASE_STORAGE_EMULATOR_HOST="http://localhost:9199"
$env:FUNCTIONS_EMULATOR="true"

# Now run the emulator
npm run serve
```

#### **Option 2: .env File (Alternative)**
```bash
# Copy the example file
cp env.example .env

# Edit the .env file with your keys
GEMINI_API_KEY=your-gemini-key-here
FIREBASE_PROJECT_ID=telepatia-a2b3d
FIREBASE_STORAGE_BUCKET=telepatia-a2b3d.appspot.com
FIREBASE_STORAGE_EMULATOR_HOST=http://localhost:9199
FUNCTIONS_EMULATOR=true
```

### **🌐 Production Configuration:**

Configure in Firebase Console:
1. **Functions** > **Configuration**
2. **Environment variables**
3. Add:
   - `GEMINI_API_KEY`: your-gemini-key-here
   - `FIREBASE_PROJECT_ID`: telepatia-a2b3d
   - `FIREBASE_STORAGE_BUCKET`: telepatia-a2b3d.appspot.com

### **🔍 Configuration Verification:**

```bash
# Check if variables are configured
echo $env:GEMINI_API_KEY
echo $env:FIREBASE_PROJECT_ID
echo $env:FIREBASE_STORAGE_BUCKET
```

### **❌ Common Issues:**

#### **Error: "GEMINI_API_KEY not configured"**
```bash
# Solution: Configure the environment variable
$env:GEMINI_API_KEY="your-gemini-key-here"
```

#### **Error: "Bucket does not exist"**
```bash
# Solution: Configure the correct bucket
$env:FIREBASE_STORAGE_BUCKET="telepatia-a2b3d.appspot.com"
```

#### **Error: "Project not found"**
```bash
# Solution: Configure the correct project
$env:FIREBASE_PROJECT_ID="telepatia-a2b3d"
```

### **🚀 Start the Project:**

```bash
# 1. Configure environment variables
$env:GEMINI_API_KEY="your-gemini-key-here"

# 2. Install dependencies
npm install

# 3. Start the emulator
npm run serve
```

### **📝 Important Notes:**

- **NEVER** commit your API keys to Git
- Always use environment variables
- The `.env` file is in `.gitignore`
- For production, configure in Firebase Console
- Google Cloud keys are configured via `gcloud auth application-default login`

---

## 🏗️ Project Structure

```
functions/
├── src/
│   ├── services/
│   │   ├── gemini.service.ts      # AI for extraction and diagnosis
│   │   ├── transcription.service.ts # Audio transcription
│   │   └── upload.service.ts      # File upload
│   ├── config/
│   │   └── env.config.ts          # Environment configuration
│   └── index.ts                   # Firebase Functions
├── env.example                    # Variables example
├── package.json                   # Dependencies
└── README.md                      # This file
```

## 🔧 Features

- **🎵 Audio Transcription**: Google Speech-to-Text (FREE)
- **📋 Data Extraction**: Google Gemini (FREE)
- **🏥 Diagnosis Generation**: Google Gemini (FREE)
- **📁 File Upload**: Firebase Storage
- **🌐 URL Support**: Google Drive, etc.

## 💰 Costs

- **Google Speech-to-Text**: FREE up to 60 min/month
- **Google Gemini**: FREE (1.5-flash model)
- **Firebase Functions**: FREE up to 125K invocations/month
- **Firebase Storage**: FREE up to 5GB


