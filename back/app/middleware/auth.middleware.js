import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import { prisma } from '../prisma.js'
import { UserFields } from '../utils/users.utils.js'

/*export const protect = asyncHandler(async (req, res, next) => {
  console.log("Request parameters:", req.params); // Отладочная информация
  let token;

  // Проверка наличия токена
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      // Декодирование токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Поиск пользователя в базе данных
      const userFound = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: UserFields,
      });

      if (userFound) {
        req.user = userFound; // Добавление пользователя в объект запроса
        
        // Установка currentChatId из тела запроса
        req.currentChatId = req.body.chatId || null;

        return next(); // Передача управления следующему middleware
      } else {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token is invalid');
    }
  } else {
		
	}

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});*/


export const protect = asyncHandler(async (req, res, next) => {
  console.log("Request parameters:", req.params); // Отладочная информация
  let token;

  // Проверка наличия токена
  if (req.headers.authorization && req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      // Декодирование токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Поиск пользователя в базе данных
      const userFound = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: UserFields,
      });

      if (userFound) {
        req.user = userFound; // Добавление пользователя в объект запроса
        
        // Установка currentChatId из тела запроса
        req.currentChatId = req.body.chatId || null;

        return next(); // Передача управления следующему middleware
      } else {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token is invalid');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});





/*export const protect = asyncHandler(async (req, res, next) => {
  console.log("Request parameters:", req.params); // Отладочная информация
  let token;

  // Проверка наличия токена
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];

    try {
      // Декодирование токена
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Поиск пользователя в базе данных
      const userFound = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: UserFields,
      });

      if (userFound) {
        req.user = userFound; // Добавление пользователя в объект запроса
        
        // Установка currentChatId из тела запроса
        req.currentChatId = req.body.chatId || null;

        return next(); // Передача управления следующему middleware
      } else {
        res.status(401);
        throw new Error('Not authorized, token failed');
      }
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token is invalid');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});*/
