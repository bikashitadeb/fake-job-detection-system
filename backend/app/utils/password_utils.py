from app.extensions import bcrypt





# =====================================
# HASH PASSWORD
# =====================================

def hash_password(password: str) -> str:

    """
    Convert plain password into secure bcrypt hash.
    """

    if not password:

        raise ValueError(
            "Password cannot be empty"
        )


    hashed = bcrypt.generate_password_hash(

        password,

        rounds=12

    )


    return hashed.decode("utf-8")







# =====================================
# VERIFY PASSWORD
# =====================================

def verify_password(password: str, password_hash: str) -> bool:

    """
    Compare entered password with stored hash.
    """

    if not password or not password_hash:

        return False



    try:

        return bcrypt.check_password_hash(

            password_hash,

            password

        )


    except Exception as e:

        print(
            "PASSWORD VERIFY ERROR:",
            e
        )

        return False