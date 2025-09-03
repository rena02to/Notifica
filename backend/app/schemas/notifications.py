from pydantic import BaseModel, field_serializer, computed_field
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
    id: int
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


class NotificationRead(BaseModel):
    id: int
    title: str
    description: str
    audience: datetime
    status: NotificationStatus
    notified: Optional[NotifiedRead] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    @field_serializer("audience", "created_at", "updated_at", when_used="json")
    def format_datetime(self, value: Optional[datetime]) -> Optional[str]:
        if value is None:
            return None
        return value.strftime("%d/%m/%Y às %H:%M")

    @computed_field
    @property
    def audience_date(self) -> Optional[str]:
        if self.audience:
            return self.audience.strftime("%Y-%m-%d")
        return None

    @computed_field
    @property
    def audience_time(self) -> Optional[str]:
        if self.audience:
            return self.audience.strftime("%H:%M")
        return None
