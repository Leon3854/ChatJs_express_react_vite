import asyncHandler from 'express-async-handler'
import { prisma } from '../prisma.js'
import { generateToken, generateRefreshToken } from './generate-token.js'
import { hash, verify } from 'argon2'
import { faker } from '@faker-js/faker'
import { UserFields } from '../utils/users.utils.js'

// @desc Auth user
// @route POST/api/auth/login
// @access Public
export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	// console.log('Email:', email);
	// console.log('Password:', password);

	const user = await prisma.user.findUnique({
		where: { email }
	});
	if (!user) {
		res.status(401);
		throw new Error('User not found');
}
	// console.log('User found:', user);

	const isValidPassword = await verify(user.password, password);

	if (user && isValidPassword) {
		const refreshToken = generateRefreshToken(user.id);
		await prisma.user.update({
			where: { id: user.id },
		 data:{ refreshToken },
		})
		const accessToken = generateToken(user.id)
		res.json({ user, accessToken });
	} else {
		res.status(401);
		throw new Error('Email and password are not correct');
	}
});

// @desc Register new user
// @route POST /api/auth/refresh
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
	const { email, nickname, password} = req.body

	const isHaveUser = await prisma.user.findUnique({
		where: {
			email
		}
	})

	if (isHaveUser) {
		res.status(400)
		throw new Error('User already exists')
	}

	const refreshToken = generateRefreshToken()
	const user = await prisma.user.create({
		data: {
			email,
			name: faker.person.fullName(),
			nickname,
			password: await hash(password),
			phone: faker.phone.number({ style: 'international' }),
			avatar: faker.image.avatar(),
			refreshToken,
		},
		select: UserFields
	})

	const accessToken = generateToken(user.id)

	res.json({ user, accessToken, refreshToken })
})

// @desc Refresh token
// @route POST /api/auth/refresh
// @access Public
// export const refreshToken = asyncHandler(async (req, res) => {
// 	const { refreshToken } = req.body;

// 	if (!refreshToken) {
// 			res.status(401);
// 			throw new Error('Refresh token is required');
// 	}

// 	// Декодируем refreshToken
// 	const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
// 	const user = await prisma.user.findUnique({
// 			where: { id: decoded.userId }
// 	});

// 	// Проверяем, существует ли пользователь и соответствует ли refreshToken
// 	if (!user || user.refreshToken !== refreshToken) {
// 			res.status(403);
// 			throw new Error('Invalid refresh token');
// 	}

// 	// Генерируем новый refreshToken
// 	const newRefreshToken = generateRefreshToken(); // Функция для генерации нового токена

// 	// Обновляем refreshToken в базе данных
// 	await prisma.user.update({
// 			where: { id: user.id },
// 			data: { refreshToken: newRefreshToken } // Используем data для обновления
// 	});

// 	// Получаем обновленные данные пользователя
// 	const updatedUser  = await prisma.user.findUnique({
// 			where: { id: user.id }
// 	});

// 	console.log('Обновленные данные пользователя:', updatedUser );

// 	// Генерируем новый accessToken
// 	const accessToken = generateToken(user.id);
	
// 	// Возвращаем новый accessToken и refreshToken
// 	res.json({ user: updatedUser , accessToken, refreshToken: newRefreshToken });
// });


// @desc Delete auth user
// @route DELETE/api/auth/:id
// @access Public
export const deleteUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;
	// console.log('Email: ', email);
	// console.log('Password: ', password);
	try {
			const user = await prisma.user.findUnique({
					where: {
							email,
					},
			});
			if (!user) {
					res.status(404);
					throw new Error('The User not found!');
			}

			// Используем argon2 для проверки пароля
			const isPasswordValid = await verify(user.password, password);
			if (!isPasswordValid) {
					res.status(401);
					throw new Error('Invalid password');
			}

			await prisma.user.delete({
					where: {
							email,
					},
			});
			res.json({ message: 'User deleted!' });
	} catch (error) {
			res.status(500).json({ message: error.message });
	}
});



