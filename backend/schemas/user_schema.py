from pydantic import BaseModel


class UserSchema(BaseModel):
    first_name: str
    last_name: str
    email: str
    password: str
    role: str | None = "USER"


class UserLoginSchema(BaseModel):
    email: str
    password: str
