from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """Wraps DRF's default handler so every error has a consistent shape
    and unexpected 500s don't leak tracebacks to the client."""
    response = exception_handler(exc, context)

    if response is not None:
        return response

    return Response(
        {'detail': 'Something went wrong processing your request. Please try again.'},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
