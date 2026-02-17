from fastapi import APIRouter
from schemas.user_schema import UserSchema
from services.user_service import UserService

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/")
def get_users():
    return UserService.get_user_all()


@router.get("/{id}")
def get_user_by_id(id: int):
    return UserService.get_user_by_id(id)


@router.post("/")
def create_user(user: UserSchema):
    return UserService.create_user(user)
