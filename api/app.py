from datetime import datetime
import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin
import sqlite3
import json

app = Flask(__name__)
cors = CORS(app)
db = "../db/hardware.db"
basedir = os.path.abspath(os.path.dirname(__file__))
app.config ['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///{0}'.format(os.path.join(basedir, db))
ALLOWED_ORIGINS = ['localhost', '127.0.0.1']
APPLICATION_JSON = "application/json"

dba = SQLAlchemy(app)
ma = Marshmallow(app)

class Org(dba.Model):
  __tablename__ = 'org'
  id = dba.Column(dba.Integer, primary_key = True)
  name = dba.Column(dba.String(200))
  
class Subscription(dba.Model):
  __tablename__ = 'subscription'
  id = dba.Column(dba.Integer, primary_key = True)
  name = dba.Column(dba.String(200))
  subscription_buyer = dba.Column(dba.Integer, dba.ForeignKey('org.id'))
  subscription_seller = dba.Column(dba.Integer, dba.ForeignKey('org.id'))
  
class Location(dba.Model):
  __tablename__ = 'location'
  id = dba.Column(dba.Integer, primary_key = True)
  name = dba.Column(dba.String(200))
  
class Asset(dba.Model):
  __tablename__ = 'asset'
  id = dba.Column(dba.Integer, primary_key = True)
  name = dba.Column(dba.String(200))
  serial = dba.Column(dba.String(200))
  subscription_id = dba.Column(dba.Integer, dba.ForeignKey('subscription.id'))
  location_id = dba.Column(dba.Integer, dba.ForeignKey('location.id'))
  subscription = dba.relationship("Subscription", backref="assets")
  location = dba.relationship("Location", backref="assets")
  impaired = dba.Column(dba.Integer, default=0)

class Impaired(dba.Model):
  __tablename__ = 'impaired'
  id = dba.Column(dba.Integer, primary_key = True)
  asset_id = dba.Column(dba.Integer, dba.ForeignKey('asset.id'))
  description = dba.Column(dba.Text)
  impaired_date = dba.Column(dba.DateTime, default=datetime.utcnow)
  resolved = dba.Column(dba.Boolean, default=False)
  resolved_date = dba.Column(dba.DateTime, default=None)
  asset = dba.relationship("Asset", backref="impaired_asset")

class LocationSchema(ma.SQLAlchemySchema):
    class Meta:
      model = Location
      load_instance = True
      sqla_session = dba.session
    
    id = ma.auto_field()
    name = ma.auto_field()
  
class SubscriptionSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Subscription
        load_instance = True
        sqla_session = dba.session
       
    id = ma.auto_field()
    name = ma.auto_field()
    assets = ma.auto_field()
    
class AssetSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Asset
        load_instance = True
        sqla_session = dba.session
        
    id = ma.auto_field()
    name = ma.auto_field()
    serial = ma.auto_field()
    subscription = ma.Nested(SubscriptionSchema)
    location = ma.Nested(LocationSchema)
    impaired = ma.auto_field()
        
class ImpairedSchema(ma.SQLAlchemySchema):
    class Meta:
        model = Impaired
        load_instance = True
        sqla_session = dba.session
        
    id = ma.auto_field()
    asset = ma.Nested(AssetSchema)
    description = ma.auto_field()
    impaired_date = ma.auto_field()
    resolved = ma.auto_field()
    resolved_date = ma.auto_field()
        
location_schema = LocationSchema()
locations_schema = LocationSchema(many=True)
subscription_schema = SubscriptionSchema()
subscriptions_schema = SubscriptionSchema(many=True)
asset_schema = AssetSchema()
assets_schema = AssetSchema(many=True)
impaired_schema = ImpairedSchema()
impaired_assets_schema = ImpairedSchema(many=True)

@cross_origin({"origins":['localhost', '127.0.0.1']})
@app.route("/", methods=["GET"])
def base():
    return """
    <body>
    <ul>
      <li><a href="http://localhost:8088/locations">locations</a></li>
      <li><a href="http://localhost:8088/subscriptions">subscriptions</a></li>
      <li><a href="http://localhost:8088/assets">assets</a></li>
      <li><a href="http://localhost:8088/impaired-assets">impaired-assets</a></li>
    </ul>
    </body>
    """

@cross_origin({"origins":['localhost', '127.0.0.1']})
@app.route("/locations", methods=["GET"])
def locations():
    all_locations = Location.query.all()
    locations_sch = locations_schema.dump(all_locations)
    locations = []
    for location in locations_sch:
      result = {}
      result["id"] = location["id"]
      result["name"] = location["name"]
      locations.append(result)
    response = app.response_class(
      response=json.dumps(locations), status=200, mimetype=APPLICATION_JSON
    )
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
      

@cross_origin({"origins":['localhost', '127.0.0.1']})
@app.route("/subscriptions", methods=["GET"])
def subscriptions():
    all_subs = Subscription.query.all()
    subs_schema = subscriptions_schema.dump(all_subs)
    subscriptions = []
    for sub in subs_schema:
      result = {}
      result["id"] = sub["id"]
      result["name"] = sub["name"]
      num_assets = len(sub["assets"])
      result["num_assets"] = num_assets
      subscriptions.append(result)
    response = app.response_class(
        response=json.dumps(subscriptions), status=200, mimetype=APPLICATION_JSON   
    )
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
  
@cross_origin({"origins":['localhost', '127.0.0.1']})
@app.route("/subscription/<int:subscription_id>", methods=["GET"])
def subscription(subscription_id):
    subscription = Subscription.query.get(subscription_id)
    result = subscription_schema.dump(subscription)
    return {"subscription": result}
  
@cross_origin({"origins":['localhost', '127.0.0.1']})
@app.route("/subscription", methods=["POST"])
def add_subscription():
  data = request.get_json(force=True) 
  name = data.get('name', '')
  buyer = data.get('buyer', 2)
  seller = data.get('seller', 1)
  subscription = Subscription(
                  name=name, 
                  subscription_buyer=buyer,
                  subscription_seller=seller
                  )
  dba.session.add(subscription)
  dba.session.commit()
  return { "id": subscription.id }
  
@cross_origin({"origins":['localhost', '127.0.0.1']})
@app.route("/assets", methods=["GET"])
def assets():
    all_assets = Asset.query.all()
    assets_sch = assets_schema.dump(all_assets)
    assets = []
    for asset in assets_sch:
        result = {}
        result["id"] = asset["id"]
        result["name"] = asset["name"]
        result["serial"] = asset["serial"]
        subscription = asset["subscription"]
        result["subscription_name"] = subscription["name"]
        location = asset["location"]
        result["location_name"] = location["name"]
        result["impaired"] = asset["impaired"]
        assets.append(result)
    response = app.response_class(
        response=json.dumps(assets), status=200, mimetype=APPLICATION_JSON
    )
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
  
@cross_origin({"origins":['localhost', '127.0.0.1']})
@app.route("/asset/<int:asset_id>", methods=["GET"])
def asset(asset_id):
    asset = Asset.query.get(asset_id)
    result = asset_schema.dump(asset)
    return {"asset": result}
  
@cross_origin({"origins":['localhost', '127.0.0.1']})
@app.route("/asset", methods=["POST"])
def add_asset():
    data = request.get_json(force=True)
    name = data.get('name', '')
    serial = data.get('serial', '')
    subscription_id = data.get('subscription_id', None)
    location_id = data.get('location_id', None)
    asset = Asset(
              name=name,
              serial=serial,
              subscription_id=subscription_id,
              location_id=location_id
              )
    dba.session.add(asset)
    dba.session.commit()
    return { "id": asset.id }

@cross_origin({"origins":['localhost', '127.0.0.1']}) 
@app.route("/asset/<int:asset_id>", methods=["PATCH"])
def update_asset(asset_id):
    data = request.get_json(force=True)
    impaired = data.get('impaired', True)
    asset = Asset.query.get(asset_id)
    asset.impaired = impaired
    dba.session.add(asset)
    dba.session.commit()
    return asset_schema.jsonify(asset)
  
@cross_origin({"origins":['localhost', '127.0.0.1']})
@app.route("/impaired-assets", methods=["GET"])
def impaired_assets():
    all_impaired = Impaired.query.all()
    imp_assets_sch = impaired_assets_schema.dump(all_impaired)
    imp_assets = []
    for imp_asset in imp_assets_sch:
        result = {}
        result["id"] = imp_asset["id"]
        result["location_name"] = imp_asset["asset"]["location"]["name"]
        result["serial"] = imp_asset["asset"]["serial"]
        result["description"] = imp_asset["description"]
        result["impaired_date"] = imp_asset["impaired_date"]
        result["resolved"] = imp_asset["resolved"]
        result["resolved_date"] = imp_asset["resolved_date"]
        imp_assets.append(result)
    response = app.response_class(
        response=json.dumps(imp_assets), status=200, mimetype=APPLICATION_JSON 
    )
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response
        
@cross_origin({"origins":['localhost', '127.0.0.1']})
@app.route("/impaired/<int:impaired_id>", methods=["GET"])
def impaired(impaired_id):
    impaired = Impaired.query.get(impaired_id)
    result = impaired_schema.dump(impaired)
    return {"impaired": result}

@cross_origin({"origins":['localhost', '127.0.0.1']})  
@app.route("/impaired", methods=["POST"])
def add_impaired():
    data = request.get_json(force=True)
    asset_id = data.get('asset_id', None)
    description = data.get('description', '')
    impaired = Impaired(
                  asset_id=asset_id,
                  description=description,
                )
    asset = Asset.query.get(asset_id)
    asset.impaired = 1 
    dba.session.add(impaired)
    dba.session.add(asset)
    dba.session.commit()
    return { "id": impaired.id }
  
@cross_origin({"origins":['localhost', '127.0.0.1']})
@app.route("/impaired/<int:impaired_id>", methods=["PATCH"])
def resolve_impaired(impaired_id):
    impaired = Impaired.query.get(impaired_id)
    impaired.resolved = 1
    impaired.resolved_date = datetime.utcnow()
    asset = Asset.query.get(impaired.asset_id)
    asset.impaired = 0
    dba.session.add(impaired)
    dba.session.add(asset)
    dba.session.commit()
    return impaired_schema.jsonify(impaired)

if __name__ == "__main__":
    app.run(host="localhost", port=8088, debug=True)
