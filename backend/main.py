from fastapi import FastAPI
from contextlib import asynccontextmanager

from db.core import Base, db_engine
from routes.user_router import router as user_router
from routes.invoices_router import router as invoice_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        print("Creating db tables...")
        Base.metadata.create_all(bind=db_engine)
        yield
        print("App is shuting down...")
    except:
        pass


app = FastAPI(title="Invoice Recorder", lifespan=lifespan)

app.include_router(user_router)
app.include_router(invoice_router)


@app.get("/")
def home():
    return {"status": "ok"}
