# HelioWeb Frontent Structure

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Project](#running-the-project)
- [Project Structure](#project-structure)
- [Coding Practices](#coding-practices)
  - [File Naming](#file-naming)
  - [Imports Order](#imports-order)
  - [Comments](#comments)
  - [Folder Structure](#folder-structure)
  - [Code Quality](#code-quality)
- [Contributing](#contributing)
  - [Branching Strategy](#branching-strategy)
  - [Workflow](#workflow)
- [License](#license)

## Overview

This repository contains the codebase for our frontend projects. The project is built using Vite and React Router v6 for routing. This document outlines the coding practices and structure to be followed by all team members to maintain consistency and quality across the codebase.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarns

### Installation

1. Clone the repository:
   `git clone https://github.com/your-repo/project-name.git`
2. Navigate to the project directory:
   `cd project-name`
3. Install dependencies:

```
    npm install
    # or
    yarn install
```

### Running the project

To start the development server:

```
    npm run dev
    # or
    yarn dev
```

### Project Structure

The project follows a structured folder hierarchy to ensure clarity and maintainability.

```
project-name/
├── public/
├── index.html
├── src/
│   ├── assets/         # Static assets (images, fonts, etc.)
│   ├── components/     # Reusable components
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Pages
│   |    ├── sections/  # Different sections within that page
│   ├── routes/         # Route definitions
│   ├── services/       # API calls and services
│   ├── styles/         # Global styles and theming
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
├── .gitignore
├── package.json
├── README.md

```

## Coding Practices

### File Naming

- Use camelCase for filenames (e.g., myHook.js).
- Use PascalCase for component files (e.g., MyComponent.jsx).

### Imports Order

1. React and other library imports
2. Page/Component/Section imports
3. Style imports (global and component-specific styles)
4. Relative imports (utility functions, hooks, or other modules.)

### Comments

- Add inline comments for complex logic.
- Keep comments concise and relevant.
- Avoid stating the obvious; focus on explaining the “why” rather than the “what”.
- Regularly update comments to reflect any changes in the code.

### Folder Structure

- components: Contains all reusable components.
- pages: Contains page-level components.
- hooks: Custom hooks.
- services: API calls and services.
- styles: Global styles and theming.
- utils: Utility functions.

### Code Quality

- Use ESLint for linting.
- Use Prettier for code formatting.

## Contributing

We welcome contributions from all team members to ensure the continuous improvement of our projects. Please follow the guidelines below to contribute effectively.

### Branching Strategy

1. **Main Branch**:

   - The `main` branch is the production-ready branch.
   - Code pushed to `main` will be deployed to the production environment.

2. **Staging Branch**:
   - The `staging` branch is used for testing and quality assurance.
   - Code pushed to `staging` will be deployed to the staging environment.

### Workflow

1. **Cloning the Repository**:

   - Clone the repository and checkout the `staging` branch:
     ```bash
     git clone https://github.com/your-repo/project-name.git
     cd project-name
     git checkout staging
     ```

2. **Creating a Feature Branch**:

   - Create a new branch from `staging` for your feature or bug fix. Name the branch as `firstname-feature`:
     ```bash
     git checkout -b yourname-feature
     ```

3. **Making Changes**:

   - Make your changes in the new branch.
   - Commit your changes with clear and descriptive commit messages:
     ```bash
     git add .
     git commit -m "Add feature description"
     ```

4. **Pushing Changes**:

   - Push your changes to the remote repository:
     ```bash
     git push origin yourname-feature
     ```

5. **Creating a Pull Request**:

   - Create a pull request (PR) from your feature branch to the `staging` branch.
   - Ensure your PR includes a detailed description of the changes and any relevant issue numbers.

6. **Code Review**:

   - Your PR will be reviewed by other team members.
   - Address any feedback and make necessary changes.

7. **Merging and Deleting Branch**:
   - Once the PR is approved and merged into `staging`, the feature branch will be deleted.
   - Regularly pull the latest changes from `staging` to keep your local branch up-to-date:
     ```bash
     git pull origin staging
     ```

## License

This project is licensed under the HelioWeb Proprietary License.

### HelioWeb Proprietary License

1. **Ownership**: The source code and all associated intellectual property rights remain the exclusive property of HelioWeb.
2. **Usage Rights**: Clients are granted a non-exclusive, non-transferable license to use the developed project for their internal business purposes.
3. **Modifications and Updates**: Only HelioWeb has the right to modify, update, or enhance the source code. Clients may request modifications or updates, which will be performed by HelioWeb under separate terms and conditions.
4. **Redistribution**: Clients are not permitted to redistribute, sublicense, or transfer the source code or any derivative works to any third party without prior written consent from HelioWeb.
5. **Confidentiality**: Clients must maintain the confidentiality of the source code and any related documentation, and must not disclose it to any third party without HelioWeb's prior written consent.

For more details, please refer to the full license agreement provided by HelioWeb.
