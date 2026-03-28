import os

import httpx
from auth0.authentication import GetToken
from auth0.management import Auth0

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

AUTH0_DOMAIN = "dev-ktipr7loj1f84qfw.us.auth0.com"
CLIENT_ID = 'lNGZlo4hyIadjhLfmE5q3ifVGKktsWdc'
CLIENT_SECRET = 'jtWoQyGRYqlzbXl8G1XkcILNPBaNR3N_MLua1MNilWACeiPZgcXRT6bt0czLx7kY'
API_IDENTIFIER = "https://dev-ktipr7loj1f84qfw.us.auth0.com/api/v2/"
ALGORITHMS = ["RS256"]
REDIRECT_URI = f"{os.getenv('BACKEND_URL')}/callback"

def strip_auth0_prefix(tailor_id: str) -> str:
    return tailor_id.replace("auth0|", "")


async def get_jwks():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
        return response.json()


get_token = GetToken(AUTH0_DOMAIN, CLIENT_ID, client_secret=CLIENT_SECRET)
token = get_token.client_credentials(audience=API_IDENTIFIER)

auth0 = Auth0(AUTH0_DOMAIN, token['access_token'])


def update_tailor_metadata(user_id, full_name, address, phone_number):
    metadata = {
        "name": full_name,
        "address": address,
        "phone": phone_number
    }
    auth0.users.update(f"auth0|{user_id}", {"user_metadata": metadata})


def get_tailor_metadata(user_id):
    user = auth0.users.get(f"auth0|{user_id}")
    metadata = user.get("user_metadata", {})
    email = user["email"]
    full_name = metadata.get("name")
    address = metadata.get("address")
    phone_number = metadata.get("phone")
    return full_name, address, phone_number, email


async def get_current_user(token: str = Depends(oauth2_scheme)):
    jwks = await get_jwks()
    unverified_header = jwt.get_unverified_header(token)
    rsa_key = {}
    for key in jwks["keys"]:
        if key.get("kid") == unverified_header.get("kid"):
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }
    if rsa_key:
        try:
            payload = jwt.decode(
                token,
                rsa_key,
                algorithms=ALGORITHMS,
                audience=API_IDENTIFIER,
                issuer=f"https://{AUTH0_DOMAIN}/"
            )
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired"
            )
        except jwt.JWTClaimsError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect claims. Please, check the audience and issuer."
            )
        except Exception:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to parse authentication token."
            )
        payload["sub"] = strip_auth0_prefix(payload["sub"])
        return payload
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unable to find appropriate key"
    )
