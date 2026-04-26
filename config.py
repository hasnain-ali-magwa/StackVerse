import os


class Config:
    # Flask Secret Key
    SECRET_KEY = os.environ.get(
        "SECRET_KEY",
        "stackverse-super-secret-key"
    )

    # JSON Data Folder Path
    BASE_DIR = os.path.abspath(
        os.path.dirname(__file__)
    )

    DATA_FOLDER = os.path.join(
        BASE_DIR,
        "static",
        "data"
    )

    # App Config
    DEBUG = True

    # Branding
    PROJECT_NAME = "StackVerse"
    PROJECT_VERSION = "1.0.0"

    # Pagination / Future Scalability
    TOOLS_PER_PAGE = 20

    # API Settings
    JSON_SORT_KEYS = False

    # Upload configs (future use)
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024

    # Cache config (future use)
    SEND_FILE_MAX_AGE_DEFAULT = 0