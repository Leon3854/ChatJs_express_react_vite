import './AuthUser.component.css'
import { useState, useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth.js'
import { BsDoorClosed } from 'react-icons/bs'
import { RiDoorOpenLine } from 'react-icons/ri'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

function AuthUser({ onLogin, isAuthenticated, onLogout }) {
	const serverUrl = import.meta.env.VITE_SERVER_URL
	const { login } = useAuth()
	const [show, setShow] = useState(false)
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	const handleSubmit = async e => {
		e.preventDefault()
		setError(null)

		try {
			const response = await fetch(`${serverUrl}/auth/login`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ email, password })
			})

			if (!response.ok) {
				throw new Error('Ошибка авторизации. Проверьте email и пароль.')
			}
			const data = await response.json()

			// Логиним пользователя
			login(data)
			// Сохраняем токен и аватар
			localStorage.setItem('token', data.token)
			localStorage.setItem('accessToken', data.accessToken)
			localStorage.setItem('refreshToken', data.refreshToken)
			localStorage.setItem('avatar', data.user.avatar)
			// Передаем URL аватара в родительский компонент
			onLogin(data.user.avatar)
			handleClose()
			// Обновляем страницу после успешного входа
			window.location.reload()
		} catch (error) {
			setError(error.message)
		}
	}

	const handleLogout = () => {
		if (typeof onLogout === 'function') {
			onLogout() // Вызов функции выхода
		}
		handleClose() // Закрыть модальное окно после выхода
	}

	// Используем useEffect для сброса ошибок при изменении состояния аутентификации
	useEffect(() => {
		if (isAuthenticated) {
			setError(null) // Сбросить ошибку при успешной аутентификации
		}
	}, [isAuthenticated])

	return (
		<>
			<div className="auth-user-wrapper">
				<div className="auth-user">
					<Button
						type="button"
						className="btn btn-link btn-nav"
						onClick={handleShow}
					>
						{isAuthenticated ? (
							<RiDoorOpenLine className="auth-icon" />
						) : (
							<BsDoorClosed className="auth-icon" />
						)}
					</Button>
				</div>
				<Modal show={show} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>
							{isAuthenticated ? 'Выход' : 'Авторизация'}
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						{error && <div className="error-message">{error}</div>}
						{!isAuthenticated ? (
							<Form onSubmit={handleSubmit}>
								<Form.Group controlId="formBasicEmail">
									<Form.Label>Email address</Form.Label>
									<Form.Control
										type="email"
										placeholder="Email"
										value={email}
										onChange={e => setEmail(e.target.value)}
										required
									/>
								</Form.Group>
								<Form.Group controlId="formBasicPassword">
									<Form.Label>Password</Form.Label>
									<Form.Control
										type="password"
										placeholder="Password"
										value={password}
										onChange={e => setPassword(e.target.value)}
										required
									/>
								</Form.Group>
								<Button variant="primary" type="submit" className="handl-btn">
									Sign in
								</Button>
							</Form>
						) : (
							<div>
								<p>Вы уверены, что хотите выйти?</p>
								<Button variant="secondary" onClick={handleLogout}>
									Sign out
								</Button>
							</div>
						)}
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
						{!isAuthenticated && (
							<Button variant="primary" onClick={handleClose}>
								Sign up
							</Button>
						)}
					</Modal.Footer>
				</Modal>
			</div>
		</>
	)
}

export default AuthUser
