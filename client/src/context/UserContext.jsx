import { createContext, useState, useContext, useEffect } from 'react'

const serverUrl = import.meta.env.VITE_SERVER_URL

// Создаем контекст
const UserContext = createContext()
console.log('Server URL:', serverUrl)

// Создаем провайдер для контекста
const UserProvider = ({ children, initialUserId }) => {
	const [selectedUser, setSelectedUser] = useState({ id: null, name: '' })
	const [currentUser, setCurrentUser] = useState(null) // Добавляем состояние для текущего пользователя
	const [messages, setMessages] = useState([])
	const [inputText, setInputText] = useState()
	const [chatId, setChatId] = useState(null)
	const [selectedImage, setSelectedImage] = useState(null) // Состояние для хранения изображения

	// Используем useEffect для установки currentUser
	useEffect(() => {
		if (initialUserId) {
			const fetchCurrentUser = async () => {
				try {
					const response = await fetch(`${serverUrl}/users/${initialUserId}`)
					if (response.ok) {
						const data = await response.json()
						console.log('Current user data:', data.user) // Логирование данных пользователя
						setCurrentUser(data.user) // Устанавливаем текущего пользователя
					} else {
						console.error('Ошибка при получении текущего пользователя')
					}
				} catch (error) {
					console.error('Ошибка при выполнении запроса:', error)
				}
			}
			fetchCurrentUser()
		}
	}, [initialUserId])

	const loginUser = async credentials => {
		const response = await fetch(`${serverUrl}/login`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(credentials)
		})

		if (response.ok) {
			const data = await response.json()
			setCurrentUser(data.user) // Устанавливаем текущего пользователя
			localStorage.setItem('accessToken', data.accessToken)
		} else {
			// Обработка ошибок
		}
	}

	const addMessage = message => {
		setMessages(prevMessages => [...prevMessages, message])
	}

	const removeMessage = messageId => {
		setMessages(prevMessages =>
			prevMessages.filter(msg => msg.id !== messageId)
		)
	}

	const clearInput = () => {
		setInputText('')
	}

	const handleUserSelect = async (user, chatId) => {
		if (!user || !user.id || !chatId) {
			console.error('Invalid parameters:', { user, chatId })
			return
		}
		// Устанавливаем выбранного пользователя
		// setSelectedUser(user)

		const userWithUpdatedAt = {
			...user,
			updatedAt: new Date().toLocaleString() // Пример, как можно установить updatedAt
		}
		setSelectedUser(userWithUpdatedAt)

		// Устанавливаем chatId
		setChatId(chatId) // Устанавливаем chatId здесь

		// Сбрасываем сообщения перед загрузкой новых
		setMessages([])

		const token = localStorage.getItem('accessToken')
		const headers = {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json'
		}

		console.log('Fetching messages for user ID:', chatId)
		const response = await fetch(`${serverUrl}/messages/${chatId}`, {
			method: 'GET',
			headers: headers
		})

		if (!response.ok) {
			const errorData = await response.json()
			throw new Error('Ошибка при получении сообщений: ' + errorData.message)
		}
		const messagesData = await response.json()
		if (messagesData.length > 0) {
			messagesData.forEach(message => addMessage(message))
		} else {
			console.log('No messages found for this user.')
		}
	}

	const sendMessage = async content => {
		const accessToken = localStorage.getItem('accessToken')
		const userId = selectedUser.id // Получаем userId из контекста

		if (!accessToken) {
			console.error(
				'Токен доступа отсутствует. Пользователь не аутентифицирован.'
			)
			return
		}

		if (!chatId) {
			console.error('chatId отсутствует. Пожалуйста, выберите чат.')
			return
		}

		const formData = new FormData()
		if (typeof content === 'string') {
			formData.append('content', content) // Добавляем текстовое сообщение
		} else if (content instanceof File) {
			formData.append('image', content) // Добавляем изображение
		}

		try {
			const response = await fetch(
				`${serverUrl}/messages/${userId}/${chatId}`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${accessToken}` // Используйте accessToken
					},
					body: JSON.stringify({ content: content })
				}
			)

			if (response.ok) {
				const data = await response.json()
				console.log('Сообщение успешно отправлено:', data)
				addMessage(data) // Добавляем отправленное сообщение в состояние
			} else {
				const errorText = await response.text()
				console.error('Ошибка при отправке сообщения:', errorText)
			}
		} catch (error) {
			console.error('Ошибка при отправке сообщения:', error)
		}
	}

	return (
		<UserContext.Provider
			value={{
				loginUser,
				selectedUser,
				setSelectedUser,
				currentUser, // Добавляем currentUser  в контекст
				setCurrentUser,
				messages,
				addMessage,
				removeMessage,
				inputText,
				setInputText,
				clearInput,
				chatId,
				setChatId,
				sendMessage,
				handleUserSelect
			}}
		>
			{children}
		</UserContext.Provider>
	)
}

// Хук для использования контекста
export const useUser = () => {
	return useContext(UserContext)
}

export { UserContext, UserProvider }
