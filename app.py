from flask import Flask, redirect, url_for, render_template, request
import utils.database as db
import utils.account as account


app = Flask(__name__)

config = db.readconfig("config.yml")
#print(config["DB_HOSTNAME"])
conn = db.connect_db(host=config["DB_HOSTNAME"], user=config["DB_USERNAME"], password=config["DB_PASS"], dbname=config["DB_NAME"])
db.create_table(connection=conn)


@app.route("/")
def home_page():
    args = request.args.to_dict()
    return render_template("index.html", content=args.get('msg'))


@app.route("/login", methods=["POST", "GET"])
def login_page():
    if request.method == "POST":
        email = request.form["email"]
        password = request.form["password"]
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
        register = account.register(username=username, email=email, conf_email=cemail, passwd=password, conf_passwd=cpassword)
        return redirect(url_for("home_page", msg=register))
    else:
        return render_template("register.html")

if __name__ == '__main__':
    app.run()