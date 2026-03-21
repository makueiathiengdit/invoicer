from fastapi import APIRouter, Response
from schemas.user_schema import UserLoginSchema
from services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/login")
def login(user: UserLoginSchema):
    return AuthService.login(user)


@router.post("/logout")
def logout():
    return {"message": "Logged out successfully"}
