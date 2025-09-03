from fastapi import FastAPI
from app.routers import notifications
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Notificação Judicial")


origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    # você pode adicionar o domínio real quando for para produção
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(notifications.router, prefix="/api/notifications")


@app.get("/ping")
def ping():
    return {"status": "ok"}
