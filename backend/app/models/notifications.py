from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional
import pytz
from sqlalchemy import TIMESTAMP


SP_TZ = pytz.timezone("America/Sao_Paulo")


class NotificationStatus(str, Enum):
    EM_ANDAMENTO = "Em Andamento"
    VALIDACAO = "Em Validação"
    CONCLUIDO = "Concluído"


class Notified(SQLModel, table=True):
    __tablename__ = "notified"

    id: int = Field(primary_key=True)
    name: str = Field(max_length=255)
    email: str = Field(max_length=255)
    telephone: str = Field(max_length=16)
    address: str = Field(max_length=255)

    notifications: List["Notification"] = Relationship(back_populates="notified")


class Notification(SQLModel, table=True):
    __tablename__ = "notification"

    id: int = Field(primary_key=True)
    title: str = Field(max_length=155)
    description: str = Field(max_length=500)
    audience: datetime = Field(sa_type=TIMESTAMP(timezone=True))
    notified_id: Optional[int] = Field(
        default=None, foreign_key="notified.id", nullable=True
    )
    notified: Optional[Notified] = Relationship(back_populates="notifications")
    status: NotificationStatus = Field(
        default=NotificationStatus.VALIDACAO.value,
    )
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(SP_TZ), nullable=False
    )
    updated_at: datetime | None = Field(
        default_factory=lambda: datetime.now(SP_TZ), nullable=False
    )
