import json
import time
import logging
from . import create
from . import delete
from . import update

logger = logging.getLogger()
logger.setLevel("INFO")

def on_event_handler(event, context):
    if event["RequestType"] == "Create":
        response = create.on_event_handler(event, context)
    elif event["RequestType"] == "Update":
        response = update.on_event_handler(event, context)
    elif event["RequestType"] == "Delete":
        response = delete.on_event_handler(event, context)
    return response

def is_complete_handler(event, context):
    if event["RequestType"] == "Create":
        response = create.is_complete_handler(event, context)
    elif event["RequestType"] == "Update":
        response = update.is_complete_handler(event, context)
    elif event["RequestType"] == "Delete":
        response = delete.is_complete_handler(event, context)
    return response
