from pydantic import BaseModel, Base64Bytes, ConfigDict


class AttachmentBase(BaseModel):
    name: str
    size: int
    model_config = ConfigDict(from_attributes=True)


class AttachmentRead(AttachmentBase):
    """Used in Invoice lists: Metadata only."""

    id: int


class AttachmentFull(AttachmentRead):
    """Used in Detailed view: Includes the file data."""

    file: Base64Bytes
