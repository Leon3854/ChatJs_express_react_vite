import { useEffect, useState } from 'react'
import { IoCheckmarkDoneOutline } from 'react-icons/io5'
import './UsersGroups.component.css'
import { useUser } from '../../context/UserContext'

function UsersGroups({ serverUrl }) {
	const [chats, setChats] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const { addMessage, currentUser, handleUserSelect } = useUser()

	useEffect(() => {
		const fetchChats = async () => {
			try {
				const token = localStorage.getItem('accessToken')
				const headers = {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
				const response = await fetch(`${serverUrl}/chats`, {
					method: 'GET',
					headers: headers
				})

				if (!response.ok) {
					const errorData = await response.json()
					throw new Error('Ошибка сервера: ' + errorData.message)
				}

				const data = await response.json()
				console.log('Received data from API:', data)
				setChats(data)
			} catch (error) {
				console.error('Ошибка при получении чатов:', error)
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}
		fetchChats()
	}, [serverUrl])

	useEffect(() => {
		// console.log('Chats updated:', chats)
	}, [chats])

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error: {error}</div>

	if (!Array.isArray(chats) || chats.length === 0) {
		return <div>No chats available.</div>
	}

	return (
		<div className="col-inf_groups">
			<h6 className="title-groups">Chats</h6>
			<ul className="groups-list">
				{chats.map(chat => (
					<li
						className="groups-item"
						key={chat.id}
						onClick={() => {
							const user = chat.user_chat_creatorIdToUser
							console.log('Selected user:', user)
							console.log('Current user before selection:', currentUser)

							if (user) {
								handleUserSelect(
									user,
									chat.id,
									serverUrl,
									addMessage,
									currentUser
								)
							} else {
								console.error('User is undefined or null:', {
									user,
									currentUser
								})
							}
						}}
					>
						<div className="groups-item_avatar-title">
							<div className="groups-item_avatar">
								<img
									src={chat.avatar || 'default-avatar.png'}
									alt="avatar-groups"
								/>
							</div>
							<div className="groups-item_main-title">
								<div className="title-group">
									<h4>{chat.name}</h4>
								</div>
								<div className="context-group">
									<h6>{chat.lastMessage || 'No messages yet'}</h6>
								</div>
							</div>
						</div>
						<div className="groups-item_time-quantity">
							<div className="group-item_date">
								<span>{new Date(chat.updatedAt).toLocaleString()}</span>
							</div>
							<div className="group-item_quantity">
								<span
									className={`group-quantity ${chat.messageCount > 0 ? '' : 'none'}`}
								>
									{chat.info && Number.isFinite(chat.info.messageCount)
										? chat.info.messageCount
										: 0}
								</span>
								<span className="group-check-all none">
									<IoCheckmarkDoneOutline />
								</span>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default UsersGroups

/*
04.01.2025
import { useEffect, useState } from 'react'
import { IoCheckmarkDoneOutline } from 'react-icons/io5'
import './UsersGroups.component.css'
import { useUser } from '../../context/UserContext'

function UsersGroups({ serverUrl }) {
	const [chats, setChats] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const { setSelectedUser, addMessage } = useUser()

	useEffect(() => {
		const fetchChats = async () => {
			try {
				const token = localStorage.getItem('accessToken')
				const headers = {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
				const response = await fetch(`${serverUrl}/chats`, {
					method: 'GET',
					headers: headers
				})

				if (!response.ok) {
					const errorData = await response.json()
					throw new Error('Ошибка сервера: ' + errorData.message)
				}

				const data = await response.json()
				console.log('Received data from API:', data)
				setChats(data)
			} catch (error) {
				console.error('Ошибка при получении чатов:', error)
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}
		fetchChats()
	}, [serverUrl])

	useEffect(() => {
		console.log('Chats updated:', chats)
	}, [chats])

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error: {error}</div>

	if (!Array.isArray(chats) || chats.length === 0) {
		return <div>No chats available.</div>
	}

	const handleUserSelect = async user => {
		setSelectedUser(user)
		try {
			const token = localStorage.getItem('accessToken')
			const headers = {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}

			console.log('Fetching messages for user ID:', user.id)

			const response = await fetch(`${serverUrl}/messages/${user.id}`, {
				method: 'GET',
				headers: headers
			})

			if (!response.ok) {
				if (response.status === 404) {
					// Обработка случая, когда сообщений нет
					throw new Error('Сообщения не найдены для данного чата.')
				}
				const errorData = await response.json()
				throw new Error('Ошибка при получении сообщений: ' + errorData.message)
			}

			const messagesData = await response.json()
			if (messagesData.length === 0) {
				console.log('No messages found for this user.')
				// Здесь вы можете уведомить пользователя о том, что сообщений нет
			} else {
				messagesData.forEach(message => addMessage(message))
			}
		} catch (error) {
			console.error('Ошибка при получении сообщений:', error)
		}
	}

	return (
		<div className="col-inf_groups">
			<h6 className="title-groups">Chats</h6>
			<ul className="groups-list">
				{chats.map(chat => (
					<li
						className="groups-item"
						key={chat.id}
						onClick={() => handleUserSelect(chat)}
					>
						<div className="groups-item_avatar-title">
							<div className="groups-item_avatar">
								<img
									src={chat.avatar || 'default-avatar.png'}
									alt="avatar-groups"
								/>
							</div>
							<div className="groups-item_main-title">
								<div className="title-group">
									<h4>{chat.name}</h4>
								</div>
								<div className="context-group">
									<h6>{chat.lastMessage || 'No messages yet'}</h6>
								</div>
							</div>
						</div>
						<div className="groups-item_time-quantity">
							<div className="group-item_date">
								<span>{new Date(chat.updatedAt).toLocaleString()}</span>
							</div>
							<div className="group-item_quantity">
								<span
									className={`group-quantity ${chat.messageCount > 0 ? '' : 'none'}`}
								>
									{chat.info && Number.isFinite(chat.info.messageCount)
										? chat.info.messageCount
										: 0}
								</span>
								<span className="group-check-all none">
									<IoCheckmarkDoneOutline />
								</span>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default UsersGroups
*/

/*
function UsersGroups({ serverUrl }) {
	const [chats, setChats] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	// Получаем функцию для установки выбранного пользователя и вывда сообщений
	const { setSelectedUser, addMessage } = useUser()

	useEffect(() => {
		const fetchChats = async () => {
			try {
				const token = localStorage.getItem('accessToken')
				const headers = {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
				const response = await fetch(`${serverUrl}/chats`, {
					method: 'GET',
					headers: headers
				})

				// Выводим ответ сервера в консоль
				// Получаем текстовый ответ
				// const textResponse = await response.text()
				// Логируем сырой ответ
				// console.log('Raw response:', textResponse)

				if (!response.ok) {
					const errorData = await response.json()
					// console.error('Error details:', errorData)
					throw new Error('Ошибка сервера: ' + errorData.message)
				}
				const data = await response.json()
				console.log('Received data from API:', data) // Логируем полученные данные
				console.log('Chats:', data)
				setChats(data)
			} catch (error) {
				console.error('Ошибка при получении чатов:', error)
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}
		fetchChats()
	}, [serverUrl])

	useEffect(() => {
		console.log('Chats updated:', chats)
	}, [chats])

	if (loading) return <div>Loading...</div>
	if (error) return <div>Error: {error}</div>
	console.log('Chats:', chats)

	const handleUserSelect = async user => {
		setSelectedUser(user) // Устанавливаем выбранного пользователя в контексте
		try {
			const token = localStorage.getItem('accessToken') // Получаем токен
			const headers = {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json'
			}

			console.log('Fetching messages for user ID:', user.id) // Логируем ID пользователя

			const response = await fetch(`${serverUrl}/messages/${user.id}`, {
				method: 'GET',
				headers: headers // Добавляем заголовки
			})

			if (!response.ok) {
				const errorData = await response.json() // Получаем детали ошибки
				// console.error('Ошибка при получении сообщений:', errorData)
				throw new Error('Ошибка при получении сообщений: ' + errorData.message)
			}

			const messagesData = await response.json()
			if (messagesData.length === 0) {
				console.log('No messages found for this user.')
			} else {
				messagesData.forEach(message => addMessage(message))
			}
		} catch (error) {
			console.error('Ошибка при получении сообщений:', error)
		}
	}
	return (
		<div className="col-inf_groups">
			<h6 className="title-groups">Chats</h6>
			<ul className="groups-list">
				{chats.map(chat => (
					<li
						className="groups-item"
						key={chat.id}
						onClick={() => handleUserSelect(chat)}
					>
						<div className="groups-item_avatar-title">
							<div className="groups-item_avatar">
								<img
									src={chat.avatar || 'default-avatar.png'}
									alt="avatar-groups"
								/>
							</div>
							<div className="groups-item_main-title">
								<div className="title-group">
									<h4>{chat.name}</h4>
								</div>
								<div className="context-group">
									<h6>{chat.lastMessage || 'No messages yet'}</h6>
								</div>
							</div>
						</div>
						<div className="groups-item_time-quantity">
							<div className="group-item_date">
								<span>{new Date(chat.updatedAt).toLocaleString()}</span>
							</div>
							<div className="group-item_quantity">
								<span
									className={`group-quantity ${chat.messageCount > 0 ? '' : 'none'}`}
								>
									{chat.info && Number.isFinite(chat.info.messageCount)
										? chat.info.messageCount
										: 0}
								</span>
								<span className="group-check-all none">
									<IoCheckmarkDoneOutline />
								</span>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default UsersGroups
*/
/*
	// const handleUserSelect = async user => {
	// 	setSelectedUser(user) // Устанавливаем выбранного пользователя в контексте
	// 	try {
	// 		const token = localStorage.getItem('accessToken') // Получаем токен
	// 		const headers = {
	// 			Authorization: `Bearer ${token}`,
	// 			'Content-Type': 'application/json'
	// 		}
	// 		const response = await fetch(`${serverUrl}/messages/${user.id}`, {
	// 			method: 'GET',
	// 			headers: headers // Добавляем заголовки
	// 		})

	// 		if (!response.ok) {
	// 			const errorData = await response.json() // Получаем детали ошибки
	// 			console.error('Ошибка при получении сообщений:', errorData)
	// 			throw new Error('Ошибка при получении сообщений: ' + errorData.message)
	// 		}
	// 		const messagesData = await response.json()
	// 		messagesData.forEach(message => addMessage(message))
	// 		// setMessages(messagesData) // Сохраняем сообщения в контексте
	// 	} catch (error) {
	// 		console.error('Ошибка при получении сообщений:', error)
	// 	}
	// }

	*/
