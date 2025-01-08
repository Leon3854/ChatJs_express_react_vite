import asyncHandler from 'express-async-handler'
import {prisma} from '../prisma.js'

//  @desc Get all chats
// @route GET /api/chats
// @access Private
export const getAllChats = asyncHandler(async (req, res) => {
	try {
			const chats = await prisma.chat.findMany({
					include: {
							user_chat_creatorIdToUser: { // Исправлено имя отношения
									select: {
											id: true,
											name: true,
											avatar: true
									},
							},
							messages: true, // Если нужно получить сообщения, можно оставить
							users: true,    // Если нужно получить всех пользователей чата
							info: true, 
					}
			});

			res.json(chats);
	} catch (error) {
			console.error(error);
			res.status(500).json({ error: 'Ошибка при получении чатов' });
	}
});

// @desc Get the chat by id
// @route GET/api/chats/:id
//  @access Private
export const getChatId = asyncHandler(async(req, res) => {
	// Получаем ID из параметров запроса
	const {id} = req.params; 

	try{
		const chat = await prisma.chat.findUnique({
			// Ищем чат по ID.
			where: { id: parseInt(id) }, 
		})

		if (!chat) {
			return res.status(404).json({message: "Чат не найден"})
		}
		// Возвращаем найденный чат
		res.json(chat); 
	}catch(error){
		console.error(error)
		res.status(500).json({error: "Ошибка при получении чата!"})
	}
})

// @desc Get all chats for the current user
// @route GET /api/users/me/chats
// @access Private
export const chatsCurrentUser = asyncHandler(async(req, res) => {

	try {
		const userId = req.user.id
		const chats = await prisma.chat.findMany({
			where: {
				users: {
					// Get only chats where current user do
					some: {id: userId}
				}
			}
		})
		res.json(chats)
	} catch(error) {
		console.log(error)
		res.status(500).json({error: 'Ошибка при получении чатов для текущего пользователя'})
	}
})

// @desc Create new chat
// @route POST /api/chats/
// @access Private
export const createNewChat = asyncHandler(async (req, res) => {
  // Получаем данные из тела запроса
  const { participantIds, name, lastMessage, type, phoneNumbers } = req.body;
  // Получаем ID текущего пользователя из req.user
  const creatorId = req.user.id;

  // Проверка входных данных
  if (!Array.isArray(participantIds) || participantIds.length === 0) {
    return res.status(400).json({ message: 'Неверные данные для создания чата!' });
  }

  // Получаем информацию о пользователе, чтобы получить аватар
  const creator = await prisma.user.findUnique({
    where: { id: creatorId },
    select: { avatar: true }, // Извлекаем только аватар
  });

  if (!creator) {
    return res.status(404).json({ message: 'Пользователь не найден' });
  }

  try {

		const newChat = await prisma.chat.create({
      data: {
        name,
        lastMessage: lastMessage ? lastMessage.split(' ').slice(0, 4).join(' ') : '',
        type,
        avatar: creator.avatar,
        phoneNumbers: phoneNumbers || [],
        users: {
          connect: participantIds.map((id) => ({ id })), 
        },
        user_chat_creatorIdToUser: { // Исправлено здесь
          connect: { id: creatorId }, // Подключаем создателя
        },
        // lastMessageId: lastMessageId || null, // Добавьте это, если у Вас есть lastMessageId
			}
    });
    
    res.status(201).json(newChat);
  } catch (error) {
    console.error('Ошибка при создании чата: ', error);
    res.status(500).json({ message: 'Ошибка при создании чата', error });
  }
});

// @desc Change the chat
// @route PATCH/api/chats/:id
// @access Private
export const changeNameChat = asyncHandler(async(req, res) => {
	const {id} = req.params
	const {name} = req.body

	if (isNaN(id) || id <= 0){
		return res.status(400).json({ error: 'Неверный формат ID' });
	}

	if (!name || typeof name !== 'string') {
		return res.status(400).json({ error: 'Имя не может быть пустым или не строкой ' });
	}

	try{
		const chat = await prisma.chat.findUnique({
			 where: { id: parseInt(id) }
			})
			if (!chat) {
				return res.status(404).json({message: "Чат не найден"})
			}
			// Обновляем имя
			const updatedChat = await prisma.chat.update({
				where: { id: Number(id) },
				data: { name }, // Обновляем только имя
			});
			// Возвращаем найденный чат
			res.json(updatedChat); // Возвращаем обновленное имя
			

	}catch(error){
		console.error(error)
		res.status(500).json({error: "Ошибка при обновлении имени чата!"})
	}
})

// @desc Delete chat
// @route DELETE /api/chats/:id
// @access Private
export const deleteChat = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Проверка, является ли id числом
  if (isNaN(id) || Number(id) <= 0) {
    return res.status(400).json({ error: 'Некорректный ID чата' });
  }

  try {
    // Проверяем, существует ли чат
    const chat = await prisma.chat.findUnique({
      where: { id: Number(id) },
    });

    if (!chat) {
      return res.status(404).json({ error: 'Чат не найден' });
    }

    // Удаляем все сообщения, связанные с чатом
    await prisma.message.deleteMany({
      where: { chatId: Number(id) },
    });

    // Удаляем чат
    await prisma.chat.delete({
      where: { id: Number(id) },
    });

    res.status(204).send(); // Успешное удаление, без содержимого в ответе
  } catch (error) {
    console.error(error); // Логирование ошибки
    res.status(500).json({ error: 'Ошибка при удалении чата' });
  }
});


/*



export const changeNameChat = asyncHandler(async(req, res) => {
	const {id} = req.params
	const {name} = req.body

	if (isNaN(id) || id <= 0){
		return res.status(400).json({ error: 'Неверный формат ID' });
	}

	if (!name || typeof name !== 'string') {
		return res.status(400).json({ error: 'Имя не может быть пустым или не строкой ' });
	}

	try{
		const chat = await prisma.chat.findUnique({
			 where: { id: parseInt(id) }
			})
			if (!chat) {
				return res.status(404).json({message: "Чат не найден"})
			}
			// Обновляем имя
			const updatedChat = await prisma.chat.update({
				where: { id: Number(id) },
				data: { name }, // Обновляем только имя
			});
			// Возвращаем найденный чат
			res.json(updatedChat); // Возвращаем обновленное имя
			

	}catch(error){
		console.error(error)
		res.status(500).json({error: "Ошибка при обновлении имени чата!"})
	}
})

*/
