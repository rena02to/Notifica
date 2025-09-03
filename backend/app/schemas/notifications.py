from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum
from sqlmodel import SQLModel


class NotificationStatus(str, Enum):
    EM_ANDAMENTO = "Em Andamento"
    VALIDACAO = "Em Validação"
    CONCLUIDO = "Concluído"


class StatusUpdateNotification(str, Enum):
    VALIDACAO = "Em Validação"
    CONCLUIDO = "Concluído"


class NotifiedRead(BaseModel):
    name: str
    email: str
    telephone: str
    address: str


class NotifiedCreate(BaseModel):
    name: str
    email: str
    telephone: str
    address: str


class NotificationCreate(BaseModel):
    title: str
    description: str
    audience: datetime


class NotificationUpdate(SQLModel):
    title: str | None = None
    description: str | None = None
    audience: datetime | None = None
    status: StatusUpdateNotification | None = None


class NotificationRead(BaseModel):
    id: int
    title: str
    description: str
    audience: datetime
    status: NotificationStatus
    notified: Optional[NotifiedRead] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
