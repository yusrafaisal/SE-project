# from pydantic import BaseModel
# from typing import Optional


# # ── Menu Models (existing) ────────────────────────────────────────────────────

# class MenuItemCreate(BaseModel):
#     name: str
#     description: str
#     price: float
#     category: str
#     is_available: bool = True
#     image_url: Optional[str] = None

# class MenuItemUpdate(BaseModel):
#     name: Optional[str] = None
#     description: Optional[str] = None
#     price: Optional[float] = None
#     category: Optional[str] = None
#     is_available: Optional[bool] = None
#     image_url: Optional[str] = None


# # ── Auth Models (new) ─────────────────────────────────────────────────────────

# class UserRegister(BaseModel):
#     name: str
#     email: str
#     password: str
#     # role is always 'customer' for self-registration; enforced in the endpoint

# class UserLogin(BaseModel):
#     email: str
#     password: str
#     role: str   # 'customer' | 'admin' | 'rider'

# class UserOut(BaseModel):
#     id: int
#     name: str
#     email: str
#     role: str

# class GoogleLogin(BaseModel):
#     name: str
#     email: str
#     uid: str

import re

from pydantic import BaseModel, field_validator
from typing import Optional, List


# ── Menu Models ───────────────────────────────────────────────────────────────

class MenuItemCreate(BaseModel):
    name: str
    description: str
    price: float
    category: str
    is_available: bool = True
    image_url: Optional[str] = None

class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    is_available: Optional[bool] = None
    image_url: Optional[str] = None



# ── Auth Models ───────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: str
    phone: str
    password: str

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str) -> str:
        email = value.strip().lower()
        if not re.match(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$", email):
            raise ValueError("Enter a valid email address")
        return email

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        phone = re.sub(r"[\s\-().]", "", value.strip())
        if not re.match(r"^(?:03\d{9}|\+923\d{9})$", phone):
            raise ValueError("Phone number must be 03XXXXXXXXX or +923XXXXXXXXX")
        return phone

class UserLogin(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    password: str
    role: str   # 'customer' | 'admin' | 'rider'

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: str

class GoogleLogin(BaseModel):
    name: str
    email: str
    uid: str

class PhoneLookup(BaseModel):
    phone: str

# ── OTP Models ────────────────────────────────────────────────────────────────

class SendOTP(BaseModel):
    email: str

class VerifyOTP(BaseModel):
    email: str
    otp: str

class ResetPasswordOTP(BaseModel):
    email: str
    otp: str
    new_password: str


# ── Order Models ──────────────────────────────────────────────────────────────

class CartItem(BaseModel):
    menu_item_id: int
    quantity: int

class PlaceOrder(BaseModel):
    user_id: int
    cart: List[CartItem]
    delivery_address: str
    payment_method: str
    special_instructions: Optional[str] = None


# ── Check Identifier Model ────────────────────────────────────────────────────

class CheckIdentifier(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    
