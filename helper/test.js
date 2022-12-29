module.exports = {
    success:()=>{
            return({
                responseMessage: "Success...!!",
                responseCode: 200,
            });
    },
    Created:()=>{
        return({
            responseMessage: "Created...!!",
            responseCode: 201,
        });
    },
    Accepted:()=>{
        return({
            responseMessage: "Accepted...!!",
            responseCode: 202,
        });
    },
    Bad_Request:()=>{
        return({
            responseMessage: "Bad Request.!!",
            responseCode: 404,
        });
    },

    Unauthorized:()=>{
        return({
            responseMessage: "Unauthorized Access...!!",
            responseCode: 401,
        });
    },

    Payment_Required:()=>{
        return({
            responseMessage: "Payment Required...!!",
            responseCode: 402,
        });
    },

    Server_Error:()=>{
        return({
            responseMessage: "Internal Server Error...!!",
            responseCode: 500,
        });
    },

    Bad_Gateway:()=>{
        return({
            responseMessage: "Bad Gateway...!!",
            responseCode: 502,
        });
    },

    Service_Unavailable:()=>{
        return({
            responseMessage: "Service Unavailable...!!",
            responseCode: 503,
        });
    },

    Gateway_Timeout:()=>{
        return({
            responseMessage: "GateWay Time out....!!",
            responseCode: 504,
        });
    },
    Not_Extended:()=>{
        return({
            responseMessage: "Not Extended....!!",
            responseCode: 510,
        });
    },
}