const mongoose = require("mongoose");
const { settings } = require("../settings/application");

mongoose.connect(settings.mongodb)
.then(() => {
    console.log("Connection to database successful")
})
.catch((Error) => {
    console.log("error connecting to database" + Error.message);
    
});
