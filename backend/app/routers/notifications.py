from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from sqlalchemy.orm import joinedload
from ..models.notifications import Notification, Notified
from ..schemas.notifications import (
    NotificationRead,
    NotificationCreate,
    NotificationUpdate,
    NotifiedCreate,
)
from ..utils.validators import validate_notification, validate_notified
from ..database import get_session
from typing import List


router = APIRouter()


@router.post("/", status_code=201)
def create_notification(
    notification: NotificationCreate, session: Session = Depends(get_session)
):
    notification = validate_notification(notification)
    data = notification.model_dump()
    new_notfication = Notification(**data)
    session.add(new_notfication)
    session.commit()
    session.refresh(new_notfication)
    return {"detail": "Notificação criada com sucesso!"}


@router.get("/", response_model=List[NotificationRead])
def get_notification(session: Session = Depends(get_session)):
    notifications = session.exec(
        select(Notification).options(joinedload(Notification.notified))
    ).all()
    return notifications


@router.patch("/{notification_id}/")
def update_notification(
    notification_id: int,
    notified: NotifiedCreate,
    session: Session = Depends(get_session),
):
    notification = session.get(Notification, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")

    notified = validate_notified(notified)

    data = notified.model_dump()
    new_notified = Notified(**data)
    session.add(new_notified)

    notification.notified = new_notified
    session.add(notification)
    session.commit()
    session.refresh(notification)
    return {"detail": "Dados do notificado inseridos com sucesso na notificação."}


@router.delete("/{notification_id}/")
def delete_notification(notification_id: int, session: Session = Depends(get_session)):
    notification = session.get(Notification, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")

    session.delete(notification)
    session.commit()
    return {"detail": "Notificação deletada com sucesso!"}


@router.delete("/{notification_id}/notified/")
def delete_notified(notification_id: int, session: Session = Depends(get_session)):
    notification = session.get(Notification, notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notificação não encontrada")

    notification.notified = None
    session.add(notification)
    session.commit()
    session.refresh(notification)
    return {"detail": "Notificado removido da notificação"}
