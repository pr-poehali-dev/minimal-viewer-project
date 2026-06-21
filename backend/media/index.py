import json
import os
import psycopg2

SCHEMA = os.environ['MAIN_DB_SCHEMA']

def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: dict, context) -> dict:
    """REST API для медиа галереи: список, создание, обновление, скрытие, лайки и комментарии."""
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    }
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': headers, 'body': ''}

    method = event.get('httpMethod', 'GET')
    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == 'GET':
            cur.execute(f"""
                SELECT m.id, m.type, m.url, m.title, m.category, m.muted, m.likes,
                       COALESCE(
                         json_agg(json_build_object('id', c.id, 'author', c.author, 'text', c.text)
                                  ORDER BY c.created_at)
                         FILTER (WHERE c.id IS NOT NULL), '[]'
                       ) AS comments
                FROM {SCHEMA}.media m
                LEFT JOIN {SCHEMA}.comments c ON c.media_id = m.id
                WHERE m.hidden = FALSE
                GROUP BY m.id
                ORDER BY m.created_at DESC
            """)
            rows = cur.fetchall()
            result = [
                {
                    'id': str(r[0]), 'type': r[1], 'url': r[2], 'title': r[3],
                    'category': r[4], 'muted': bool(r[5]), 'likes': r[6],
                    'comments': r[7] if r[7] else [],
                }
                for r in rows
            ]
            return {'statusCode': 200, 'headers': headers, 'body': json.dumps(result, ensure_ascii=False)}

        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            action = body.get('action', 'create')

            if action == 'create':
                cur.execute(
                    f"INSERT INTO {SCHEMA}.media (type, url, title, category, muted) VALUES (%s,%s,%s,%s,%s) RETURNING id",
                    (body['type'], body['url'], body['title'], body['category'], body.get('muted', True))
                )
                new_id = cur.fetchone()[0]
                conn.commit()
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'id': str(new_id)})}

            if action == 'update':
                cur.execute(
                    f"UPDATE {SCHEMA}.media SET title=%s, category=%s, muted=%s WHERE id=%s",
                    (body['title'], body['category'], body.get('muted', True), int(body['id']))
                )
                conn.commit()
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

            if action == 'hide':
                cur.execute(
                    f"UPDATE {SCHEMA}.media SET hidden=TRUE WHERE id=%s",
                    (int(body['id']),)
                )
                conn.commit()
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'ok': True})}

            if action == 'comment':
                cur.execute(
                    f"INSERT INTO {SCHEMA}.comments (media_id, author, text) VALUES (%s,%s,%s) RETURNING id",
                    (int(body['media_id']), body.get('author', 'Гость'), body['text'])
                )
                comment_id = cur.fetchone()[0]
                conn.commit()
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'id': str(comment_id)})}

            if action == 'like':
                media_id = int(body['media_id'])
                session_id = body.get('session_id', 'anon')
                cur.execute(
                    f"SELECT id FROM {SCHEMA}.likes WHERE media_id=%s AND session_id=%s",
                    (media_id, session_id)
                )
                existing = cur.fetchone()
                if existing:
                    cur.execute(
                        f"UPDATE {SCHEMA}.media SET likes = GREATEST(0, likes - 1) WHERE id=%s RETURNING likes",
                        (media_id,)
                    )
                    new_likes = cur.fetchone()[0]
                    cur.execute(f"UPDATE {SCHEMA}.likes SET session_id='' WHERE id=%s", (existing[0],))
                    liked = False
                else:
                    cur.execute(
                        f"INSERT INTO {SCHEMA}.likes (media_id, session_id) VALUES (%s,%s)",
                        (media_id, session_id)
                    )
                    cur.execute(
                        f"UPDATE {SCHEMA}.media SET likes = likes + 1 WHERE id=%s RETURNING likes",
                        (media_id,)
                    )
                    new_likes = cur.fetchone()[0]
                    liked = True
                conn.commit()
                return {'statusCode': 200, 'headers': headers, 'body': json.dumps({'likes': new_likes, 'liked': liked})}

    finally:
        cur.close()
        conn.close()

    return {'statusCode': 405, 'headers': headers, 'body': json.dumps({'error': 'Method not allowed'})}
