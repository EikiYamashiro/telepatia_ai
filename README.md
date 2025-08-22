# 🏥 Telepatía - AI Medical Assistant

## 🌟 Overview

Telepatía is an intelligent medical assistant that uses AI to:
- **🎵 Transcribe audio** using Google Speech-to-Text
- **📋 Extract medical information** using Google Gemini AI
- **🧠 Generate medical diagnoses** using Google Gemini AI
- **📱 Modern web interface** built with Angular

## 🎥 Demo Video

Watch Telepatía in action:

<div align="center">
  <a href="https://youtu.be/3ZKU1P7J70o" target="_blank">
    <img src="https://img.youtube.com/vi/3ZKU1P7J70o/maxresdefault.jpg" 
         alt="Telepatía Demo Video" 
         width="600" 
         style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.2s ease-in-out;"
         onmouseover="this.style.transform='scale(1.02)'" 
         onmouseout="this.style.transform='scale(1)'">
  </a>
  
  <br><br>
  
  [▶️ **Click to Watch Full Demo on YouTube**](https://youtu.be/3ZKU1P7J70o)
</div>

> 💡 **Tip**: Click on the video thumbnail above to watch the full demo on YouTube!

## 🏗️ Architecture

```
telepatia/
├── web/                    # Frontend (Angular)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # UI Components
│   │   │   └── services/   # API Services
│   │   └── ...
│   └── package.json
├── functions/              # Backend (Firebase Cloud Functions)
│   ├── src/
│   │   ├── services/       # AI Services
│   │   └── index.ts        # HTTP Functions
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### **1. Clone the Repository**
```bash
git clone <repository-url>
cd telepatia
```

### **2. Setup Backend (Firebase Functions)**
```bash
cd functions
npm install
```

### **3. Setup Frontend (Angular)**
```bash
cd ../web
npm install
```

### **4. Configure Environment Variables**
```bash
# Set your Gemini API key
export GEMINI_API_KEY="your-api-key-here"
```

### **5. Run the Application**
```bash
# Terminal 1: Backend
cd functions
npm run serve

# Terminal 2: Frontend
cd web
npm start
```

---

## 🔧 Detailed Setup Instructions

### **📋 Prerequisites**

#### **Required Software:**
- **Node.js** (v18 or higher)
- **npm** (v8 or higher)
- **Git**
- **Firebase CLI** (for deployment)

#### **Required Accounts:**
- **Google Cloud** (for Gemini AI)
- **Firebase** (for hosting and functions)

---

## 🖥️ Platform-Specific Setup

### **🐧 Linux (Ubuntu/Debian)**

#### **1. Install Node.js**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### **2. Install Git**
```bash
sudo apt update
sudo apt install git
```

#### **3. Install Firebase CLI**
```bash
npm install -g firebase-tools
```

#### **4. Setup Environment Variables**
```bash
# Add to ~/.bashrc
echo 'export GEMINI_API_KEY="your-api-key-here"' >> ~/.bashrc
echo 'export FIREBASE_PROJECT_ID="your-project-id"' >> ~/.bashrc
echo 'export FIREBASE_STORAGE_BUCKET="your-bucket-name"' >> ~/.bashrc

# Reload bashrc
source ~/.bashrc
```

---

### **🍎 macOS**

#### **1. Install Node.js**
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
# Verify installation
node --version
npm --version
```

#### **2. Install Git**
```bash
# Usually pre-installed, or:
brew install git
```

#### **3. Install Firebase CLI**
```bash
npm install -g firebase-tools
```

#### **4. Setup Environment Variables**
```bash
# Add to ~/.zshrc or ~/.bash_profile
echo 'export GEMINI_API_KEY="your-api-key-here"' >> ~/.zshrc
echo 'export FIREBASE_PROJECT_ID="your-project-id"' >> ~/.zshrc
echo 'export FIREBASE_STORAGE_BUCKET="your-bucket-name"' >> ~/.zshrc

# Reload shell
source ~/.zshrc
```

---

### **🪟 Windows**

#### **1. Install Node.js**
- Download from [https://nodejs.org/](https://nodejs.org/)
- Choose LTS version (18.x or higher)
- Run installer as Administrator
- Verify installation:
```cmd
node --version
npm --version
```

#### **2. Install Git**
- Download from [https://git-scm.com/](https://git-scm.com/)
- Run installer with default options
- Restart Command Prompt/PowerShell

#### **3. Install Firebase CLI**
```cmd
npm install -g firebase-tools
```

#### **4. Setup Environment Variables**

**Option A: Command Line (Temporary)**
```cmd
set GEMINI_API_KEY=your-api-key-here
set FIREBASE_PROJECT_ID=your-project-id
set FIREBASE_STORAGE_BUCKET=your-bucket-name
```

**Option B: System Environment (Permanent)**
1. Press `Win + R`, type `sysdm.cpl`
2. Click "Environment Variables"
3. Under "User variables", click "New"
4. Add each variable:
   - `GEMINI_API_KEY` = `your-api-key-here`
   - `FIREBASE_PROJECT_ID` = `your-project-id`
   - `FIREBASE_STORAGE_BUCKET` = `your-bucket-name`

**Option C: PowerShell (Temporary)**
```powershell
$env:GEMINI_API_KEY="your-api-key-here"
$env:FIREBASE_PROJECT_ID="your-project-id"
$env:FIREBASE_STORAGE_BUCKET="your-bucket-name"
```

---

## 🔑 API Keys Setup

### **1. Google Gemini AI**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Set environment variable:
   ```bash
   export GEMINI_API_KEY="your-key-here"
   ```

### **2. Firebase Project**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project or select existing
3. Note your Project ID
4. Set environment variable:
   ```bash
   export FIREBASE_PROJECT_ID="your-project-id"
   ```

---

## 🚀 Running the Application

### **Backend (Firebase Functions)**

#### **1. Navigate to Functions Directory**
```bash
cd functions
```

#### **2. Install Dependencies**
```bash
npm install
```

#### **3. Start Local Emulator**
```bash
npm run serve
```

**Expected Output:**
```
✔  functions[extractMedicalInfo(us-central1)] Successful compilation.
✔  functions[generateDiagnosis(us-central1)] Successful compilation.
✔  functions[transcribeAudio(us-central1)] Successful compilation.
✔  functions[transcribeAudioFile(us-central1)] Successful compilation.
✔  functions[uploadAudioFile(us-central1)] Successful compilation.
✔  All functions compiled successfully.
```

#### **4. Verify Backend is Running**
- Functions should be available at `http://localhost:5001`
- Check console for any errors

---

### **Frontend (Angular)**

#### **1. Navigate to Web Directory**
```bash
cd web
```

#### **2. Install Dependencies**
```bash
npm install
```

#### **3. Start Development Server**
```bash
npm start
```

**Expected Output:**
```
✔ Browser application bundle generation complete.
✔ Compiled successfully.
✔ Browser application bundle generation complete.

** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
```

#### **4. Open Browser**
- Navigate to `http://localhost:4200`
- You should see the Telepatía interface

---

## 🧪 Testing the Application

### **1. Test Text Extraction**
1. Paste this medical text:
```
Patient Carlos Oliveira, 28 years old, male, ID 987.654.321-00. 
Reports intense headache for 5 days, accompanied by nausea and light sensitivity. 
Works as a designer and spends 8 hours a day in front of the computer. 
Consultation reason: Evaluation of persistent headache and possible migraine.
```

2. Click "📋 Extract"
3. Verify data is extracted correctly

### **2. Test Diagnosis Generation**
1. After extraction, click "🧠 Generate Diagnosis"
2. Wait for AI response
3. Verify diagnosis is in English

### **3. Test Audio Transcription**
1. Click "🎵 Audio"
2. Paste a Google Drive audio URL
3. Click "🌐 Transcribe"
4. Verify transcription works

---

## 🐛 Troubleshooting

### **Common Issues**

#### **1. "GEMINI_API_KEY not configured"**
```bash
# Verify environment variable is set
echo $GEMINI_API_KEY  # Linux/Mac
echo %GEMINI_API_KEY% # Windows CMD
echo $env:GEMINI_API_KEY # Windows PowerShell
```

#### **2. "Port already in use"**
```bash
# Kill process using port 4200
lsof -ti:4200 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :4200   # Windows
```

#### **3. "Firebase not found"**
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login
```

#### **4. "Node modules not found"**
```bash
# Remove and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Platform-Specific Issues**

#### **Linux: Permission Denied**
```bash
# Fix npm permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

#### **macOS: Python Version Issues**
```bash
# Install Python 3
brew install python3

# Link python3 to python
ln -s /usr/local/bin/python3 /usr/local/bin/python
```

#### **Windows: Path Issues**
1. Ensure Node.js is in PATH
2. Restart Command Prompt after installation
3. Run as Administrator if needed

---

## 📱 Development Workflow

### **1. Making Changes**
```bash
# Backend changes
cd functions
npm run build  # Compile TypeScript
npm run serve  # Start emulator

# Frontend changes
cd web
npm start      # Auto-reload on changes
```

### **2. Testing Changes**
1. Make changes to code
2. Save files
3. Check browser/console for errors
4. Test functionality

### **3. Debugging**
```bash
# Backend logs
cd functions
npm run serve  # View function logs

# Frontend logs
# Check browser console (F12)
```

---

## 🚀 Deployment

### **1. Deploy Backend**
```bash
cd functions
firebase deploy --only functions
```

### **2. Deploy Frontend**
```bash
cd web
ng build --prod
firebase deploy --only hosting
```

---

## 📚 Additional Resources

### **Documentation**
- [Angular Documentation](https://angular.io/docs)
- [Firebase Functions](https://firebase.google.com/docs/functions)
- [Google Gemini AI](https://ai.google.dev/docs)
- [Google Speech-to-Text](https://cloud.google.com/speech-to-text)

### **Support**
- Check [Issues](../../issues) for known problems
- Create new issue for bugs
- Check Firebase Console for function logs

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- Google Gemini AI for medical analysis
- Google Speech-to-Text for audio transcription
- Firebase for serverless infrastructure
- Angular team for the amazing framework

---

**Happy coding! 🚀**
