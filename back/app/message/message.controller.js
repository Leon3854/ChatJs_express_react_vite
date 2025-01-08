import asyncHandler from 'express-async-handler'
import { prisma } from '../prisma.js'


// @desc Get all messages
// @route GET/api/messages/:chatId
// @access Private
export const getAllMessagesForChat = asyncHandler(async(req, res) => {
	
	const chatId = parseInt(req.params.chatId)

	console.log('Request parameters: ', req.params); // Логируем параметры запроса
	console.log('chatId: ', chatId)

	if (isNaN(chatId)) {
		return res.status(400).json({ error: "Недействительный Chat ID" });
	} 

	try {
			const messages = await prisma.message.findMany({
				where: { chatId: chatId },
				orderBy: { createdAt: 'asc' },
		});

		// Проверяем, есть ли сообщения
		if (messages.length === 0) {
			return res.status(404).json({ message: "Сообщения не найдены для данного чата." });
	}

	res.status(200).json(messages);
	} catch (error) {
		console.error(error); // Логируем ошибку на сервере
    res.status(500).json({ error: 'Ошибка при получения всех сообщений' });
  }
})


// @desc Create a new message
// @route POST /api/message
// @access Private
// тело запроса, содержащие данные сообщения:
// {
  // "content": "Новое сообщение",
  // "chatId": 1 // ID чата, к которому относится это сообщение
// }
export const createMessage = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id; // Получаем идентификатор текущего пользователя
  const chatId = parseInt(req.currentChatId, 10); // Получаем идентификатор текущего чата из контекста

  // Отладочная информация
  // console.log("Current chat ID:", chatId);
	// console.log("User ID:", userId);

  // Проверка на наличие контента и chatId
  if (!content) {
    return res.status(400).json({ error: "Контент не заполнен" });
  }

	if (isNaN(chatId)) {
		return res.status(400).json({ error: "Недействительный Chat ID" });
	}

  try {
    // Проверка существования чата
    const chatExists = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chatExists) {
      return res.status(404).json({ error: "Чат не найден!" });
    }

    // Проверка существования пользователя
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(400).json({ error: "Пользователь не найден" });
    }

    // Создание сообщения
    const message = await prisma.message.create({
      data: {
				chatId,
				userId,
				content,
				chatName: chatExists.name,
      },
    });
		// console.log("Создание сообщения с данными:", {
		// 	content: content,
		// 	chatId: chatId,
		// 	userId: userId,
		// });

		// Обновление счетчика сообщений в модели Chat
    await prisma.chat.update({
      where: { id: chatId },
      data: { messageCount: { increment: 1 } }, // Увеличиваем счетчик сообщений
    });

		// Обновление информации о чате
    await prisma.info.upsert({
      where: { chatId },
      update: {
        messageCount: { increment: 1 }, // Увеличиваем счетчик сообщений
        lastOpened: new Date(), // Обновляем время последнего открытия
        lastMessageStatus: false, // Обновляем статус последнего сообщения
      },
      create: {
        chatId,
        messageCount: 1, // Если записи нет, устанавливаем счетчик в 1
        lastOpened: new Date(), // Устанавливаем время последнего открытия
        lastMessageStatus: false, // Устанавливаем статус последнего сообщения
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Ошибка при создании сообщения:", error);
    res.status(500).json({ error: "Ошибка при создании сообщения", details: error.message });
  }
});

// @desc Add new message
// @route POST/api/messages/:id/:chatId
// @access Private
export const addNewMessage = asyncHandler(async (req, res) => {
  const chatId = parseInt(req.params.chatId, 10);
  const userId = req.user.id;
  const { content } = req.body;

  console.log(`Проверка чата с ID: ${chatId}`);
  console.log(`Проверка пользователя с ID: ${userId}`);

  // Валидация входных данных
  if (!content || typeof content !== 'string' || content.length > 500) { // Пример максимальной длины
    return res.status(400).json({ error: "Содержимое сообщения не может быть пустым и должно быть строкой" });
  }

  try {
    // Проверка существования чата
    const chatExists = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chatExists) {
      return res.status(404).json({ error: "Чат не найден!" });
    }

    // Проверка существования пользователя
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ error: "Пользователь не найден!" });
    }

    // Создание сообщения
    const newMessage = await prisma.message.create({
      data: {
        content,
        userId: parseInt(userId, 10),
        chatId: parseInt(chatId, 10),
        chatName: chatExists.name,
      },
    });

		// Проверка, создано ли сообщение
    if (!newMessage || !newMessage.id) {
      return res.status(500).json({ error: "Не удалось создать сообщение." });
    }

    console.log("Созданное сообщение:", newMessage);

		// Увеличиваем счетчик сообщений в чате
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { 
        messageCount: { increment: 1 },
				lastMessage: content, //Обновляем поле
        lastMessageId: newMessage.id // Обновляем lastMessageId на ID нового сообщения
      },
    });

    // Логируем обновленный чат
    console.log("Обновленный чат:", updatedChat);
		
		// Обновляем информацию о чате
    await prisma.info.upsert({
      where: { chatId },
      update: {
        messageCount: { increment: 1 },
        lastOpened: new Date(),
        lastMessageStatus: false,
      },
      create: {
        chatId,
        messageCount: 1,
        lastOpened: new Date(),
        lastMessageStatus: false,
      },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Ошибка при создании сообщения:", error);
    res.status(500).json({ error: "Ошибка при создании сообщения", details: error.message });
  }
});


// @desc Update Message
// @route PATCH/api/messages/:id/:chatId
// @access Private
export const updateMessage = asyncHandler(async (req, res) => {
  const { content } = req.body; 
  const messageId = parseInt(req.params.id, 10); // Преобразуем в целое число
  const userId = req.user.id;
  const chatId = parseInt(req.params.chatId, 10);

  console.log('Received request to update message:', req.params);
  console.log('Request body:', req.body);
  console.log('userID:', userId);
  console.log('chatId:', chatId);
  console.log('messageId:', messageId);

  if (isNaN(messageId)) { // Проверяем messageId
    return res.status(400).json({ error: 'Неверный формат ID' });
  }

  if (isNaN(chatId)) {
    return res.status(400).json({ error: 'Неверный формат ID чата' });
  }

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return res.status(400).json({ error: 'Содержимое сообщения не может быть пустым' });
  }

  try {
    // Сначала обновляем сообщение
    const updatedMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        content: content,
      },
    });

    // Затем обновляем информацию в модели Info
    const updatedInfo = await prisma.info.update({
      where: {
        chatId: chatId, // Предполагаем, что chatId уникален для Info
      },
      data: {
        lastOpened: new Date(),
        lastMessageStatus: false,
        messageCount: {
          increment: 1, // Увеличиваем счетчик сообщений
        },
      },
    });

    res.status(200).json({ updatedMessage, updatedInfo });

  } catch (error) {
    console.error('Ошибка при обновлении сообщения:', error.message);
    res.status(500).json({ error: 'Ошибка при обновлении сообщения' });
  }
});

// @desc Delete Message
// @route DELETE/api/messages/:id/:chatId
// @access Private
export const deleteMessage = asyncHandler(async (req, res) => {
  const messageId = parseInt(req.params.id, 10); // Преобразуем в целое число
  const userId = req.user.id;
  const chatId = parseInt(req.params.chatId, 10); 

	console.log("userId:", userId)
	console.log('chatId:', chatId )
	console.log('messageId: ', messageId)

	if (isNaN(messageId)) {
		return res.status(400).json({ error: 'Неверный формат ID сообщения' });
	} else if(isNaN(userId)) {
		return res.status(400).json({error: 'Не верный формат Id пользователя'})
	} else if(isNaN(chatId)) {
		return res.status(400).json({error: 'Не верный формат Id чата'})
	}
	
  try {
    // Проверяем, существует ли сообщение
    const message = await prisma.message.findUnique({
      where: { id: messageId},
    });

    if (!message) {
      return res.status(404).json({ error: 'Сообщение не найдено' });
    }

    // Удаляем message
    await prisma.message.delete({
      where: { id: messageId },
    });

		// Обновление статуса последнего сообщения в модели Info (если необходимо)
    const messagesInChat = await prisma.message.findMany({
      where: { chatId: chatId },
    });
		if (messagesInChat.length > 0) {
      // Если остались сообщения, обновляем статус последнего сообщения
      const lastMessage = messagesInChat[messagesInChat.length - 1];
      await prisma.info.update({
        where: { chatId: chatId },
        data: {
          lastMessageStatus: false, // Или другое значение, в зависимости от вашей логики
          updatedAt: new Date(),
        },
      });
    } else {
      // Если сообщений больше нет, можно сбросить статус
      await prisma.info.update({
        where: { chatId: chatId },
        data: {
          lastMessageStatus: null,
          updatedAt: new Date(),
        },
      });
    }

		// Успешное удаление, без содержимого в ответе
    res.status(204).send(); 
  } catch (error) {
		console.error(error); // Логируем ошибку на сервере
    res.status(500).json({ error: 'Ошибка при удалении сообщения' });
  }
});

/*

export const addNewMessage = asyncHandler(async (req, res) => {
  const chatId = parseInt(req.params.chatId, 10);
  const userId = req.user.id;
  const { content } = req.body;

  console.log(`Проверка чата с ID: ${chatId}`);
  console.log(`Проверка пользователя с ID: ${userId}`);

  // Валидация входных данных
  if (!content || typeof content !== 'string' || content.length > 500) { // Пример максимальной длины
    return res.status(400).json({ error: "Содержимое сообщения не может быть пустым и должно быть строкой" });
  }

  try {
    // Проверка существования чата
    const chatExists = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chatExists) {
      return res.status(404).json({ error: "Чат не найден!" });
    }

    // Проверка существования пользователя
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      return res.status(404).json({ error: "Пользователь не найден!" });
    }

    // Создание сообщения
    const newMessage = await prisma.message.create({
      data: {
        content,
        userId: parseInt(userId, 10),
        chatId: parseInt(chatId, 10),
        chatName: chatExists.name,
      },
    });

		// Проверка, создано ли сообщение
    if (!newMessage || !newMessage.id) {
      return res.status(500).json({ error: "Не удалось создать сообщение." });
    }

    console.log("Созданное сообщение:", newMessage);

		// Увеличиваем счетчик сообщений в чате
    const updatedChat = await prisma.chat.update({
      where: { id: chatId },
      data: { 
        messageCount: { increment: 1 },
        lastMessageId: newMessage.id // Обновляем lastMessageId на ID нового сообщения
      },
    });

    // Логируем обновленный чат
    console.log("Обновленный чат:", updatedChat);
		// Обновляем информацию о чате
    await prisma.info.upsert({
      where: { chatId },
      update: {
        messageCount: { increment: 1 },
        lastOpened: new Date(),
        lastMessageStatus: false,
      },
      create: {
        chatId,
        messageCount: 1,
        lastOpened: new Date(),
        lastMessageStatus: false,
      },
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Ошибка при создании сообщения:", error);
    res.status(500).json({ error: "Ошибка при создании сообщения", details: error.message });
  }
});

// @desc Add new message
// @route POST/api/messages/:id/:chatId
// @access Private
export const addNewMessage = asyncHandler(async(req, res) => {
	const chatId = parseInt(req.params.chatId, 10); // Преобразуем в целое число
  const userId = req.user.id;
	const {content} = req.body
	console.log(`Проверка чата с ID: ${chatId}`);
	console.log(`Проверка пользователя с ID: ${userId}`);


	// Валидация входных данных
  if (!content || typeof content !== 'string') {
    return res.status(400).json({ error: "Содержимое сообщения не может быть пустым" });
  }
	try {
		// Проверка существования чата
    const chatExists = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chatExists) {
      return res.status(404).json({ error: "Чат не найден!" });
    }

    // Проверка существования пользователя
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

		if (!userExists) {
      return res.status(404).json({ error: "Пользователь не найден!" });
    }

		// Создание сообщения
    const newMessage = await prisma.message.create({
      data: {
				content: content,
        userId: parseInt(userId, 10), // Преобразуйте id в число
        chatId: parseInt(chatId, 10), // Если у вас есть chatId
				chatName: chatExists.name,
      },
    });
		// Обновление информации о чате
    await prisma.info.upsert({
      where: { chatId },
      update: {
        messageCount: { increment: 1 }, // Увеличиваем счетчик сообщений
        lastOpened: new Date(), // Обновляем время последнего открытия
        lastMessageStatus: false, // Обновляем статус последнего сообщения
      },
			create: {
				chatId,
				messageCount: 1, // Если записи нет, устанавливаем счетчик в 1
				lastOpened: new Date(), // Устанавливаем время последнего открытия
				lastMessageStatus: false, // Устанавливаем статус последнего сообщения
			},
    });
    res.status(201).json(newMessage);
	} catch(error) {
		console.error("Ошибка при создании сообщения:", error);
    res.status(500).json({ error: "Ошибка при создании сообщения", details: error.message });
	}
})



*/