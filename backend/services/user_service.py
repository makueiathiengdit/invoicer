from schemas.user_schema import UserSchema
from db.core import get_session
from db.models import User


class UserService:
    @classmethod
    def create_user(cls, user:UserSchema):
        with get_session() as db:
            db_user = User(**user.dict())
            db.add(db_user)
            db.commit()
            return db_user
    
    
    @classmethod
    def update_user(cls, id, user):
        pass
    
    @classmethod
    def get_user_by_id(cls, id):
        pass
    
    @classmethod
    def get_user_all(cls):
        with get_session() as db:
            users = db.query(User).all()
            return users or []