from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import Union


from db.core import Base, db_engine
from routers.user_router import router as user_router
from routers.invoices_router import router as invoice_router
from routers.attachment_router import router as attachment_router
from routers.received_invoice_router import router as received_invoice_router


class EntityException(Exception):
    def __init__(self, code: int, message: str, exception: str):
        self.code = code
        self.message = message
        self.exception = exception


from starlette.middleware.cors import CORSMiddleware


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


# CORS middleware
allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def exception_handler(
    request: Request, exception: Union[Exception, RuntimeError]
):
    headers = {
        "Access-Control-Allow-Origin": ", ".join(allowed_origins),
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    }
    if isinstance(exception, EntityException):
        response = JSONResponse(
            jsonable_encoder(
                {
                    "code": exception.code,
                    "message": exception.message,
                    "exception": exception.exception,
                }
            ),
            headers=headers,
        )
    else:
        response = JSONResponse(
            jsonable_encoder(
                {
                    "exception": str(exception),
                    "code": 500,
                }
            ),
            headers=headers,
        )
    return response


app.include_router(user_router)
app.include_router(invoice_router)
app.include_router(attachment_router)
app.include_router(received_invoice_router)


@app.get("/")
def home():
    return {"status": "ok"}
