from pydantic import BaseModel
from typing import List, Optional


class RoleCreate(BaseModel):
    name: str


class RoleRead(BaseModel):
    id: int
    name: str


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role_ids: Optional[List[int]] = []


class UserRead(BaseModel):
    id: int
    name: str
    email: str
    roles: List[RoleRead] = []
