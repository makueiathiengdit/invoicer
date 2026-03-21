import jwt
from datetime import datetime, timedelta
from services.user_service import UserService
from services.hash_service import HashService
from utils.api_response import APIResponse
from schemas.user_schema import UserLoginSchema, UserSchema
import os
from dotenv import load_dotenv


load_dotenv()

JWT_SECRET = os.environ.get("JWT_SECRET")
ALGORITHM = "HS256"


class AuthService:
    @classmethod
    def login(cls, login_data: UserLoginSchema) -> APIResponse:
        # get use from db
        res = UserService.get_user_by_email(login_data.email)
        user: UserSchema = None
        if res.success:
            user = res.data[0]
        if not user:
            return APIResponse(
                success=False, message="user does not exist", status_code=401
            )

        # verify password
        if not HashService.verify(login_data.password, user.password):
            return APIResponse.error("Invalid credentials", status_code=401)

        # create jwt token
        payload = {
            "sub": user.email,
            "role": user.role,
            "exp": datetime.utcnow() + timedelta(hours=24),
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=ALGORITHM)

        payload = {"token": token, "user": {"email": user.email, "role": user.role}}
        return APIResponse(success=True, message="login successful", data=[payload])
