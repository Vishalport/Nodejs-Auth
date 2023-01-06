const config = require("../config/config");
const jwt = require("jsonwebtoken");


module.exports = {
    verifyToken:(req, res, next) => {

        const token = req.body.token || req.headers["authorization"];
        if (!token) {
            res.status(200).send({ responsMessage: "Token is Required..!!", responseCode: 200 });
        }
        try {
            const decode = jwt.verify(token, config.key, function(err, Data){
                if(err) {
                    res.status(403).send(err)
                }
                else {
                    res.status(403).send(Data)
                }
            });
            req.token = decode;
            res.status(200).send("Token: verifyed..!!")
        } catch (error) {
            res.status(400).send("Invalid Token...!!")
        }
        return next();
    },
}

