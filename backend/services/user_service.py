from schemas.user_schema import UserSchema
from db.core import get_session
from db.models import User
from utils.api_response import APIResponse
from constants.constants import USER_ROLES
from services.hash_service import HashService


class UserService:
    @classmethod
    def create_user(cls, user: UserSchema) -> APIResponse:
        with get_session() as db:
            response = APIResponse()
            try:
                user = user.dict()
                user["password"] = HashService.hash(user["password"])
                db_user = User(**user)
                db.add(db_user)
                db.commit()
                if db_user:
                    response.success = True
                    response.message = "user created successfully"
                    response.data = [db_user]
                else:
                    response.message = "failed to create user"
                return response
            except Exception as e:
                response.message = str(e)
                return response

    @classmethod
    def update_user(cls, id, user) -> APIResponse:
        pass

    @classmethod
    def get_user_by_id(cls, id) -> APIResponse:
        with get_session() as db:
            user = db.query(User).filter_by(id=id).first()
            response = APIResponse()
            if user:
                response.message = "fetched user"
                response.data = [user.to_dict()]
            else:
                response.message = "cannot find user with given id"
            return response

    @classmethod
    def get_user_all(cls) -> APIResponse:
        with get_session() as db:
            users = db.query(User).all()

            response = APIResponse()

            if users:
                response.success = True
                response.message = "found users"
                response.data = users
            else:
                response.message = "could not find users"

            return response

    @classmethod
    def make_proccessor(cls, id: int) -> APIResponse:
        with get_session() as db:
            db_user = db.query(User).filter_by(id=id).first()

            if db_user is None:
                return APIResponse(
                    success=False, message="cannot find user with givven id"
                )

            else:
                db_user.role = USER_ROLES["PROCCESSOR"]
                db.add(db_user)
                db.flush()
                db.commit()

                return APIResponse(
                    success=True, message="user marked as invocie proccessor"
                )

    @classmethod
    def get_user_by_email(cls, email: str) -> APIResponse:
        with get_session() as db:
            user = db.query(User).filter_by(email=email).first()
            if user is None:
                return APIResponse(success=False, message="user not found", data=[])
            return APIResponse(success=True, message="user found", data=[user])
