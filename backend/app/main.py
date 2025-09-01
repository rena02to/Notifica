from fastapi import FastAPI
from app.routers import notifications

app = FastAPI(title="Notificação Judicial")

app.include_router(notifications.router, prefix="/api/notifications")


@app.get("/ping")
def ping():
    return {"status": "ok"}
