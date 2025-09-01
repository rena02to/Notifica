import os
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException, status, Depends, Cookie
from sqlmodel import Session
from ..database import get_session
from ..models.users import User
from passlib.hash import bcrypt

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7


def hash_password(password: str):
    return bcrypt.hash(password)


def verify_password(plain_password, hashed_password):
    return bcrypt.verify(plain_password, hashed_password)


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + (timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now() + (timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    response: Response,
    access_token: str = Cookie(None),
    refresh_token: str = Cookie(None),
    session: Session = Depends(get_session),
):
    user = None

    if access_token:
        try:
            payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = int(payload.get("sub"))
            user = session.get(User, user_id)
            if user:
                return user
        except JWTError:
            pass  # token expirado ou inválido, tentaremos refresh

    # Tenta usar refresh token
    if refresh_token:
        try:
            payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
            user_id = int(payload.get("sub"))
            user = session.get(User, user_id)
            if not user:
                raise HTTPException(status_code=401, detail="Usuário não encontrado")

            # Cria novo access token
            new_access_token = create_access_token({"sub": str(user.id)})
            response.set_cookie(
                "access_token",
                new_access_token,
                httponly=True,
                max_age=3600,
                samesite="lax",
            )
            return user
        except JWTError:
            raise HTTPException(
                status_code=401, detail="Refresh token inválido ou expirado"
            )

    raise HTTPException(status_code=401, detail="Token de acesso não fornecido")
