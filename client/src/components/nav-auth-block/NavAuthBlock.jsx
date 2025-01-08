import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import AuthUser from '../auth-user/AuthUser.jsx'
import AvatarUser from '../avat-user/AvatarUser.jsx'
import UserMenu from '../user-navigate/UserMenu'

function NavAuthBlock() {
	const { isAuth, logout } = useAuth()
	const [avatar, setAvatar] = useState('avatar.webp')

	// Используем useEffect для получения аватара при монтировании компонента
	useEffect(() => {
		const savedAvatar = localStorage.getItem('avatar')
		if (savedAvatar) {
			setAvatar(savedAvatar)
		}
	}, [])

	// Используем useEffect для обновления аватара при изменении аутентификации
	useEffect(() => {
		if (isAuth) {
			const savedAvatar = localStorage.getItem('avatar')
			if (savedAvatar) {
				setAvatar(savedAvatar)
			}
		}
	}, [isAuth]) // Запускаем каждый раз при изменении isAuth

	// Функция для обновления состояния аутентификации и URL аватара
	const handleLogin = url => {
		setAvatar(url)
		localStorage.setItem('avatar', url) // Сохраняем аватар в localStorage
	}

	const handleLogout = () => {
		logout() // Вызов функции logout из useAuth
		setAvatar('avatar.webp') // Возвращаем к статичному изображению
		localStorage.removeItem('avatar') // Очищаем аватар из localStorage
	}
	return (
		<div className="col-nav">
			<div className="nav-wrapper">
				<div className="avatar-nav">
					{isAuth ? (
						<>
							<AvatarUser avatar={avatar} />
						</>
					) : (
						<div className="avatar">
							{' '}
							{/* Заглушка для аватара */}
							<img src="avatar.webp" alt="avatar any" />
						</div>
					)}
					<UserMenu onLogout={handleLogout} />
				</div>
			</div>

			<AuthUser
				onLogin={handleLogin}
				isAuthenticated={isAuth}
				onLogout={handleLogout}
			/>
		</div>
	)
}

export default NavAuthBlock

// 	return (
// 		<div className="col-nav">
// 			<div className="nav-wrapper">
// 				<div className="avatar-nav">
// 					{isAuth && <AvatarUser avatar={avatar} />}
// 					<UserMenu onLogout={handleLogout} />
// 				</div>
// 			</div>

// 			{/* Передаем функции и состояния в AuthUser  */}
// 			<AuthUser
// 				onLogin={handleLogin}
// 				isAuthenticated={isAuth}
// 				onLogout={handleLogout}
// 			/>
// 		</div>
// 	)
// }

// export default NavAuthBlock
