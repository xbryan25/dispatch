from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Async engine
engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # prints SQL queries, useful for dev
    pool_size=10,
    max_overflow=20,
    future=True,
    connect_args={"statement_cache_size": 0},
)

# Async session factory
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)

# Base class for ORM models
Base = declarative_base()
