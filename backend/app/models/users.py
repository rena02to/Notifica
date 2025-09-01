from typing import List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
import pytz


SP_TZ = pytz.timezone("America/Sao_Paulo")


class UserRole(SQLModel, table=True):
    __tablename__ = "user_roles"

    user_id: int = Field(foreign_key="users.id", primary_key=True)
    role_id: int = Field(foreign_key="roles.id", primary_key=True)


class Role(SQLModel, table=True):
    __tablename__ = "roles"

    id: int = Field(primary_key=True)
    name: str = Field(max_length=155)
    users: List["User"] = Relationship(back_populates="roles", link_model=UserRole)


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: int = Field(primary_key=True)
    name: str = Field(max_length=255)
    email: str = Field(max_length=255)
    password: str = Field(
        max_length=255,
    )
    active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(SP_TZ))
    last_login: datetime | None = Field(default=None, nullable=True)
    roles: List[Role] = Relationship(back_populates="users", link_model=UserRole)
