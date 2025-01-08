import asyncHandler from 'express-async-handler'
import { prisma } from '../prisma.js'
import { UserFields } from '../utils/users.utils.js'
//

// @desc Get all users
// @route GET/api/users
// @access Private
export const getAllUsers = asyncHandler(async(req, res) => {
	try {
		const users = await prisma.user.findMany({
			// Сортировка по дате создания (можно использовать 'desc' для обратного порядка)
			include: {
				info: true, // Включаем информацию о пользователе
		},
			orderBy: {createdAt: 'asc'} 
		}); // Получаем всех пользавателей
		res.json(users);
} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Ошибка при получении пользователей' });
}
})

// @desc 		Get user profile
// @route 	GET/api/users/profile
// @access 	Private
export const getUserProfile = asyncHandler(async (req, res) => {
	const user = await prisma.user.findUnique({
		where: {
			id: req.user.id
		},
		select: UserFields
	})

	if (user) {
		res.json(user);
	} else {
		res.status(404).json({ message: 'User not found' });
	}
})

// @desc 		Get user profile by ID
// @route 	GET /api/users/:id
// @access 	Private (или Public, в зависимости от требований)
export const getUserProfileById = asyncHandler(async (req, res) => {
	// Получаем ID из параметров URL
	const userId = parseInt(req.params.id); 

	const user = await prisma.user.findUnique({
		where: {
			// Ищем пользователя по ID
			id: userId 
		},
		// Убедитесь, что UserFields содержит необходимые поля
		select: UserFields 
	});

	if (user) {
		res.json(user);
	} else {
		res.status(404).json({ message: 'User not found' });
	}
});



export const uploadImages = (req, res) => {
	if (!req.files || req.files.length === 0) {
			return res.status(400).json({ success: false, message: 'Нет загруженных файлов' });
	}

	const filePaths = req.files.map(file => file.path); // Получаем пути к загруженным файлам

	res.json({ success: true, data: filePaths }); // Возвращаем пути к файлам
};
