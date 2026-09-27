from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """Wraps DRF's default handler so every error has a consistent shape
    and unexpected 500s don't leak tracebacks to the client in production."""
    response = exception_handler(exc, context)

    if response is not None:
        return response

    logger.error(f'Unhandled exception: {exc}', exc_info=exc)
    detail_msg = str(exc) if settings.DEBUG else 'Something went wrong processing your request. Please try again.'

    return Response(
        {'detail': detail_msg},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
