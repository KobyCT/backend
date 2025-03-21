const axios = require('axios');

exports.sendNotification = async (req, res) => {
    var data = {
        "data": [
            {
                "userId": req.body.userId,
                "text_TH": req.body.text_TH,
                "text_EN": req.body.text_EN,
                "callbackUrl": req.body.callbackUrl || "https://cu-recom-production.up.railway.app/"
            }
        ]
    };

    console.log("Request Data:", JSON.stringify(data, null, 2));

    try {
        let sendNotification = await axios.post(
            `${process.env.GATEWAY}/notification`, 
            data,
            {
                headers: { 
                    "Content-Type": "application/json",
                    "ClientId": process.env.CLIENT_ID,
                    "ClientSecret": process.env.CLIENT_SECRET
                }
            }
        );

        console.log("Full API Response:", sendNotification);
        console.log("Received Data from API:", sendNotification.data);
        res.status(200).json(sendNotification.data);
    } catch (error) {
        console.error("API Request Error:", error.response ? error.response.data : error.message);
        res.status(error.response?.status || 500).json({ error: error.response?.data || "Internal Server Error" });
    }
};
