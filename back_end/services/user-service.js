var User = require('../models/users');

login = (req, res) => {
    var user = req.body;
    console.log('login body: ', user)
    User.find({
        email: user.email.trim(),
        password: user.password.trim(),

    })
        .then((result) => {
            console.log('result in login', result)
            res.send(result);
        }, (err) => {
            console.log('Error while fetching')
            res.send(err);
        })
}
signup = (req, res) => {
    let len;
    var user = req.body;
    console.log("signup body", user)
    User.find({})
        .then((result) => {
            len = result.length;
            var newPerson = new User({
                name: user.name,
                email: user.email,
                password: user.password,
                userId: len + 1,
                log:null
            });
            newPerson.save(function (err, userData) {
                if (err)
                    res.send("Error");
                else {
                    res.send(userData);
                    console.log("userData...", userData)
                }
            })
        }, 
    (err) => {
            console.log('Error while fetching')
    }) 
}
emailCheck=(req,res)=>{
    let email=req.body.email;
    User.find({email:email})
    .then((result)=>{
        res.send(result);
    }, (err) => {
        console.log("error in get");
    })
}
log= (req, res) => {
    let userId = req.body.userId;
    let state = req.body.state;
    User.update(
        { userId: userId },
        { $set: { log: state } },
    ).then((result) => {
        res.send(result);
    }, (err) => {
        console.log("error in find and update");
    })
}

module.exports = {
    login,
    signup,
    emailCheck,
    log
}