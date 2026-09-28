# Contributing to AI Travel Planner

Thank you for your interest in contributing to the **AI Travel Planner** project! We welcome contributions from developers of all skill levels.

---

## 🚀 How to Contribute

### 1. Fork & Clone
1. Fork the repository on GitHub: `https://github.com/yamunaparameshwar/Travel_Planner`
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/Travel_Planner.git
   cd Travel_Planner
   ```

### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 3. Make Your Changes
- Follow existing code style and formatting standards.
- Ensure backend code follows PEP 8 principles.
- Ensure frontend code passes ESLint without errors (`npm run lint`).

### 4. Test Your Changes
- **Backend Tests:**
  ```bash
  cd ai-travel-planner-backend/backend
  python manage.py test
  ```
- **Frontend Build & Lint:**
  ```bash
  cd ai-travel-planner-frontend/frontend
  npm run lint
  npm run build
  ```

### 5. Commit & Push
```bash
git add .
git commit -m "feat: add user preference sorting to travel planner"
git push origin feature/your-feature-name
```

### 6. Submit a Pull Request
Open a Pull Request on GitHub against the `main` branch with a clear description of your changes.

---

## 📝 Code of Conduct

- Be respectful and courteous to all community members and contributors.
- Provide constructive feedback during pull request reviews.
- Maintain high security standards; do not submit API keys, credentials, or sensitive tokens in PRs.

Thank you for helping make AI Travel Planner better!
