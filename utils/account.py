import utils.database as db
import bcrypt


#### PASSWORD ####
def encrypt_password(passwd):
    hash_passwd = bcrypt.hashpw(passwd.encode('utf-8'), bcrypt.gensalt())
    return hash_passwd


def check_password(plain_password, hashed_password):
    # Check if the plain password matches the hashed password
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password)
##################


##### EMAILS #####
def check_email(email, confirmation):
    if email == confirmation:
        return True
    else:
        return False
##################


#### AUTHENTICATION ####
def register(username, email, conf_email, passwd, conf_passwd, quota_db=100):
    # Check if email and confirm email match
    if email != conf_email:
        return "Emails do not match"

    # Check if password and confirm password match
    if passwd != conf_passwd:
        return "Passwords do not match"

    crypted_passwd = encrypt_password(passwd)
    return 'hello'