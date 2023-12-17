import utils.database as db


##### EMAILS #####
def check_email(email, confirmation):
    if email == confirmation:
        return True
    else:
        return False
##################


#### AUTHENTICATION ####
def register(connexion, username, email, conf_email, passwd, conf_passwd, quota_db=100):
    # Check if email and confirm email match
    if email != conf_email:
        return "Emails do not match"

    # Check if password and confirm password match
    if passwd != conf_passwd:
        return "Passwords do not match"

    register_in_db = db.insert_user(connection=connexion, username=username, email=email, password=passwd, storage_quota_gb=quota_db)
    return register_in_db


def login(connexion, email, passwd):
    login = db.check_user(connection=connexion, email=email, passwd=passwd)
    return login