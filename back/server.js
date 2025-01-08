import 'colors';
import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';  // Импортируем path
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { prisma } from './app/prisma.js';
import authRoutes from './app/auth/auth.routes.js';
import userRoutes from './app/user/user.routes.js';
import messageRoutes from './app/message/message.route.js';
import chatRoutes from './app/chat/chat.routes.js';
import { errorHandler, notFound } from './app/middleware/error.middleware.js';

dotenv.config();
const app = express();

async function main() {
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

	// Настройка CORS
	app.use(cors({
		origin: process.env.CORS_ORIGIN,
		methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
		credentials: true
	}));

	app.use(express.json());
	app.use('/api/auth', authRoutes);
	
	// Обслуживание статических файлов из папки uploads
	// app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));
	app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

	// Подключение маршрутов пользователей.
	app.use('/api/users', userRoutes);
	app.use('/api/messages', messageRoutes);
	app.use('/api/chats', chatRoutes);

	app.use(notFound);
	app.use(errorHandler);

	const PORT = process.env.PORT || 5001;

	app.listen(
		PORT,
		console.log(
			`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.bold
		)
	);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async e => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});


/*








*/
// import 'colors'
// import cors from 'cors'
// import express from 'express'
// import dotenv from 'dotenv'
// import morgan from 'morgan'
// import path from 'path'
// import { prisma } from './app/prisma.js'
// import authRoutes from './app/auth/auth.routes.js'
// import userRoutes from './app/user/user.routes.js'
// import messageRoutes from './app/message/message.route.js'
// import chatRoutes from './app/chat/chat.routes.js'
// import { errorHandler, notFound } from './app/middleware/error.middleware.js'

// dotenv.config()
// const app = express()

// async function main() {
// 	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

// // Настройка CORS
// app.use(cors({
// 	origin: process.env.CORS_ORIGIN,
// 	// origin: 'http://localhost:5173', // Разрешаем запросы только с этого источника
// 	methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], // Разрешаем только определенные методы
// 	credentials: true // Если вам нужны куки, установите это значение в true
// }));

// 	app.use(express.json())
// 	app.use('/api/auth', authRoutes)
	
// 	// Обслуживание статических файлов из папки uploads
// 	// app.use('/uploads', express.static('uploads'))
// 	// Статические файлы из папки uploads доступны по пути /api/uploads
// 	app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// // Подключение маршрутов пользователей.
// 	app.use('/api/users', userRoutes)
// 	app.use('/api/message', messageRoutes)
// 	app.use('/api/chats', chatRoutes)

// 	app.use(notFound)
// 	app.use(errorHandler)

// 	const PORT = process.env.PORT || 5001

// 	app.listen(
// 		PORT,
// 		console.log(
// 			`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green
// 				.bold
// 		)
// 	)
// }
// main()
// 	.then(async () => {
// 		await prisma.$disconnect()
// 	})
// 	.catch(async e => {
// 		console.error(e)
// 		await prisma.$disconnect()
// 		process.exit(1)
// 	})
