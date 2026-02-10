from schemas.user_schema import UserSchema
from db.core import get_session
from db.models import User
from utils.api_response import APIResponse


class UserService:
    @classmethod
    def create_user(cls, user: UserSchema) -> APIResponse:
        with get_session() as db:
            response = APIResponse()
            try:
                db_user = User(**user.dict())
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
        pass

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
