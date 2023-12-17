import pymysql
import yaml


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

def insert_user(connection, uuid, username, email, password, storage_quota_gb):
    cursor = connection.cursor()
    cursor.execute('''
        INSERT INTO users (uuid, username, email, password, quota_gb) VALUES (%s, %s, %s, %s, %s)
    ''', (uuid, username, email, password, storage_quota_gb))
    connection.commit()

def fetch_all_users(connection):
    cursor = connection.cursor()
    cursor.execute('SELECT * FROM users')
    return cursor.fetchall()