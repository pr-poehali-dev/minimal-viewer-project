import json
import os
import base64
import uuid
import boto3

def handler(event: dict, context) -> dict:
    """Загружает файл (base64) в S3 и возвращает публичный URL."""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    }
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    body = json.loads(event.get('body') or '{}')
    file_data = body.get('file')
    content_type = body.get('content_type', 'image/jpeg')
    ext = content_type.split('/')[-1].replace('jpeg', 'jpg')
    key = f"gallery/{uuid.uuid4()}.{ext}"

    file_bytes = base64.b64decode(file_data)

    s3 = boto3.client(
        's3',
        endpoint_url='https://bucket.poehali.dev',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
    )
    s3.put_object(Bucket='files', Key=key, Body=file_bytes, ContentType=content_type)

    url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/files/{key}"
    return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'url': url})}
