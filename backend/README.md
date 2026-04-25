# Saveur Backend

FastAPI backend for the Saveur Restaurant System.

## Current Scope

- Auth endpoints for register, login, Google login, and password reset (admin and rider)
- Menu CRUD endpoints
- Order placement with inventory deduction
- Inventory listing endpoint

## Tech Stack

- Python
- FastAPI
- MySQL
- bcrypt

## Project Files

- main.py: API endpoints
- models.py: request models
- database.py: MySQL connection
- database_setup.sql: database schema and seed SQL
- seed_menu.py: sample menu seed script

## Run Backend Locally

1. Open a terminal in this folder.
2. Create and activate a virtual environment.

```powershell
python -m venv venv
venv\Scripts\activate
```

3. Install dependencies.

```powershell
pip install -r requirements.txt
```

4. Create the database schema using the setup script.

```powershell
python setupdb.py
```

5. Update database credentials in database.py if needed.
6. Start the API server.

```powershell
uvicorn main:app --reload
```

7. Optional: seed menu data.

```powershell
python seed_menu.py
python seed_users.py
```

8. Open API docs.

- Swagger UI: http://localhost:8000/docs

## Notes

- Ensure database restaurant_db exists before running setupdb.py.
- The schema references a users table. Ensure users exists before testing auth and orders.
- CORS is currently open for local development.
