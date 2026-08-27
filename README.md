# RPG Character Tracker

A lightweight, robust, and extensible tool designed for tracking character health, initiative order, and core attributes in tabletop role-playing games (RPGs) or tactical battles.

---

## 🎯 Project Objective

The goal of **RPG Character Tracker** is to simplify combat management and turn-tracking for Game Masters (GMs) and players alike. Tabletop RPG combat can get bogged down by tracking numerous statistics, health points, and turn orders. This project provides a centralized, automated tracker that:
- Automatically manages turn initiative order.
- Handles health calculations safely (preventing errors like negative health or healing past maximum HP).
- Acts as a clean, modular foundation that can easily be integrated with various frontend clients in the future.

---

## 🚀 Initial Commit: What is Implemented?

This is the initial commit of the project, focusing on building a reliable, well-tested core. Currently, the repository includes a complete monorepo setup consisting of a robust backend service:

- **Clean Architecture Core**: Isolated domain layer (entities and validation rules), use cases (application business logic), and adapter layers.
- **Character Management**: Create, delete, list, and modify character statistics.
- **Dynamic Initiative Tracking**: Manage character initiative/turn ordering dynamically.
- **HP Management Engine**: Automated formulas for handling damage and healing safely within bounds.
- **Zero-Config JSON Database**: A simple file-based JSON repository that persists data locally without requiring complex database configurations.
- **Full Test Coverage**: Comprehensive suite of unit and integration tests verifying domain logic, CRUD repository operations, use cases, and controller responses.
- **Ready-to-use API testing suite**: Pre-configured Postman collection to instantly test backend features.

---

## 🛠️ Technologies Used & Rationale

- **Python 3.x**: Chosen for its readability, expressive syntax, and excellent support for robust domain modeling.
- **Flask**: A lightweight Python micro-framework. It was selected because it is minimal and unopinionated, allowing us to implement a custom Clean Architecture structure without framework-imposed constraints.
- **Pytest**: Used for automated testing. Its powerful fixture system and simplicity make it perfect for verifying both isolated unit logic and integration endpoints.
- **JSON File Database**: Serves as our persistent storage for this initial phase. It enables rapid prototyping and immediate setup out-of-the-box, storing data locally inside the project.

---

## 📂 Project Structure

The project is organized as a monorepo:
- `backend/`: Python backend containing the core API, domain logic, database adapters, and tests.
- `frontend/`: Planned directory for the web client interface (technologies to be determined in upcoming features).

---

## ⚙️ Getting Started (Backend)

### Prerequisites
- Python 3.x
- `pip` (Python package manager)

### Installation

1. Clone the repository and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. (Optional) Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   # For running tests, also install pytest:
   pip install pytest
   ```

### Running the App

To launch the backend local development server:
```bash
python app/main.py
```
The server will start running on `http://127.0.0.1:5000/` with live reload enabled.

### Running Tests

To run the test suite (unit and integration tests):
```bash
pytest
```
