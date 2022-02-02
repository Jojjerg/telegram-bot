const TelegramBot = require('node-telegram-bot-api')
const token = '5256724431:AAG4XHgxwtEGbus3HvSu31s0RNsaUFgNcaQ'
const bot = new TelegramBot(token, { polling: true })
const { gameOption, againOption } = require('./option')

const chats = {}

const startGame = async (chatId) => {
        await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен(на) отгадать')
        const randomNumber = Math.floor(Math.random() * 10)
        chats[chatId] = randomNumber
        await bot.sendMessage(chatId, 'Отгадывай', gameOption)
}

const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начать общение'},
        { command: '/info', description: 'Получить информацию о пользователе'},
        { command: '/game', description: 'Запустить игру'}
    ])
    bot.on('message', async msg => {
        const command = msg.text
        const chatId = msg.chat.id
    
        if(command === '/start'){ 
            console.log(msg)
           await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/96b/f1e/96bf1eca-a75d-3b7c-b620-bb5f2cdac89f/1.webp')
           return bot.sendMessage(chatId, 
                    `Добро пожаловать в мой первый телеграмм-бот!`
                )
        }

        if(command === '/info'){
            return bot.sendMessage(chatId, `Тебя зовут: ${msg.from.first_name} твое имя пользователя: ${msg.from.username}`)
        }

        if(command === '/game'){
            return startGame(chatId)
        }

        return bot.sendMessage(chatId, 'Я тебя не понимаю, давай по новой')
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatId = msg.message.chat.id
        if(data === '/again'){
            return startGame(chatId)
        }
        if(data == chats[chatId]){
            await bot.sendMessage(chatId, `Ты угадал цифру ${chats[chatId]}`, againOption)
            
        }
        else{
            await bot.sendMessage(chatId, `Ты не угадал цифру ${chats[chatId]}, твой ответ ${data}`, againOption)
        }
    })
}

start()