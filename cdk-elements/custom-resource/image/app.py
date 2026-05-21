import json
import time
import logging
from . import create
from . import delete
from . import update

logger = logging.getLogger()
logger.setLevel("INFO")

def handler(event, context):
    if event["RequestType"] == "Create":
        response = create.handler(event, context)
    elif event["RequestType"] == "Update":
        response = update.handler(event, context)
    elif event["RequestType"] == "Delete":
        response = delete.handler(event, context)
    return response
