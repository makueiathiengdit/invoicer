from fastapi import APIRouter
from schemas.user_schema import UserLoginSchema

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login(user: UserLoginSchema):
    pass


@router.get("/logout")
def logout():
    pass
