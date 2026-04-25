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

from pydantic import BaseModel
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
    
