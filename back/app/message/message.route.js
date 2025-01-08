import express from 'express'
import { protect } from '../../app/middleware/auth.middleware.js';
import { createMessage, updateMessage, addNewMessage, deleteMessage, getAllMessagesForChat, } from './message.controller.js';

const router = express.Router()

// Маршрут для создания сообщения
router.route('/:chatId').post(protect, createMessage)

// Обновлние сообщения по айди
router.route('/:id/:chatId').patch(protect, updateMessage)

// Add new message
router.route('/:id/:chatId').post(protect, addNewMessage)

// Удаление сообщения
router.route('/:id/:chatId').delete(protect, deleteMessage)

// Получение всех сообщений 
router.route('/:chatId').get(protect, getAllMessagesForChat)

export default router