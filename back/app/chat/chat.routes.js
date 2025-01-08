import express from 'express';
import { protect } from '../../app/middleware/auth.middleware.js';
import { createNewChat, getAllChats, getChatId, deleteChat, changeNameChat, chatsCurrentUser, } from './chat.controller.js';

const router = express.Router();

// Маршрут для создания нового чата.
router.route('/').post(protect, createNewChat);

// Маршрут для получения всех чатов.
router.route('/').get(protect, getAllChats)

// Маршрут для получения чата по айди.
router.route('/:id').get(protect, getChatId)

// Маршрут для получения всех чатов по айди пользователя
router.route('/users/me/chats').get(protect, chatsCurrentUser)

// Маршрут для изменения названая чата
router.route('/:id').patch(protect, changeNameChat);




// Маршрут для удаления чата
router.route('/:id').delete(protect, deleteChat);

export default router;
