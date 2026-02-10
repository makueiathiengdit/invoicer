class APIResponse:
    def __init__(
        self,
        success: bool = False,
        message: str | None = "",
        data: list | None = None,
        status_code: int = 200,
    ):
        self.success = success
        self.message = message
        self.data = data
        self.status_code = status_code

    def to_dict(self) -> dict:
        return {
            "succes": self.success,
            "message": self.message,
            "data": self.data,
            "status_code": self.status_code,
        }
