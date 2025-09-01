from datetime import datetime
from zoneinfo import ZoneInfo
from fastapi import HTTPException
from ..schemas.notifications import NotificationCreate, NotifiedCreate
import re


SP_TZ = ZoneInfo("America/Sao_Paulo")


def validate_notification(notification: NotificationCreate):
    audience = notification.audience

    if not isinstance(audience, datetime):
        raise HTTPException(status_code=400, detail="Data inválida.")

    if audience.tzinfo is None:
        audience = audience.replace(tzinfo=SP_TZ)

    if audience < datetime.now(SP_TZ):
        raise HTTPException(
            status_code=400, detail="A data da audiência não pode ser no passado."
        )

    return notification.model_copy(update={"audience": audience})


def validate_notified(notified: NotifiedCreate):
    name = notified.name
    email = notified.email
    telephone = notified.telephone
    email_format = r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9._%+-]+\.[a-zA-Z]"
    telephone_format = r"^\(\d{2}\)\s?9?\s?\d{4,5}-\d{4}$"

    if len(name.split()) < 2:
        raise HTTPException(
            status_code=400,
            detail="Deve ser fornecido ao menos nome e sobrenome do notificado.",
        )

    if not re.match(email_format, email):
        raise HTTPException(status_code=400, detail="E-mail inválido.")

    if not re.match(telephone_format, telephone):
        raise HTTPException(
            status_code=400, detail="Número de telefone em formato inválido."
        )

    name = name.title()
    return notified.model_copy(update={"name": name})
