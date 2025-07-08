# 🛡️ Fraud Detection System

A comprehensive fraud detection system that analyzes phishing URLs, APK files, QRIS codes, and virtual phone numbers using AI-powered analysis and WhatsApp integration.

## 🚀 Features

### 🔍 **Multi-Modal Analysis**
- **Phishing Detection**: Analyze suspicious URLs and HTML content
- **APK Analysis**: Deep malware analysis with reverse engineering indicators
- **QRIS Scanner**: QRIS code validation and fraud detection
- **Virtual Number Check**: Phone number verification with e-wallet status

### 🤖 **AI-Powered Analysis**
- **DeepSeek Integration**: Advanced LLM analysis for threat classification
- **Professional Reports**: Detailed forensic analysis with risk ratings
- **WhatsApp-Friendly Output**: Formatted reports optimized for mobile viewing

### 📱 **WhatsApp Integration**
- **Bot Commands**: `/phising <url>` and `/telp <number>` commands
- **Media Processing**: Automatic APK and QRIS image analysis
- **Real-time Alerts**: Instant fraud detection notifications

### 🎨 **Modern Web Dashboard**
- **Beautiful UI**: Light theme with Sora font and glassmorphism effects
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data**: Live updates from database
- **Detailed Modals**: Comprehensive information display

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, Sequelize ORM
- **Database**: MySQL
- **AI**: DeepSeek API (OpenAI-compatible)
- **WhatsApp**: whatsapp-web.js
- **Frontend**: HTML5, CSS3, Bootstrap 5, JavaScript
- **APK Analysis**: APKTool, DEX analysis
- **QRIS**: QRIS parsing and validation

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL Database
- DeepSeek API Key
- QPanel API Key (for virtual number analysis)

## 🔧 Installation

### 1. Clone Repository
```bash
git clone <repository-url>
cd fraud
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create `.env` file in root directory:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=fraud_detection
DB_PORT=3306

# API Keys
DEEPSEEK_API_KEY=your_deepseek_api_key
QPANEL_API_KEY=your_qpanel_api_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

### 4. Database Setup
```bash
# Run migrations
npx sequelize-cli db:migrate

# Run seeders (optional)
npx sequelize-cli db:seed:all
```

### 5. Start Application
```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

## 📱 Usage

### WhatsApp Bot Commands

#### Phishing Analysis
```
/phising <url>
```
Example: `/phising http://fake-bank.com/login`

#### Virtual Number Analysis
```
/telp <phone_number>
```
Example: `/telp 081234567890`

### Web Dashboard

1. **Access Dashboard**: Open `http://localhost:3000`
2. **View Data**: Navigate between Applications, Phishing, QRIS, and Virtual Numbers tabs
3. **Details**: Click "View Details" to see comprehensive analysis reports

## 🗄️ Database Schema

### Applications Table
- `id` (Primary Key)
- `file_identification` (File hash)
- `file_name` (Original filename)
- `report_count` (Number of reports)
- `llm_report` (AI analysis report)
- `createdAt`, `updatedAt` (Timestamps)

### Phishing Table
- `id` (Primary Key)
- `url_phising` (Suspicious URL)
- `file_html` (HTML content)
- `report_count` (Number of reports)
- `llm_report` (AI analysis report)
- `createdAt`, `updatedAt` (Timestamps)

### QRIS Table
- `id` (Primary Key)
- `qris_data` (QRIS payload)
- `report_count` (Number of reports)
- `llm_report` (AI analysis report)
- `createdAt`, `updatedAt` (Timestamps)

### Virtual Numbers Table
- `id` (Primary Key)
- `phone_number` (Phone number)
- `operator` (Mobile operator)
- `whatsapp` (WhatsApp status)
- `ovo`, `gopay`, `dana`, `linkaja`, `isaku`, `shopeepay` (E-wallet status)
- `report_count` (Number of reports)
- `llm_report` (AI analysis report)
- `createdAt`, `updatedAt` (Timestamps)

## 🔍 Analysis Features

### APK Analysis
- **Permission Analysis**: Dangerous permissions detection
- **Obfuscation Detection**: Code obfuscation analysis
- **Network Activity**: Suspicious network connections
- **Root Detection**: Anti-analysis techniques
- **Malware Classification**: Risk level assessment

### Phishing Analysis
- **Domain Analysis**: Typosquatting detection
- **URL Structure**: Suspicious patterns identification
- **SSL Verification**: Security certificate validation
- **Content Analysis**: Phishing indicators detection

### QRIS Analysis
- **Payload Validation**: QRIS format verification
- **Merchant Information**: Store details extraction
- **Fraud Indicators**: Suspicious patterns detection

### Virtual Number Analysis
- **Operator Detection**: Mobile carrier identification
- **E-wallet Status**: Digital wallet availability
- **WhatsApp Status**: WhatsApp registration check
- **Risk Assessment**: Fraud probability calculation

## 🎨 UI Features

### Design System
- **Color Palette**: Professional light theme
- **Typography**: Sora font family
- **Animations**: Smooth transitions and hover effects
- **Glassmorphism**: Modern glass-like effects

### Components
- **Dashboard Cards**: Statistics overview
- **Data Tables**: Sortable and searchable
- **Modal Details**: Comprehensive information display
- **Loading States**: User-friendly loading indicators

## 🔒 Security

### Protected Content
- Environment variables (`.env`)
- Database files (`*.db`, `*.sqlite`)
- WhatsApp sessions (`.wwebjs_auth/`)
- Uploaded files (`downloads/`, `uploads/`)
- API keys and tokens

### Best Practices
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Secure file handling
- API rate limiting

## 🚀 Deployment

### Production Setup
1. **Environment Variables**: Configure production `.env`
2. **Database**: Set up production MySQL instance
3. **SSL Certificate**: Configure HTTPS
4. **Process Manager**: Use PM2 or similar
5. **Reverse Proxy**: Nginx configuration

### Docker Deployment
```bash
# Build image
docker build -t fraud-detection .

# Run container
docker run -p 3000:3000 fraud-detection
```

## 📊 API Endpoints

### GET `/api/applications`
Returns all application analysis data

### GET `/api/phisings`
Returns all phishing analysis data

### GET `/api/qris`
Returns all QRIS analysis data

### GET `/api/virtual_numbers`
Returns all virtual number analysis data

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v1.0.0
- Initial release
- WhatsApp bot integration
- Web dashboard
- AI-powered analysis
- Multi-modal fraud detection

---

**⚠️ Disclaimer**: This tool is for educational and legitimate security research purposes only. Always ensure you have proper authorization before analyzing any files or URLs. 