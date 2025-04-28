from django.db import models
from pgvector.django import VectorField
import uuid


class Embeddings(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    content = models.TextField(null=True, blank=True)
    metadata = models.JSONField(null=True, blank=True)
    embedding = VectorField(dimensions=1536)

    def __str__(self):
        return f"Embedding {self.id}: {self.content[:40]}"

    class Meta:
        managed = False
        db_table = 'embeddings'
