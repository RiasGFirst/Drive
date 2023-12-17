import utils.account as account
import pymysql
import bcrypt
import uuid
import yaml


#### PASSWORD ####
def encrypt_password(passwd):
    hash_passwd = bcrypt.hashpw(passwd.encode('utf-8'), bcrypt.gensalt())
    return hash_passwd


def check_password(plain_password, hashed_password):
    # Check if the plain password matches the hashed password
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
##################

def readconfig(file):
    with open(file, 'r') as f:
        conf = yaml.safe_load(f)

    return conf


def connect_db(host, user, password, dbname):
    db = pymysql.connect(host=host, password=password, user=user, db=dbname)
    return db


def create_table(connection):
    cursor = connection.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            uuid CHAR(36),
            username VARCHAR(255),
            email VARCHAR(255),
            password VARCHAR(255),
            quota_gb INT
        )
    ''')
    connection.commit()


def insert_user(connection, username, email, password, storage_quota_gb):
    user = get_user(connection, email)
    if user is False:
        crypted_password = encrypt_password(password)
        cursor = connection.cursor()
        cursor.execute('''
            INSERT INTO users (uuid, username, email, password, quota_gb) VALUES (%s, %s, %s, %s, %s)
        ''', (uuid.uuid4(), username, email, crypted_password, storage_quota_gb))
        connection.commit()
        return "User added!"
    else:
        return user[0]


def check_user(connection, email, passwd):
    user = get_user(connection=connection, email=email)
    email_db, encrypted_passwd = user[3], user[4]
    if check_password(plain_password=passwd, hashed_password=str(encrypted_passwd)) is False:
        return "Error"
    if email != email_db:
        return "Error"

    return user


def fetch_all_users(connection):
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM users')
    return cursor.fetchall()


def get_user(connection, email):
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    if user:
        return list(user)
    else:
        return False
