'''Use this for production'''

from .base import *

DEBUG = False
# ALLOWED_HOSTS += ['*']
WSGI_APPLICATION = 'todo-app.wsgi.prod.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'todo',
        'USER': 'todo',
        'PASSWORD': 'todotodo',
        'HOST': 'localhost',
        'PORT': '',
    }
}


