from pydantic import BaseModel, Field


class EWasteCreate(BaseModel):
    item_type: str = Field(..., min_length=2, max_length=100)
    brand: str | None = Field(default=None, max_length=100)
    model: str | None = Field(default=None, max_length=100)
    condition: str = Field(..., min_length=2, max_length=50)
    quantity: int = Field(default=1, ge=1)
    description: str | None = Field(default=None, max_length=500)
    pickup_address: str = Field(..., min_length=10, max_length=500)


class EWasteResponse(BaseModel):
    id: str
    user_id: str
    item_type: str
    brand: str | None
    model: str | None
    condition: str
    quantity: int
    description: str | None
    pickup_address: str
    status: str