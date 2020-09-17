require("dotenv").config();
const CronJob = require("cron").CronJob;
const axios = require("axios");

const schedulerFactory = function() {
  return {
    start: function() {
      new CronJob(
        "0 8 * * *",
        function() {
          console.log("Running Send Notifications Worker");
          fetchModel();
        },
        null,
        true,
        ""
      );
    }
  };
};

async function fetchModel() {
  let randomModel = ""
  await axios.get("https://mental-models.herokuapp.com/nuggets")
    .then(response => {
      let models = response.data
      let randomNumber = Math.floor(Math.random() * 113 + 1);
      randomModel = models[randomNumber];
      console.log(randomModel);
      send(randomModel)
    })
    .catch(error => {
      console.log("Error:" + error);
    });
}

function send(nugget) {
  const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  return client.messages
    .create({
      to: process.env.MY_PHONE_NUMBER,
      from: process.env.TWILIO_PHONE_NUMBER,
      body: `${nugget.title} \n ${nugget.content}`
    })
    .then(message => console.log(`Sent SMS`, message.sid));
}

module.exports = schedulerFactory();
