from django.apps import AppConfig
from django.core.management import call_command


class AppConfigs(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    def ready(self):
        call_command("runapscheduler")
