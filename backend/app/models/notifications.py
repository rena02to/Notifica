from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from enum import Enum
from typing import List, Optional
from pytz import timezone
from sqlalchemy import TIMESTAMP


SP_TZ = timezone("America/Sao_Paulo")


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
    created_at: datetime = Field(default_factory=lambda: datetime.now(SP_TZ))
    updated_at: Optional[datetime] = Field(
        default=None,
        sa_column_kwargs={"onupdate": lambda: datetime.now(SP_TZ)},
        nullable=True,
    )
