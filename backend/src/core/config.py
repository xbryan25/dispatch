from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET: str
    SUPABASE_COOKIE_NAME: str

    SUPABASE_PROJECT_ID: str
    SUPABASE_S3_ENDPOINT: str
    SUPABASE_S3_ACCESS_KEY: str
    SUPABASE_S3_SECRET_KEY: str
    SUPABASE_S3_BUCKET_NAME: str

    model_config = SettingsConfigDict(
        env_file="../.env", env_file_encoding="utf-8", extra="ignore"
    )


settings = Settings()  # type: ignore
