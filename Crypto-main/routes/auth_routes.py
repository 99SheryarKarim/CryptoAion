# import datetime
# import uuid

# from jose import JWTError, jwt
# from datetime import datetime
# from fastapi import FastAPI, Depends, HTTPException, status , Body, Query
# from fastapi import APIRouter, Depends, HTTPException, Request
# from models.models import User , Expert, Trainer
# from models.schemas import Email, Login, RegistrationIn,NewPassword
# from fastapi.security import OAuth2PasswordBearer
# from dependencies import get_user, JWT_SECRET
# try :
#     from dependencies import JWT_SECRET
# except:
#     JWT_SECRET = "IamOmarAboelfetouhMahmoudAndIDoART01129461404"

# router = APIRouter()

# @router.post('/login')
# async def login(login_pydantic : Login):
#     model = User
#     try:
#         reg_dict = login_pydantic.dict(exclude_unset = False)
#     except:
#         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail='You missing some information!')
        
#     user = await model.findUserByEmail(reg_dict["email"])
#     if not user: raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail='Email is not signed up!')
    
#     #V2 add the hash thing
#     v = await user.verify_password_login(reg_dict["password"])
#     if not user: raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail='Password is not correct')
    
#     # the token generation
#     token = jwt.encode({"user_id": user.id}, JWT_SECRET, algorithm="HS256")
#     ret = {
#         "user": {
#             "username": user.username,
#             "avatar": user.picture if user.hasPicture() else None,
#         },
#         "token": token
#     }
#     return ret

    
# # works and tested
# @router.post('/register')
# async def register(reg_pydantic : RegistrationIn):
#     model = User
#     try:
#            reg_dict = reg_pydantic.dict(exclude_unset = False)
#     except:
#            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail='You missing some information!')
#     # verify the input
#     verify = await User.verifyEmailAndUsername(reg_dict, reg_dict.keys())
#     if verify is not None:
#         return await verify
    
#     # save in database
#     user = await model.create(**reg_dict)
#     await user.save()
#     # the token generation
#     token = jwt.encode({"user_id": user.id}, JWT_SECRET, algorithm="HS256")
#     ret = {
#         "user": {
#             "username": user.username,
#             "avatar": user.picture if user.hasPicture() else None,
#         },
#         "token": token
#     }
#     return ret

# @router.post('/register/genderin')
# async def genderin(genderin : bool,
# user = Depends(get_user)
# ):
#     await user.setGender(genderin)
#     return "done"
    
# @router.post('/register/agein')
# async def agein(agein : int,
# user = Depends(get_user)
# ):
#     await user.setAge(agein)
#     return "done"
    
# @router.post('/register/w_heightin')
# async def weightandhightin(weightin : int, heightin : int,
# user = Depends(get_user)
# ):
#     await user.setHeight(heightin)
#     await user.setWeight(weightin)
#     return "done"
    
# @router.post('/register/goalin')
# async def goalin(goalin : str,
# user = Depends(get_user)
# ):
#     await user.setGoal(goalin)
#     return "done"

# @router.post('/register/experiencein')
# async def experiencein(experiencein : str
# , user = Depends(get_user)
# ):
#     await user.setExprienceLevel(experiencein)
#     return "done"
    

# def Generate_code():
#     '''
#     this function should generate a unique string everythime it runs
#     '''
#     code = uuid.uuid1()
#     return code
    
    
# @router.post('/forgotpassword')
# async def forgot_password(req: Request, email:Email):
#     # check user exsited
#     model = User
#     user = await model.findUserByEmail(email.dict().get("email"))
#     if not user:
#         raise HTTPException(HTTP_404_NOT_FOUND, "Not Found")
    
#     # create a reset code and save it in the db
#     code = Generate_code()
#     r = await user.setForgotPasswordKey(code)
#     '''
#     send the mail with the link containg r : /forgot-password/{code}
#     '''
#     return {"your reset code is : " : r }

# #add user id and add it to the database search
# @router.post('/forgot-password/{code}')
# async def reset_password(code:str, new_password: NewPassword):
#     # reset the password in the database
    
#     # check code exsits
#     model = Buser
#     user = await model.findForgotPasswordKey(code)
#     if not user:
#         raise HTTPException(HTTP_404_NOT_FOUND, "Code is Incorrect")
    
#     # validate if expired
#     body, resource_fields = await user.getForgotPasswordKey()
#     v = await model.validateForgotPasswordKey(resource_fields,body)
#     if v is not None:
#         return v
    
#     # validate the password
#     body, resource_fields = await new_password.getData()
#     v = await rest_logic.validate(model, resource_fields, body)
#     if v is not None:
#         return v
#     # reset the password in the database
#     r = await user.resetPassword(body["password"])
#     return "Done"



# @router.get('/test_deletethis')
# async def get_all_users():
#     return await User.all()

from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta
from passlib.context import CryptContext

from controllers.auth import authenticate_user, create_access_token
from models.user import User
from schemas.auth import Token, UserCreate
from config import settings
from middlewares.auth_middleware import get_current_user

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register")
async def register(user: UserCreate = Body(...)):
    existing_user = await User.get_or_none(username=user.username)
    if existing_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_password = pwd_context.hash(user.password)
    new_user = await User.create(username=user.username, password_hash=hashed_password)

    return {"message": "User registered successfully", "user": {"username": new_user.username}}


@router.post("/login", response_model=Token)
async def login(user: UserCreate = Body(...)):
    user = await authenticate_user(user.username, user.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
        )

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )

    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    return {"message": f"Hello {current_user['username']}, you are authorized!"}
