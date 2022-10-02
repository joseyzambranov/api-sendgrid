const { MongoClient } = require('mongodb');
require('dotenv').config()
const clientSendGrid = require('@sendgrid/client');
clientSendGrid.setApiKey(process.env.SENDGRID_API_KEY);

const ObjectID = require('mongodb').ObjectID;
const uri =process.env.DB_MONGO_CONNECTION_STRING;
const client = new MongoClient(uri);
const myObjectId = ObjectID("633764cb7d21000072003da2")
const dbName = 'email';
const request = { url: `/v3/validations/email`, method: 'POST', body: { "email": "exampleexample.com","source": "signup" }}

async function main() {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('counter');
  const findResult = await collection.find({_id: myObjectId}).toArray();
  const dateCounter = findResult[0].process_date
  const countCounter = findResult[0].count

  if(new Date(dateCounter).getUTCMonth() == new Date().getUTCMonth()){
       if(countCounter>=5000){
        return "no se puede hacer peticiones porque sobrepasa la cantidad permitida"
        }
        else{
         await collection.updateOne({_id: myObjectId}, { $set: { count: countCounter+1,"process_date": new Date() }  });
         await clientSendGrid.request(request)
          .then(([response, body]) => {
            if(response.body.result.verdict == "Invalid"){
                console.log("hay "+countCounter+" count y el correo es " + response.body.result.verdict + " el proceso se detiene");
            }else{
                console.log("hay "+countCounter+" count y el correo es " + response.body.result.verdict)
            }
            
          })
          .catch(error => {
            console.error(error);
          });
        }
  }else{
    await collection.updateOne({_id: myObjectId}, { $set: { count: 0,"process_date": new Date() }  });
         await clientSendGrid.request(request)
          .then(([response, body]) => {
            if(response.body.result.verdict == "Invalid"){
                console.log("empeiza un numevo mes y el count esta en 0, el correo es " + response.body.result.verdict + " el proceso se detiene");
            }else{
                console.log("empeiza un numevo mes y el count esta en 0, el correo es " + response.body.result.verdict)
            }
          })
          .catch(error => {
            console.error(error);
          });

  }
  return "done."
}
main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());


