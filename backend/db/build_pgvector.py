import os
import logging
import psycopg2
import json
from pathlib import Path
import pgvector.psycopg2

BASE_DIR = Path(__file__).resolve(strict=True).parent.parent
CURRENT_DIR = f"{BASE_DIR}/db"

logger = logging.getLogger("pgvector")
logger.setLevel(logging.INFO)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)
formatter = logging.Formatter('✔️ %(levelname)s:%(name)s: %(message)s')
console_handler.setFormatter(formatter)
logger.addHandler(console_handler)

logger.info("Start creating embeddings table.")

POSTGRES_DB = os.getenv("POSTGRES_DB")
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_HOST = os.getenv("POSTGRES_HOST")
POSTGRES_PORT = os.getenv("POSTGRES_PORT")

# Connection to database
try:
    conn = psycopg2.connect(
        dbname=POSTGRES_DB,
        user=POSTGRES_USER,
        password=POSTGRES_PASSWORD,
        host=POSTGRES_HOST,
        port=POSTGRES_PORT
    )
    cur = conn.cursor()
except Exception as e:
    raise RuntimeError(f"Failed to connect to database: {e}")

# Adding vector extension
try:
    cur.execute("CREATE EXTENSION IF NOT EXISTS vector;")
    conn.commit()
    logger.info("Extension vector added successfully.")
except Exception as e:
    raise RuntimeError(f"Failed to add vector extension: {e}")

pgvector.psycopg2.register_vector(conn)

# # Adding uuid-ossp extension
try:
    cur.execute("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";")
    conn.commit()
    logger.info("Extension uuid-ossp added successfully.")
except Exception as e:
    raise RuntimeError(f"Failed to add uuid-ossp extension: {e}")

# Create the "embeddings" table with vector column
try:
    cur.execute(f"""
    CREATE TABLE IF NOT EXISTS embeddings (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        content TEXT,
        metadata JSONB,
        embedding VECTOR(1536) --1536 is length of text-embedding-3-small vector
    );
    """)
    conn.commit()
    logger.info("Table 'embeddings' created successfully.")
except Exception as e:
    raise RuntimeError(f"Failed to create table: {e}")

# Load data
try:
    with open(f"{CURRENT_DIR}/examples/example_embeddings.json", "r", encoding="utf-8-sig") as f:
        documents = json.load(f)["documents"]

    contents = [doc["content"] for doc in documents]
    metadatas = [doc["metadata"] for doc in documents]
    embeddings = [doc["embedding"] for doc in documents]
except Exception as e:
    raise RuntimeError(f"Failed to load data: {e}")

# Insert data to database
insert_query = """
    INSERT INTO embeddings (content, metadata, embedding)
    VALUES (%s, %s, %s);
"""

try:
    for i, (content, metadata, embedding) in enumerate(zip(contents, metadatas, embeddings)):
        cur.execute(insert_query, (content, json.dumps(metadata), embedding))
    conn.commit()
    logger.info("Data inserted to table successfully.")
except Exception as e:
    raise RuntimeError(f"Failed to insert embeddings to table: {e}")

# Close connection with database
cur.close()
conn.close()

logger.info("Embeddings table created and data inserted successfully.")
