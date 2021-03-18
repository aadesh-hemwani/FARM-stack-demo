from pydantic import BaseSettings


class CommonSettings(BaseSettings):
    APP_NAME: str = "Checklist"
    DEBUG_MODE: bool = True


class ServerSettings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8000


class DatabaseSettings(BaseSettings):
    DB_URL: str = "mongodb://127.0.0.1:27017/"
    DB_NAME: str = "checklist"


class Settings(CommonSettings, ServerSettings, DatabaseSettings):
    pass


settings = Settings()
