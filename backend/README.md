Run using

`poetry run fastapi dev test.py`

To stop zombie process on port 8000 (run on powershell)

`Stop-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess`

Project structure

fastapi-project
├── src/
│ ├── **init**.py
│
│ ├── core/ # Global app concerns
│ │ ├── **init**.py
│ │ ├── config.py # Settings (env, app config)
│ │ ├── database.py # DB engine/session
│ │ ├── logging.py # Logging config
│ │ └── security.py # JWT, password hashing, etc.
│
│ ├── auth/ # Feature: Auth
│ │ ├── **init**.py
│ │ ├── router.py
│ │ ├── schemas.py
│ │ ├── models.py
│ │ ├── dependencies.py
│ │ ├── exceptions.py
│ │ ├── constants.py
│ │ ├── services/
│ │ │ ├── **init**.py
│ │ │ ├── auth_service.py
│ │ │ └── token_service.py
│ │ └── utils/
│ │ ├── **init**.py
│ │ └── hashing.py
│
│ ├── posts/ # Feature: Posts
│ │ ├── **init**.py
│ │ ├── router.py
│ │ ├── schemas.py
│ │ ├── models.py
│ │ ├── dependencies.py
│ │ ├── exceptions.py
│ │ ├── constants.py
│ │ └── services/
│ │ ├── **init**.py
│ │ └── post_service.py
│
│ ├── aws/ # External service integration
│ │ ├── **init**.py
│ │ ├── client.py
│ │ ├── schemas.py
│ │ ├── config.py
│ │ ├── exceptions.py
│ │ └── utils.py
│
│ ├── pagination.py # Cross-feature utility
│ ├── models.py # Shared ORM models
│ ├── exceptions.py # Global app exceptions
│ └── main.py # App entrypoint
│
├── tests/
│ ├── **init**.py
│ ├── auth/
│ │ └── **init**.py
│ ├── posts/
│ │ └── **init**.py
│ └── aws/
│ └── **init**.py
│
├── .env
├── .gitignore
├── pyproject.toml
├── poetry.lock
└── logging.ini
