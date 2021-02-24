import secrets
import uvicorn
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/static", StaticFiles(directory="static", html=True), name="static")
security = HTTPBasic()

fake_users_db = {}


def get_current_username(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = credentials.username in fake_users_db
    correct_password = False
    if correct_username:
        correct_password = secrets.compare_digest(credentials.password,
                                                  fake_users_db[credentials.username])

    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=418,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username


def register_user(credentials: HTTPBasicCredentials = Depends(security)):
    if credentials.username in fake_users_db:
        raise HTTPException(
            status_code=419,
            detail="Username already exist",
            headers={"WWW-Authenticate": "Basic"},
        )
    fake_users_db[credentials.username] = credentials.password
    return credentials.username


@app.get("/me")
def get_me(username: str = Depends(get_current_username)):
    return {"username": username}


@app.get("/register")
def register(username: str = Depends(register_user)):
    return {"username": username}


if __name__ == "__main__":
    print("http://0.0.0.0:8888/static")
    uvicorn.run(app, host="0.0.0.0", port=8888)
