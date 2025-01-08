import { useState, useEffect } from 'react'

export const useAuth = () => {
	const [isAuth, setIsAuth] = useState(false)
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Проверяем наличие токена в локальном хранилище при монтировании компонента
		const token = localStorage.getItem('token')
		if (token) {
			// Если токен есть, считаем пользователя аутентифицированным
			setIsAuth(true)
			// Здесь можно добавить логику для получения данных пользователя по токену
			// Например, декодировать токен и установить данные пользователя в состояние
			// setUser (decodedUser );
		}
		setLoading(false)
	}, [])

	const login = userData => {
		setIsAuth(true)
		setUser(userData)
		// Сохраняем токен в локальном хранилище
		localStorage.setItem('token', userData.token)
	}

	const logout = () => {
		setIsAuth(false)
		setUser(null)
		// Удаляем токен из локального хранилища
		localStorage.removeItem('token')
	}

	return {
		isAuth,
		user,
		loading,
		login,
		logout
	}
}
