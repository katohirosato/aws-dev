# https://docs.aws.amazon.com/lambda/latest/dg/python-image.html#python-image-instructions

FROM public.ecr.aws/lambda/python:3.14

COPY . ${LAMBDA_TASK_ROOT}/.

RUN pip install -r requirements.txt

CMD [ "app.on_event_handler" ]
CMD [ "app.is_complete_handler" ]