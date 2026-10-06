from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from bson import ObjectId

from app.database.connection import get_database
from app.models.ewaste import EWasteCreate, EWasteResponse
from app.services.auth import decode_access_token


router = APIRouter(
    prefix="/api/e-waste",
    tags=["E-Waste"]
)

security = HTTPBearer()


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

        return user_id

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


@router.post(
    "",
    response_model=EWasteResponse,
    status_code=status.HTTP_201_CREATED
)
def create_ewaste(
    item: EWasteCreate,
    user_id: str = Depends(get_current_user_id)
):
    db = get_database()

    new_item = {
        "user_id": user_id,
        "item_type": item.item_type,
        "brand": item.brand,
        "model": item.model,
        "condition": item.condition,
        "quantity": item.quantity,
        "description": item.description,
        "pickup_address": item.pickup_address,
        "status": "pending"
    }

    result = db.ewaste.insert_one(new_item)

    return {
        "id": str(result.inserted_id),
        **new_item
    }


@router.get(
    "/my",
    response_model=list[EWasteResponse]
)
def get_my_ewaste(
    user_id: str = Depends(get_current_user_id)
):
    db = get_database()

    items = db.ewaste.find({
        "user_id": user_id
    })

    return [
        {
            "id": str(item["_id"]),
            "user_id": item["user_id"],
            "item_type": item["item_type"],
            "brand": item.get("brand"),
            "model": item.get("model"),
            "condition": item["condition"],
            "quantity": item["quantity"],
            "description": item.get("description"),
            "pickup_address": item["pickup_address"],
            "status": item["status"]
        }
        for item in items
    ]


@router.get(
    "/{item_id}",
    response_model=EWasteResponse
)
def get_ewaste(
    item_id: str,
    user_id: str = Depends(get_current_user_id)
):
    db = get_database()

    if not ObjectId.is_valid(item_id):
        raise HTTPException(
            status_code=400,
            detail="Invalid e-waste ID"
        )

    item = db.ewaste.find_one({
        "_id": ObjectId(item_id),
        "user_id": user_id
    })

    if not item:
        raise HTTPException(
            status_code=404,
            detail="E-waste submission not found"
        )

    return {
        "id": str(item["_id"]),
        "user_id": item["user_id"],
        "item_type": item["item_type"],
        "brand": item.get("brand"),
        "model": item.get("model"),
        "condition": item["condition"],
        "quantity": item["quantity"],
        "description": item.get("description"),
        "pickup_address": item["pickup_address"],
        "status": item["status"]
    }