from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class HashService:
    @classmethod
    def hash(cls, password: str) -> str:
        return pwd_context.hash(password)

    @classmethod
    def verify(cls, password: str, hashed_password: str) -> bool:
        return pwd_context.verify(password, hashed_password)
