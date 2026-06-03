import os


class Config:
    SECRET_KEY = os.environ.get(
        "SECRET_KEY",
        "stackverse-super-secret-key"
    )

    BASE_DIR = os.path.abspath(
        os.path.dirname(__file__)
    )

    DATA_FOLDER = os.path.join(
        BASE_DIR,
        "static",
        "data"
    )

    DEBUG = True

    PROJECT_NAME = "StackVerse"
    PROJECT_VERSION = "1.0.0"

    TOOLS_PER_PAGE = 20

    JSON_SORT_KEYS = False

    MAX_CONTENT_LENGTH = 16 * 1024 * 1024

    SEND_FILE_MAX_AGE_DEFAULT = 0