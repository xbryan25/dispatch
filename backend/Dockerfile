# Base image
FROM python:3.12-slim

# Environment settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory inside container
WORKDIR /app

# Install build tools and PostgreSQL dev files
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy dependency files first (for caching)
COPY pyproject.toml poetry.lock ./

# Disable virtualenv (use container environment)
RUN poetry config virtualenvs.create false

# Install Python dependencies
RUN poetry install --no-root --no-interaction --no-ansi

RUN pip install gunicorn uvicorn

# Copy application code
COPY . .

# Expose FastAPI port
EXPOSE 8000

# Run the app
CMD ["gunicorn", "-k", "uvicorn.workers.UvicornWorker", "src.main:app", "--bind", "0.0.0.0:8000", "--workers", "4"]