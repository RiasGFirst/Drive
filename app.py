from flask import Flask, redirect, url_for, render_template, request, session
import utils.account as account
import utils.database as db
import os


app = Flask(__name__)
app.secret_key = os.urandom(24)

config = db.readconfig("config.yml")
#print(config["DB_HOSTNAME"])
conn = db.connect_db(host=config["DB_HOSTNAME"], user=config["DB_USERNAME"], password=config["DB_PASS"], dbname=config["DB_NAME"])
db.create_table(connection=conn)


@app.route("/")
def home_page():
    return render_template("index.html")


@app.route("/login", methods=["POST", "GET"])
def login_page():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
        user = account.login(connexion=conn, email=email, passwd=password)
        if user != "Error":
            session["uuid"] = user[1]
            session["username"] = user[2]
            session["email"] = user[3]
            session["stockage"] = user[5]
            return redirect(url_for("user_page"))
        else:
            return redirect(url_for("home_page"))
    else:
        return render_template("login.html")


@app.route("/register", methods=["POST", "GET"])
def register_page():
    if request.method == "POST":
        username = request.form["username"]
        email = request.form["email"]
        cemail =  request.form["cemail"]
        password = request.form["password"]
        cpassword = request.form["cpassword"]
        register = account.register(connexion=conn, username=username, email=email, conf_email=cemail, passwd=password, conf_passwd=cpassword)
        return redirect(url_for("home_page"))
    else:
        return render_template("register.html")


@app.route("/user")
def user_page():
    if 'uuid' in session:
        username = session['username']
        email = session['email']
        uuid = session['uuid']
        space = session['stockage']
        return render_template("user.html", username=username, email=email, uuid=uuid, space=space)
    else:
        return redirect(url_for("login_page"))


if __name__ == '__main__':
    app.run()