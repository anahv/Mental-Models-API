const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const mongoose = require("mongoose")

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb+srv://ana-admin:Test123@cluster0.i4tx1.mongodb.net/nuggetDB?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const nuggetSchema = {
    title: String,
    content: String,
    example: String
}

const Nugget = mongoose.model("Nugget", nuggetSchema)

//use app.route to chain up the methods!

//// in postman you have to click "www-form-encoded because that's what body-parser is set to understand!

app.route("/nuggets")
    .get(function (req, res) {
        Nugget.find({}, function (err, foundNuggets) {
            if (!err) {
                res.send(foundNuggets)
            } else {
                res.send(err)
            }
        })
    })
    .post(function (req, res) {

        const title = req.body.title
        const content = req.body.content
        const example = req.body.example

        const newNugget = new Nugget({
            title: title,
            content: content,
            example: example
        })

        newNugget.save(function (err) {
            if (!err) {
                res.send("Added a new nugget!")
            } else {
                res.send(err)
            }
        })

    })
    .delete(function (req, res) {
        Nugget.remove({}, function (err) {
            if (err) {
                res.send(err)
            } else {
                res.send("Removed all nuggets!")
            }
        })
    })


app.route("/nuggets/:id")
    .get(function (req, res) {
        const nuggetId = req.params.id
        Nugget.findOne({
            _id: nuggetId
        }, function (err, foundNugget) {
            if (foundNugget) {
                res.send(foundNugget)
            } else {
                res.send("No nuggets matching that ID were found")
            }
        })
    }) // could have used findByIdAndUpdate
    .put(function (req, res) {
        const nuggetId = req.params.id
        const title = req.body.title
        const content = req.body.content
        const example = req.body.example
        Nugget.updateOne({
                _id: nuggetId
            }, {
                title: title,
                content: content,
                example: example
            }, {
                overwrite: true
            },
            function (err) {
                if (err) {
                    res.send(err)
                } else {
                    res.send("Updated nugget " + nuggetId)
                }
            })
    }) 
    .patch(function (req, res) {
        const nuggetId = req.params.id
        const content = req.body.content
        Nugget.updateOne({
            _id: nuggetId
        }, {
            $set: {
                content: content
            }
        }, function (err) {
            if (err) {
                res.send(err)
            } else {
                res.send("Updated the content of nugget " + nuggetId)
            }
        })
    })
    .delete(function (req, res) {
        const nuggetId = req.params.id
        // could also have used Article.deleteMany()
        Nugget.remove({
            _id: nuggetId
        }, function (err) {
            if (err) {
                res.send(err)
            } else {
                res.send("Removed nugget " + nuggetId)
            }
        })
    })


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port " + port);
});