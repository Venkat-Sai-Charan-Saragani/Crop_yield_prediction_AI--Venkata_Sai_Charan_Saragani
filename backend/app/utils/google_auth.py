import os
from pathlib import Path

import requests

from dotenv import load_dotenv

from google.oauth2 import id_token
from google.auth.transport import requests as google_requests


# ============================================================
# LOAD ENVIRONMENT
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

load_dotenv(
    BASE_DIR / ".env"
)


GOOGLE_CLIENT_ID = os.getenv(
    "GOOGLE_CLIENT_ID"
)

GOOGLE_CLIENT_SECRET = os.getenv(
    "GOOGLE_CLIENT_SECRET"
)


# ============================================================
# GOOGLE OAUTH REDIRECT URI
# ============================================================

# @react-oauth/google authorization-code popup flow
# uses Google's special "postmessage" redirect URI.
GOOGLE_REDIRECT_URI = "postmessage"


# ============================================================
# DEBUG CONFIGURATION
# ============================================================

print(
    "Google OAuth configuration loaded"
)

print(
    "GOOGLE_CLIENT_ID:",
    GOOGLE_CLIENT_ID
)

print(
    "GOOGLE_CLIENT_SECRET_SET:",
    bool(GOOGLE_CLIENT_SECRET)
)

print(
    "GOOGLE_REDIRECT_URI:",
    GOOGLE_REDIRECT_URI
)


# ============================================================
# EXCHANGE GOOGLE AUTHORIZATION CODE
# ============================================================

def exchange_google_code(
    code: str
):

    if not code:

        print(
            "Google authorization code is missing."
        )

        return None


    if not GOOGLE_CLIENT_ID:

        print(
            "GOOGLE_CLIENT_ID is missing."
        )

        return None


    if not GOOGLE_CLIENT_SECRET:

        print(
            "GOOGLE_CLIENT_SECRET is missing."
        )

        return None


    token_url = (
        "https://oauth2.googleapis.com/token"
    )


    data = {

        "code":
            code,

        "client_id":
            GOOGLE_CLIENT_ID,

        "client_secret":
            GOOGLE_CLIENT_SECRET,

        "redirect_uri":
            GOOGLE_REDIRECT_URI,

        "grant_type":
            "authorization_code"

    }


    print(
        "Exchanging Google authorization code..."
    )


    try:

        response = requests.post(

            token_url,

            data=data,

            timeout=15

        )

    except requests.RequestException as error:

        print(
            "Google token request failed:"
        )

        print(
            type(error).__name__
        )

        print(
            error
        )

        return None


    print(
        "Google token exchange status:",
        response.status_code
    )


    if response.status_code != 200:

        print(
            "Google token exchange failed."
        )

        print(
            "Status:",
            response.status_code
        )

        print(
            "Response:",
            response.text
        )

        return None


    try:

        token_data = response.json()

    except ValueError:

        print(
            "Google returned invalid JSON."
        )

        print(
            "Response:",
            response.text
        )

        return None


    if not isinstance(
        token_data,
        dict
    ):

        print(
            "Google token response is not a dictionary."
        )

        return None


    if token_data.get(
        "error"
    ):

        print(
            "Google OAuth error:"
        )

        print(
            token_data
        )

        return None


    print(
        "Google authorization code exchanged successfully."
    )

    print(
        "Google token response keys:",
        list(
            token_data.keys()
        )
    )


    return token_data


# ============================================================
# VERIFY GOOGLE AUTHORIZATION CODE
# ============================================================

def verify_google_code(
    code: str
):

    try:

        if not code:

            print(
                "Google verification failed: empty code."
            )

            return None


        # ----------------------------------------------------
        # EXCHANGE AUTHORIZATION CODE
        # ----------------------------------------------------

        token_data = exchange_google_code(
            code
        )


        if not token_data:

            print(
                "Google verification failed: "
                "token exchange returned nothing."
            )

            return None


        # ----------------------------------------------------
        # GET ID TOKEN
        # ----------------------------------------------------

        google_id_token = token_data.get(
            "id_token"
        )


        if not google_id_token:

            print(
                "Google ID token missing."
            )

            print(
                "Response keys:",
                list(
                    token_data.keys()
                )
            )

            return None


        # ----------------------------------------------------
        # VERIFY GOOGLE ID TOKEN
        # ----------------------------------------------------

        print(
            "Verifying Google ID token..."
        )


        user_info = (
            id_token.verify_oauth2_token(

                google_id_token,

                google_requests.Request(),

                GOOGLE_CLIENT_ID

            )
        )


        if not user_info:

            print(
                "Google ID token verification returned no user."
            )

            return None


        # ----------------------------------------------------
        # VERIFY AUDIENCE
        # ----------------------------------------------------

        token_audience = user_info.get(
            "aud"
        )


        if token_audience != GOOGLE_CLIENT_ID:

            print(
                "Google audience mismatch."
            )

            print(
                "Expected:",
                GOOGLE_CLIENT_ID
            )

            print(
                "Received:",
                token_audience
            )

            return None


        # ----------------------------------------------------
        # GET USER DATA
        # ----------------------------------------------------

        google_id = user_info.get(
            "sub"
        )

        email = user_info.get(
            "email"
        )

        email_verified = user_info.get(
            "email_verified",
            False
        )

        full_name = user_info.get(
            "name",
            ""
        )

        profile_image = user_info.get(
            "picture"
        )


        # ----------------------------------------------------
        # VALIDATE REQUIRED DATA
        # ----------------------------------------------------

        if not google_id:

            print(
                "Google account ID is missing."
            )

            return None


        if not email:

            print(
                "Google account email is missing."
            )

            return None


        # ----------------------------------------------------
        # EMAIL VERIFICATION
        # ----------------------------------------------------

        if not email_verified:

            print(
                "Google email is not verified:"
            )

            print(
                email
            )

            return None


        # ----------------------------------------------------
        # SUCCESS
        # ----------------------------------------------------

        print(
            "Google account verified successfully."
        )

        print(
            "Google email:",
            email
        )

        print(
            "Google name:",
            full_name
        )


        return {

            "google_id":
                google_id,

            "email":
                email,

            "email_verified":
                True,

            "full_name":
                full_name,

            "profile_image":
                profile_image

        }


    except ValueError as error:

        print(
            "Google ID token verification failed:"
        )

        print(
            type(error).__name__
        )

        print(
            error
        )

        return None


    except Exception as error:

        print(
            "Google verification error:"
        )

        print(
            type(error).__name__
        )

        print(
            error
        )

        return None