# 🚀 DIGITECH V2 – Enterprise AI Business Platform

DIGITECH V2 is an enterprise-grade AI-powered business platform that helps businesses automate customer engagement, review management, AI chat, and business operations using Azure OpenAI.

---

# ✨ Features

## 🤖 AI Review Assistant
- Generate professional AI replies
- Azure OpenAI GPT-5 powered
- One-click regenerate
- Copy & Publish support

## 💬 AI Chat Assistant
- Enterprise conversational AI
- Context-aware responses
- Azure OpenAI integration

## 👥 User Authentication
- JWT Authentication
- Secure login
- Registration
- Role-ready architecture

## 📊 Dashboard
- Business analytics
- Customer insights
- AI activity

## ⭐ Review Management
- Review history
- AI generated replies
- Customer review tracking

---

# 🛠 Technology Stack

## Frontend
- React
- Vite
- JavaScript
- CSS

## Backend
- ASP.NET Core 10
- Entity Framework Core
- SQL Server 2025

## AI
- Azure OpenAI
- GPT-5 Mini
- Enterprise AI Gateway

## Database
- Microsoft SQL Server

---

# 📂 Project Structure

```
OPENMINDAI
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   └── LocalMindAI.Api
│       ├── Controllers
│       ├── Models
│       ├── Services
│       ├── Interfaces
│       ├── Properties
│       └── Program.cs
│
└── docs
```

---

# ⚙ Requirements

- .NET 10 SDK
- Node.js 22+
- SQL Server 2025
- Azure OpenAI Resource
- Visual Studio 2022 / VS Code

---

# 🚀 Backend Setup

```bash
cd backend/LocalMindAI.Api

dotnet restore

dotnet ef database update

dotnet run
```

Backend runs on

```
https://localhost:5016
```

---

# 🚀 Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🔐 Azure OpenAI Configuration

Update

```
appsettings.json
```

with

```json
"AzureOpenAI": {
  "Endpoint": "...",
  "ApiKey": "...",
  "DeploymentName": "gpt-5-mini",
  "ApiVersion": "2024-10-21"
}
```

---

# 🗄 Database

Connection String

```json
Server=localhost;
Database=LocalMindAI;
Trusted_Connection=True;
TrustServerCertificate=True;
```

Run

```bash
dotnet ef database update
```

---

# 📌 Current Features

- Azure GPT-5 Integration
- SQL Server Integration
- Enterprise AI Gateway
- Review Assistant
- AI Chat
- JWT Authentication
- Review History
- Dashboard

---

# 📈 Roadmap

- Google Business Profile Integration
- AI Call Agent
- WhatsApp Integration
- Email Automation
- Analytics Dashboard
- Multi-tenant Support

---

# 📄 License

Private Project

---

# 👨‍💻 Author

Syed Raza

Enterprise AI Developer
