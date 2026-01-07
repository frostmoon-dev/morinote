# Morinote 🌿

**Morinote** is a personal learning documentation app tailored for developers, designed with a calming "Mori Girl" aesthetic. It helps you track your learning journey, providing proof of your progress in a distraction-free, natural environment.

![Mori Girl Vibe](https://images.unsplash.com/photo-1507646176378-b677a8370dd5?auto=format&fit=crop&q=80&w=1000)

## Features ✨

*   **Distraction-Free Writing**: A clean, "white paper" interface for documenting your learnings.
*   **Rich Text Editor**: Markdown support with a "hybrid" view that dims syntax for a WYSIWYG feel.
*   **Proof of Learning**: Export your notes to PDF or print them beautifully as physical keepsakes.
*   **Mori Girl Aesthetic**: Earthy tones, soft typography, and natural textures to reduce anxiety and promote focus.
*   **Data Safety**: Auto-saves to local storage and supports JSON Import/Export backups.
*   **Built for Devs**: Code block highlighting, tag management, and fast keyboard navigation.

## Tech Stack 🛠️

*   **Electron**: Cross-platform desktop environment.
*   **React**: UI library for building dynamic components.
*   **Vite**: Fast build tool and development server.
*   **SimpleMDE (EasyMDE)**: The core markdown editor engine.
*   **Lucide React**: Beautiful, consistent icons.

## Getting Started 🚀

### Prerequisites

*   Node.js (v16 or higher)
*   npm (v7 or higher)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/morinote.git
    cd morinote
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running Locally

To start the development server with hot-reload:

```bash
npm run dev
```

This will launch the Electron window.

### Building for Production

To create an executable installer (e.g., `.exe` on Windows):

```bash
npm run package
```

The output will be in the `dist/` directory.

## Data Persistence 💾

Your notes are stored locally on your machine.
*   **Auto-save**: Notes are saved automatically to your application's local storage.
*   **Backup**: Go to `Settings > Export Data` to download a JSON backup of your library.

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
*Created with 🤍 for the love of learning.*
