# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from database import get_connection
# from models import MenuItemCreate, MenuItemUpdate, UserRegister, UserLogin, GoogleLogin
# import bcrypt

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# # ══════════════════════════════════════════════════════
# #  AUTH ENDPOINTS
# # ══════════════════════════════════════════════════════

# @app.post("/auth/register")
# def register(user: UserRegister):
#     """
#     Only customers can self-register.
#     Admin and rider accounts must be pre-seeded in the database.
#     """
#     conn = get_connection()
#     cursor = conn.cursor(dictionary=True)

#     # Check if email already exists
#     cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
#     if cursor.fetchone():
#         conn.close()
#         raise HTTPException(status_code=409, detail="Email already registered")

#     # Hash password
#     password_hash = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()

#     # Insert as customer (role is always 'customer' for self-registration)
#     cursor.execute(
#         "INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, 'customer')",
#         (user.name, user.email, password_hash)
#     )
#     conn.commit()
#     new_id = cursor.lastrowid
#     conn.close()

#     return {
#         "message": "Account created successfully",
#         "user": {"id": new_id, "name": user.name, "email": user.email, "role": "customer"}
#     }


# @app.post("/auth/login")
# def login(credentials: UserLogin):
#     conn = get_connection()
#     cursor = conn.cursor(dictionary=True)

#     cursor.execute(
#         "SELECT * FROM users WHERE email = %s AND role = %s",
#         (credentials.email, credentials.role)
#     )
#     user = cursor.fetchone()
#     conn.close()

#     if not user:
#         raise HTTPException(status_code=401, detail="Invalid email or password")

#     # If Firebase already verified the password (customer login), skip bcrypt check
#     if credentials.password != '__firebase_verified__':
#         if not bcrypt.checkpw(credentials.password.encode(), user["password_hash"].encode()):
#             raise HTTPException(status_code=401, detail="Invalid email or password")

#     return {
#         "message": "Login successful",
#         "user": {
#             "id": user["id"],
#             "name": user["name"],
#             "email": user["email"],
#             "role": user["role"]
#         }
#     }

# @app.post("/auth/reset-password")
# def reset_password(data: dict):
#     email = data.get("email")
#     new_password = data.get("new_password")

#     if not email or not new_password:
#         raise HTTPException(status_code=400, detail="Email and new password are required")

#     conn = get_connection()
#     cursor = conn.cursor(dictionary=True)

#     cursor.execute("SELECT * FROM users WHERE email = %s AND role IN ('admin', 'rider')", (email,))
#     user = cursor.fetchone()

#     if not user:
#         conn.close()
#         return {"message": "ok"}  # silently ignore if customer — Firebase handled it

#     new_hash = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
#     cursor.execute(
#         "UPDATE users SET password_hash = %s WHERE email = %s AND role IN ('admin', 'rider')",
#         (new_hash, email)
#     )
#     conn.commit()
#     conn.close()

#     return {"message": "Password updated"}

# @app.post("/auth/google-login")
# def google_login(user: GoogleLogin):
#     """
#     Called after Firebase Google sign-in succeeds on the frontend.
#     - If the email already exists in our DB → log them in (return their record).
#     - If new → auto-create a customer account (no password needed for Google users).
#     Google users are always customers. Admin/rider accounts use email+password only.
#     """
#     conn = get_connection()
#     cursor = conn.cursor(dictionary=True)

#     # Check if user already exists
#     cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
#     existing = cursor.fetchone()

#     if existing:
#         # Already registered — just return their info
#         conn.close()
#         return {
#             "message": "Login successful",
#             "user": {
#                 "id":    existing["id"],
#                 "name":  existing["name"],
#                 "email": existing["email"],
#                 "role":  existing["role"],
#             }
#         }

#     # New Google user — auto-register as customer
#     # We store a placeholder password_hash since they'll always use Google to log in
#     cursor.execute(
#         "INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, 'customer')",
#         (user.name, user.email, f"google_uid:{user.uid}")
#     )
#     conn.commit()
#     new_id = cursor.lastrowid
#     conn.close()

#     return {
#         "message": "Account created via Google",
#         "user": {
#             "id":    new_id,
#             "name":  user.name,
#             "email": user.email,
#             "role":  "customer",
#         }
#     }


# # ═════════════════════
# #  MENU ENDPOINTS 
# # ═════════════════════

# @app.get("/menu")
# def get_menu():
#     conn = get_connection()
#     cursor = conn.cursor(dictionary=True)
#     cursor.execute("SELECT * FROM menu_items")
#     items = cursor.fetchall()
#     conn.close()
#     return items


# @app.post("/menu")
# def add_menu_item(item: MenuItemCreate):
#     conn = get_connection()
#     cursor = conn.cursor()
#     query = """INSERT INTO menu_items (name, description, price, category, is_available, image_url)
#                VALUES (%s, %s, %s, %s, %s, %s)"""
#     cursor.execute(query, (item.name, item.description, item.price, item.category, item.is_available, item.image_url))
#     conn.commit()
#     new_id = cursor.lastrowid
#     conn.close()
#     return {"message": "Menu item added successfully", "id": new_id}


# @app.put("/menu/{item_id}")
# def update_menu_item(item_id: int, item: MenuItemUpdate):
#     conn = get_connection()
#     cursor = conn.cursor()

#     fields = []
#     values = []

#     if item.name is not None:
#         fields.append("name = %s"); values.append(item.name)
#     if item.description is not None:
#         fields.append("description = %s"); values.append(item.description)
#     if item.price is not None:
#         fields.append("price = %s"); values.append(item.price)
#     if item.category is not None:
#         fields.append("category = %s"); values.append(item.category)
#     if item.is_available is not None:
#         fields.append("is_available = %s"); values.append(item.is_available)
#     if item.image_url is not None:
#         fields.append("image_url = %s"); values.append(item.image_url)

#     if not fields:
#         conn.close()
#         raise HTTPException(status_code=400, detail="No fields to update")

#     values.append(item_id)
#     query = f"UPDATE menu_items SET {', '.join(fields)} WHERE id = %s"

#     try:
#         cursor.execute(query, values)
#         conn.commit()
#         if cursor.rowcount == 0:
#             raise HTTPException(status_code=404, detail="Item not found")
#     except Exception as e:
#         conn.rollback()
#         raise HTTPException(status_code=500, detail=str(e))
#     finally:
#         conn.close()

#     return {"message": "Menu item updated successfully"}


# @app.delete("/menu/{item_id}")
# def delete_menu_item(item_id: int):
#     conn = get_connection()
#     cursor = conn.cursor()
#     cursor.execute("DELETE FROM menu_items WHERE id = %s", (item_id,))
#     conn.commit()
#     if cursor.rowcount == 0:
#         raise HTTPException(status_code=404, detail="Item not found")
#     conn.close()
#     return {"message": "Menu item deleted successfully"}

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import get_connection
from models import (
    MenuItemCreate, MenuItemUpdate,
    UserRegister, UserLogin, GoogleLogin,
    PlaceOrder, CheckIdentifier, SendOTP, VerifyOTP, ResetPasswordOTP, PhoneLookup
)
import bcrypt
import random
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

if not firebase_admin._apps:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)

GMAIL_USER = "saveur999@gmail.com"
GMAIL_APP_PASS = "tpqclbfuerhulrsv"

otp_store: dict = {}


def send_otp_email(to_email: str, otp: str):
        msg = MIMEMultipart("alternative")
        msg["Subject"] = "Your Saveur Password Reset Code"
        msg["From"] = GMAIL_USER
        msg["To"] = to_email

        html = f"""
        <div style="font-family: Georgia, serif; max-width: 420px; margin: 0 auto; padding: 32px; background: #faf9f7; border-radius: 16px;">
            <h2 style="color: #2b2b2b; font-size: 22px; margin-bottom: 8px;">Password Reset</h2>
            <p style="color: #777; font-size: 14px; margin-bottom: 24px;">
                Use the code below to reset your Saveur password. It expires in <strong>10 minutes</strong>.
            </p>
            <div style="background: #fff; border: 1px dashed #e0dbd4; border-radius: 12px; padding: 24px; text-align: center;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #2b2b2b;">{otp}</span>
            </div>
            <p style="color: #aaa; font-size: 12px; margin-top: 24px;">
                If you didn't request this, you can safely ignore this email.
            </p>
        </div>
        """

        msg.attach(MIMEText(html, "html"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(GMAIL_USER, GMAIL_APP_PASS)
                server.sendmail(GMAIL_USER, to_email, msg.as_string())


# ══════════════════════════════════════════════════════
#  AUTH ENDPOINTS
# ══════════════════════════════════════════════════════

@app.post("/auth/register")
def register(user: UserRegister):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=409, detail="Email already registered")
    cursor.execute("SELECT id FROM users WHERE phone = %s", (user.phone,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=409, detail="Phone number already registered")
    password_hash = bcrypt.hashpw(user.password.encode(), bcrypt.gensalt()).decode()
    cursor.execute(
        "INSERT INTO users (name, email, phone, password_hash, role) VALUES (%s, %s, %s, %s, 'customer')",
        (user.name, user.email, user.phone, password_hash)
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    try:
        firebase_auth.create_user(
            email=user.email,
            password=user.password,
            display_name=user.name,
        )
    except firebase_auth.EmailAlreadyExistsError:
        pass
    except Exception:
        pass

    return {
        "message": "Account created successfully",
        "user": {
            "id": new_id,
            "name": user.name,
            "email": user.email,
            "role": "customer"
        }
    }


@app.post("/auth/login")
def login(credentials: UserLogin):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    if credentials.email:
        cursor.execute(
            "SELECT * FROM users WHERE email = %s AND role = %s",
            (credentials.email, credentials.role)
        )
    elif credentials.phone:
        cursor.execute(
            "SELECT * FROM users WHERE phone = %s AND role = %s",
            (credentials.phone, credentials.role)
        )
    else:
        conn.close()
        raise HTTPException(status_code=400, detail="Email or phone required")
    user = cursor.fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    if credentials.password != '__firebase_verified__':
        if not bcrypt.checkpw(credentials.password.encode(), user["password_hash"].encode()):
            raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "message": "Login successful",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }


@app.post("/auth/lookup-by-phone")
def lookup_by_phone(body: PhoneLookup):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT email FROM users WHERE phone = %s", (body.phone,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=404)

    return {"email": user["email"]}


@app.post("/auth/check-identifier")
def check_identifier(data: CheckIdentifier):
    """
    Step 1 of two-step login: check if the email or phone exists in DB.
    Returns 200 if found, 404 if not. No sensitive data returned.
    """
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    if data.email:
        cursor.execute("SELECT id FROM users WHERE email = %s", (data.email,))
    elif data.phone:
        cursor.execute("SELECT id FROM users WHERE phone = %s", (data.phone,))
    else:
        conn.close()
        raise HTTPException(status_code=400, detail="Provide email or phone")

    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="No account found")

    return {"exists": True}


@app.post("/auth/send-otp")
def send_otp(body: SendOTP):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id FROM users WHERE email = %s", (body.email,))
    user = cursor.fetchone()
    conn.close()

    if not user:
        return {"message": "If that email is registered, an OTP has been sent."}

    otp = str(random.randint(100000, 999999))
    otp_store[body.email] = {
        "otp": otp,
        "expires_at": datetime.utcnow() + timedelta(minutes=10)
    }

    try:
        send_otp_email(body.email, otp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

    return {"message": "If that email is registered, an OTP has been sent."}


@app.post("/auth/verify-otp")
def verify_otp(body: VerifyOTP):
    entry = otp_store.get(body.email)

    if not entry:
        raise HTTPException(status_code=400, detail="No OTP requested for this email.")

    if datetime.utcnow() > entry["expires_at"]:
        otp_store.pop(body.email, None)
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")

    if entry["otp"] != body.otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP.")

    return {"message": "OTP verified."}


@app.post("/auth/reset-password-otp")
def reset_password_otp(body: ResetPasswordOTP):
    entry = otp_store.get(body.email)

    if not entry:
        raise HTTPException(status_code=400, detail="No OTP requested for this email.")

    if datetime.utcnow() > entry["expires_at"]:
        otp_store.pop(body.email, None)
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")

    if entry["otp"] != body.otp:
        raise HTTPException(status_code=400, detail="Incorrect OTP.")

    if len(body.new_password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")

    new_hash = bcrypt.hashpw(body.new_password.encode(), bcrypt.gensalt()).decode()
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    cursor.execute("SELECT role FROM users WHERE email = %s", (body.email,))
    user = cursor.fetchone()

    cursor.execute(
        "UPDATE users SET password_hash = %s WHERE email = %s",
        (new_hash, body.email)
    )
    conn.commit()
    conn.close()

    if user and user["role"] == "customer":
        try:
            firebase_user = firebase_auth.get_user_by_email(body.email)
            firebase_auth.update_user(firebase_user.uid, password=body.new_password)
        except firebase_auth.UserNotFoundError:
            try:
                firebase_auth.create_user(email=body.email, password=body.new_password)
            except Exception as e:
                print(f"Firebase user creation during reset failed: {e}")
        except Exception as e:
            print(f"Firebase password update failed: {e}")

    otp_store.pop(body.email, None)

    return {"message": "Password updated successfully."}


@app.post("/auth/reset-password")
def reset_password(data: dict):
    email = data.get("email")
    new_password = data.get("new_password")
    if not email or not new_password:
        raise HTTPException(status_code=400, detail="Email and new password are required")
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT role FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    if not user:
        conn.close()
        return {"message": "ok"}
    new_hash = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
    cursor.execute(
        "UPDATE users SET password_hash = %s WHERE email = %s",
        (new_hash, email)
    )
    conn.commit()
    conn.close()

    if user["role"] == "customer":
        try:
            firebase_user = firebase_auth.get_user_by_email(email)
            firebase_auth.update_user(firebase_user.uid, password=new_password)
        except firebase_auth.UserNotFoundError:
            try:
                firebase_auth.create_user(email=email, password=new_password)
            except Exception as e:
                print(f"Firebase user creation during reset failed: {e}")
        except Exception as e:
            print(f"Firebase password update failed: {e}")

    return {"message": "Password updated"}


@app.post("/auth/google-login")
def google_login(user: GoogleLogin):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (user.email,))
    existing = cursor.fetchone()
    if existing:
        conn.close()
        return {
            "message": "Login successful",
            "user": {
                "id": existing["id"],
                "name": existing["name"],
                "email": existing["email"],
                "role": existing["role"]
            }
        }
    cursor.execute(
        "INSERT INTO users (name, email, password_hash, role) VALUES (%s, %s, %s, 'customer')",
        (user.name, user.email, f"google_uid:{user.uid}")
    )
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {
        "message": "Account created via Google",
        "user": {
            "id": new_id,
            "name": user.name,
            "email": user.email,
            "role": "customer"
        }
    }


# ══════════════════════════════════════════════════════
#  MENU ENDPOINTS
# ══════════════════════════════════════════════════════

@app.get("/menu")
def get_menu():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM menu_items")
    items = cursor.fetchall()
    conn.close()
    return items


@app.post("/menu")
def add_menu_item(item: MenuItemCreate):
    conn = get_connection()
    cursor = conn.cursor()
    query = """INSERT INTO menu_items (name, description, price, category, is_available, image_url)
               VALUES (%s, %s, %s, %s, %s, %s)"""
    cursor.execute(query, (item.name, item.description, item.price, item.category, item.is_available, item.image_url))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    return {"message": "Menu item added successfully", "id": new_id}


@app.put("/menu/{item_id}")
def update_menu_item(item_id: int, item: MenuItemUpdate):
    conn = get_connection()
    cursor = conn.cursor()
    fields = []
    values = []
    if item.name is not None:
        fields.append("name = %s"); values.append(item.name)
    if item.description is not None:
        fields.append("description = %s"); values.append(item.description)
    if item.price is not None:
        fields.append("price = %s"); values.append(item.price)
    if item.category is not None:
        fields.append("category = %s"); values.append(item.category)
    if item.is_available is not None:
        fields.append("is_available = %s"); values.append(item.is_available)
    if item.image_url is not None:
        fields.append("image_url = %s"); values.append(item.image_url)
    if not fields:
        conn.close()
        raise HTTPException(status_code=400, detail="No fields to update")
    values.append(item_id)
    query = f"UPDATE menu_items SET {', '.join(fields)} WHERE id = %s"
    try:
        cursor.execute(query, values)
        conn.commit()
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Item not found")
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
    return {"message": "Menu item updated successfully"}


@app.delete("/menu/{item_id}")
def delete_menu_item(item_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM menu_items WHERE id = %s", (item_id,))
    conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Item not found")
    conn.close()
    return {"message": "Menu item deleted successfully"}


# ══════════════════════════════════════════════════════
#  ORDER ENDPOINTS
# ══════════════════════════════════════════════════════

@app.post("/orders")
def place_order(order: PlaceOrder):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    # ── Step 1: Stock availability check ──────────────────
    insufficient = []
    for item in order.cart:
        cursor.execute(
            "SELECT quantity FROM inventory WHERE menu_item_id = %s",
            (item.menu_item_id,)
        )
        stock = cursor.fetchone()
        if not stock or stock["quantity"] < item.quantity:
            cursor.execute(
                "SELECT name FROM menu_items WHERE id = %s",
                (item.menu_item_id,)
            )
            menu_item = cursor.fetchone()
            item_name = menu_item["name"] if menu_item else f"Item {item.menu_item_id}"
            available = stock["quantity"] if stock else 0
            insufficient.append({
                "item": item_name,
                "requested": item.quantity,
                "available": available
            })

    if insufficient:
        conn.close()
        raise HTTPException(
            status_code=400,
            detail={
                "message": "Some items are out of or insufficient in stock",
                "insufficient_items": insufficient
            }
        )

    # ── Step 2: Calculate total price ─────────────────────
    total_price = 0
    cart_details = []
    for item in order.cart:
        cursor.execute(
            "SELECT price, name FROM menu_items WHERE id = %s",
            (item.menu_item_id,)
        )
        menu_item = cursor.fetchone()
        if not menu_item:
            conn.close()
            raise HTTPException(status_code=404, detail=f"Menu item {item.menu_item_id} not found")
        item_total = menu_item["price"] * item.quantity
        total_price += item_total
        cart_details.append({
            "menu_item_id": item.menu_item_id,
            "name": menu_item["name"],
            "quantity": item.quantity,
            "price_at_order": menu_item["price"]
        })

    # ── Step 3: Create the order ───────────────────────────
    cursor.execute(
        """INSERT INTO orders (user_id, delivery_address, payment_method, special_instructions, total_price)
           VALUES (%s, %s, %s, %s, %s)""",
        (order.user_id, order.delivery_address, order.payment_method, order.special_instructions, total_price)
    )
    conn.commit()
    order_id = cursor.lastrowid

    # ── Step 4: Insert order items ─────────────────────────
    for item in cart_details:
        cursor.execute(
            """INSERT INTO order_items (order_id, menu_item_id, quantity, price_at_order)
               VALUES (%s, %s, %s, %s)""",
            (order_id, item["menu_item_id"], item["quantity"], item["price_at_order"])
        )

    # ── Step 5: Deduct inventory ───────────────────────────
    for item in order.cart:
        cursor.execute(
            "UPDATE inventory SET quantity = quantity - %s WHERE menu_item_id = %s",
            (item.quantity, item.menu_item_id)
        )

    conn.commit()
    conn.close()

    return {
        "message": "Order placed successfully",
        "order_id": order_id,
        "total_price": total_price,
        "status": "placed",
        "estimated_delivery_time": "30-45 minutes",
        "items": cart_details
    }


@app.get("/orders/{user_id}")
def get_user_orders(user_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT * FROM orders WHERE user_id = %s ORDER BY created_at DESC",
        (user_id,)
    )
    orders = cursor.fetchall()
    conn.close()
    return orders


@app.get("/orders/detail/{order_id}")
def get_order_detail(order_id: int):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM orders WHERE id = %s", (order_id,))
    order = cursor.fetchone()
    if not order:
        conn.close()
        raise HTTPException(status_code=404, detail="Order not found")
    cursor.execute(
        """SELECT oi.*, mi.name, mi.image_url
           FROM order_items oi
           JOIN menu_items mi ON oi.menu_item_id = mi.id
           WHERE oi.order_id = %s""",
        (order_id,)
    )
    items = cursor.fetchall()
    conn.close()
    order["items"] = items
    return order


# ══════════════════════════════════════════════════════
#  INVENTORY ENDPOINTS
# ══════════════════════════════════════════════════════

@app.get("/inventory")
def get_inventory():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("""
        SELECT i.*, mi.name, mi.category
        FROM inventory i
        JOIN menu_items mi ON i.menu_item_id = mi.id
    """)
    items = cursor.fetchall()
    conn.close()
    return items

@app.post("/inventory/stock")
def check_stock(data: dict):
    item_ids = data.get("item_ids", [])
    if not item_ids:
        return {}
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    placeholders = ", ".join(["%s"] * len(item_ids))
    cursor.execute(
        f"SELECT menu_item_id, quantity FROM inventory WHERE menu_item_id IN ({placeholders})",
        tuple(item_ids)
    )
    rows = cursor.fetchall()
    conn.close()
    return {row["menu_item_id"]: row["quantity"] for row in rows}



