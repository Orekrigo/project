from apscheduler.schedulers.background import BackgroundScheduler
from django.conf import settings
from django.core.management.base import BaseCommand
from django_apscheduler.jobstores import DjangoJobStore
from app.recommendation import Recommendation


class Command(BaseCommand):
    def __init__(self):
        super(Command, self).__init__()
        self.job = Recommendation()

    def handle(self, *args, **options):
        scheduler = BackgroundScheduler(timezone=settings.TIME_ZONE)
        scheduler.add_jobstore(DjangoJobStore(), "default")
        job_id = "recommendation"
        scheduler.add_job(self.job.result, 'interval', hours=2, id=job_id, replace_existing=True)

        try:
            scheduler.start()
        except KeyboardInterrupt:
            scheduler.shutdown()
