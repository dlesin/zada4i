'''Use this for development'''

from .base import *

ALLOWED_HOSTS += ['127.0.0.1', 'localhost']
DEBUG = True

WSGI_APPLICATION = 'todo-app.wsgi.dev.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

CORS_ORIGIN_ALLOW_ALL = True
CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
]
CORS_ALLOW_HEADERS = ['*']