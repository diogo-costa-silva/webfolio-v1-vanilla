# Portfolio Website

Modern portfolio built with **pure HTML, CSS, and JavaScript** - no frameworks, no build process.

**Live Site:** [https://diogo-costa-silva.github.io](https://diogo-costa-silva.github.io)

---

## ✨ Features

- **Dark/Light Theme** with persistent preference
- **PT/EN Languages** with dynamic switching
- **Fully Responsive** mobile-first design
- **Data-Driven** JSON-based content
- **GitHub Integration** real-time project stats

---

## 🛠️ Tech Stack

**HTML5** • **CSS3** • **Vanilla JavaScript** • **GitHub Pages**

No frameworks, no dependencies, no build process.

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/diogo-costa-silva/diogo-costa-silva.github.io.git
cd diogo-costa-silva.github.io

# Run locally with VS Code Live Server
# Or use Python:
python3 -m http.server 8000
# Visit http://localhost:8000
```

**No npm install needed!** Just open in a browser or use any HTTP server.

---

## 📝 Edit Content

<details>
<summary><strong>Add/Edit Skills</strong></summary>

Edit `data/skills.json`:

```json
{
  "name": "Docker",
  "icon": "devicon-docker-plain",
  "proficiency": 85,
  "years": "3+",
  "featured": true,
  "category": "devops"
}
```

</details>

<details>
<summary><strong>Add/Edit Projects</strong></summary>

Edit `data/projects.json`:

```json
{
  "id": 1,
  "title": "Project Name",
  "category": "data-science",
  "status": "completed",
  "technologies": ["Python", "Docker"],
  "github": "https://github.com/user/repo",
  "description": "Description...",
  "featured": true
}
```

</details>

<details>
<summary><strong>Update Translations</strong></summary>

Edit `data/translations.json`:

```json
{
  "en": { "nav.home": "Home" },
  "pt": { "nav.home": "Início" }
}
```

HTML elements with `data-i18n="nav.home"` update automatically.

</details>

---

## 📚 Technical Documentation

For developers interested in architecture, design decisions, and implementation details, see **[INFO.md](INFO.md)**.

---

## 📄 License

Personal portfolio project. Content © 2025 Diogo Silva.
