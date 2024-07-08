const path = require('path')
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const SimServer = require('./src/controller')
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config()

// Import router từ file index.js
// Sử dụng router với prefix /api
const app = express();
const server = http.createServer(app);
// ewr
// app.use(express.static(path.join(__dirname, 'public')));
// Phân tích nội dung yêu cầu từ dạng JSON
app.use(cors());
// Phân tích nội dung yêu cầu từ dạng x-www-form-urlencoded
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Bot tele
const token = process.env.BOT_TELEGRAM_TOKEN;

// Ví dụ sử dụng lớp SimServer
const serverRoom = new SimServer();
// Tạo một bot mới sử dụng polling để nhận tin nhắn
const bot = new TelegramBot(token, { polling: true });

// Lắng nghe mọi tin nhắn và phản hồi
bot.on('message',async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    console.log(serverRoom)
    let objectItem = await serverRoom.findById(chatId)
    console.log(objectItem)
    let expl = text.split(' ')[0]
    switch(expl){
        case "/start":{
            let help = "Command Help:\n"
            help += "/set {phone}   : Cài đặt số điện thoại\n"
            help += "/show   : Xem số hiện tại\n"
            help += "/clear   : Xóa cài đặt hiện tại\n"
            bot.sendMessage(chatId, help);
        };break;
        case "/set":{
            console.log(expl)
            if(text.split(' ').length > 1 && text.split(' ')[1].length > 5){
                // phone 
                serverRoom.add(chatId,text.split(' ')[1].trim())
                bot.sendMessage(chatId, `Added: ${text.split(' ')[1].trim()}`);
            }else{
                bot.sendMessage(chatId, `Where is phone?`);
                return
            }
        };break;
        case "/show":{
            if(objectItem){
                bot.sendMessage(chatId, `Phone: ${objectItem.phone}`);
            }else{
                bot.sendMessage(chatId, `Need setup`);
            }
        };break;
        case "/clear":{
            if(objectItem){
                serverRoom.remove(chatId)
                bot.sendMessage(chatId, `Done`);
            }else{
                bot.sendMessage(chatId, `No setup`);
            }
        };break;
        default:{
            bot.sendMessage(chatId, `No command`);
        };break
    }
    // Gửi phản hồi
    // bot.sendMessage(chatId, `Bạn vừa gửi: ${text}`);
});

console.log('Bot đang chạy...');

// API POST dữ liệu 
app.post('/api/send-message', async (req, res) => {
    const { message } = req.body;
    let dataSplit = message.split(':')
    if(dataSplit.length > 1){
        let result = await serverRoom.findOne(dataSplit[0].trim())
        console.log(result)
        if(result){
            await bot.sendMessage(result, dataSplit[1].trim());
            return res.json({ error: 'done' });
        }else{
            return res.status(400).json({ error: 'Not found room' });
        }
    }else{
        return res.status(400).json({ error: 'Missing chatId or message' });
    }
});
// Khi có một kết nối mới được thiết lập
const PORT = 1234;

server.listen(PORT, () => console.log(`Server running on port localhost:${PORT}`));
