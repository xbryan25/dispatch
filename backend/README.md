Run using 

```poetry run fastapi dev test.py```


Project structure

fastapi-project
├── src/
│   ├── __init__.py
│
│   ├── core/                     # Global app concerns
│   │   ├── __init__.py
│   │   ├── config.py             # Settings (env, app config)
│   │   ├── database.py           # DB engine/session
│   │   ├── logging.py            # Logging config
│   │   └── security.py           # JWT, password hashing, etc.
│
│   ├── auth/                     # Feature: Auth
│   │   ├── __init__.py
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   ├── dependencies.py
│   │   ├── exceptions.py
│   │   ├── constants.py
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── auth_service.py
│   │   │   └── token_service.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       └── hashing.py
│
│   ├── posts/                    # Feature: Posts
│   │   ├── __init__.py
│   │   ├── router.py
│   │   ├── schemas.py
│   │   ├── models.py
│   │   ├── dependencies.py
│   │   ├── exceptions.py
│   │   ├── constants.py
│   │   └── services/
│   │       ├── __init__.py
│   │       └── post_service.py
│
│   ├── aws/                      # External service integration
│   │   ├── __init__.py
│   │   ├── client.py
│   │   ├── schemas.py
│   │   ├── config.py
│   │   ├── exceptions.py
│   │   └── utils.py
│
│   ├── pagination.py             # Cross-feature utility
│   ├── models.py                 # Shared ORM models
│   ├── exceptions.py             # Global app exceptions
│   └── main.py                   # App entrypoint
│
├── tests/
│   ├── __init__.py
│   ├── auth/
│   │   └── __init__.py
│   ├── posts/
│   │   └── __init__.py
│   └── aws/
│       └── __init__.py
│
├── .env
├── .gitignore
├── pyproject.toml
├── poetry.lock
└── logging.ini
