import jwt from 'jsonwebtoken'

export const generateToken = userId =>
	jwt.sign(
		{
			userId
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '7d'
		}
	)


export const generateRefreshToken = userId =>
	jwt.sign(
		{
			userId
		},
		process.env.JWT_SECRET,
		{
			expiresIn: '15d' // Долгий срок действия для refresh token
		}
	);
	