require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')

const {TOKEN, SERVER_URL} = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL+URI

const app = express()
app.use(bodyParser.json())

const init = async () => {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
    console.log(res.data)
}

app.post(URI, async (req, res, next) => {
    try {
        console.log(req.body);

        const chatID = req.body.message.chat.id;
        const text = req.body.message.text;

        await axios.post(`${TELEGRAM_API}/sendMessage`, {
            chat_id: chatID,
            text: text
        });

        return res.send();
    } catch (error) {
        next(error);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(process.env.PORT || 80, async () => {
    console.log('app running on port', process.env.PORT || 80)
    await init()
})
