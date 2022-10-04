const { MongoClient } = require('mongodb');
require('dotenv').config()
const clientSendGrid = require('@sendgrid/client');
clientSendGrid.setApiKey(process.env.SENDGRID_API_KEY);

const ObjectId = require('mongodb').ObjectId;
const uri =process.env.DB_MONGO_CONNECTION_STRING;
const client = new MongoClient(uri);
const myObjectId = ObjectId("633764cb7d21000072003da2")
const dbName = 'email';
const request = { url: `/v3/validations/email`, method: 'POST', body: { "email": "example@example.com","source": "signup" }}

async function main() {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('counter');
  //const findResult = await collection.find({_id: myObjectId}).toArray();
  const findResult = await collection.find({ process_date:{"$gt": new Date()} });
  //const dateCounter = findResult.process_date
  //const countCounter = findResult.counts

 // if(new Date(findResult.process_date).getUTCMonth() == new Date().getUTCMonth()){
  console.log("date mongo "+ new Date(findResult.process_date).getMonth())
  console.log("date now "+ new Date().getUTCMonth())

  if(new Date(findResult.process_date).getMonth() == new Date().getUTCMonth()){
       if(findResult.counts>=5000){
        return "no se puede hacer peticiones porque sobrepasa la cantidad permitida"
        }
        else{
         await collection.updateOne({_id: findResult._id}, { $set: { counts: findResult.counts + 1 } ,$setOnInsert: {  process_date: new Date() } });
         await clientSendGrid.request(request)
          .then(([response, body]) => {
            if(response.body.result.verdict == "Invalid"){
                console.log(`hay ${findResult.counts} count y el correo es ${response.body.result.verdict} el proceso se detiene y se incrementa 1 quedando el count = ${findResult.counts + 1}`);
            }else{
                console.log(`hay ${findResult.counts} count y el correo es ${response.body.result.verdict} y se incrementa 1 quedando el count = ${findResult.counts + 1}`)
            }
          })
          .catch(error => {
            console.error(error);
          });
        }
  }else{
    await collection.insertOne( { counts: 1 ,process_date: new Date() }  );
         await clientSendGrid.request(request)
          .then(([response, body]) => {
            if(response.body.result.verdict == "Invalid"){
                console.log(`comienza un nuevo mes y el count se reseteo a 1, el correo es ${response.body.result.verdict} el proceso se detiene y se incrementa 1 quedando el count = ${findResult.counts + 1}`);
            }else{
                console.log(`comienza un nuevo mes y el count se reseteo a 1, el correo es ${response.body.result.verdict} y se incrementa 1 quedando el count = ${findResult.counts + 1}`)
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


