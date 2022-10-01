const client = require('@sendgrid/client');
require('dotenv').config()
client.setApiKey(process.env.SENDGRID_API_KEY);

const data = {
  "email": "example@example.com",
  "source": "signup"
};

const request = {
  url: `/v3/validations/email`,
  method: 'POST',
  body: data
}

client.request(request)
  .then(([response, body]) => {
    console.log(response.statusCode);
    console.log(response.body);
  })
  .catch(error => {
    console.error(error);
  });