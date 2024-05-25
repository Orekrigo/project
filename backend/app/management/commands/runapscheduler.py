from apscheduler.schedulers.background import BackgroundScheduler
from django.conf import settings
from django.core.management.base import BaseCommand
from django_apscheduler.jobstores import DjangoJobStore
from app.recommendation import Recommendation

job = Recommendation()


class Command(BaseCommand):
    def handle(self, *args, **options):
        scheduler = BackgroundScheduler(timezone=settings.TIME_ZONE)
        scheduler.add_jobstore(DjangoJobStore(), "default")
        job_id = "recommendation"
        scheduler.add_job(job.result, 'interval', seconds=30, id=job_id, replace_existing=True)

        try:
            scheduler.start()
        except KeyboardInterrupt:
            scheduler.shutdown()
