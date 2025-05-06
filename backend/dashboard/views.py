from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


@api_view(['GET'])
def example_plot(request):
    return Response({"details": "This plot is not implemented yet."}, status=status.HTTP_501_NOT_IMPLEMENTED)
