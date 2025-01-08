import { useState, useEffect } from 'react'
import { IoCheckmarkDone } from 'react-icons/io5'
import { IoCheckmark } from 'react-icons/io5'
import './UsersList.component.css'
import { useUser } from '../../context/UserContext'
//
//
function UsersList({ serverUrl }) {
	const [users, setUsers] = useState([])
	const [loading, setLoading] = useState(true) // Состояние загрузки
	const [error, setError] = useState(null) // Состояние ошибки
	// const { setSelectedUser } = useUser() // Получаем функцию для установки выбранного пользователя
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const token = localStorage.getItem('accessToken') // Получаем авторизационный токен из локального хранилища
				const headers = {
					Authorization: `Bearer ${token}`, // Добавляем авторизационный токен в заголовок
					'Content-Type': 'application/json'
				}
				const response = await fetch(`${serverUrl}/users`, {
					method: 'GET',
					headers: headers
				})
				if (!response.ok) {
					throw new Error('Ошибка при загрузке пользователей')
				}
				const data = await response.json()
				setUsers(data)
			} catch (error) {
				setError(error.message)
			} finally {
				setLoading(false)
			}
		}
		fetchUsers()
	}, [serverUrl])
	if (loading) return <div>Загрузка...</div> // Сообщение о загрузке
	if (error) return <div>Ошибка: {error}</div> // Сообщение об ошибке

	// const handleUserSelect = user => {
	// 	setSelectedUser(user) // Устанавливаем выбранного пользователя в контексте
	// }

	return (
		<div className="col-inf_people">
			<h6 className="title-groups">People</h6>
			<ul className="groups-list">
				{users.map(user => (
					<li
						className="groups-item"
						key={user.id}
						//onClick={() => handleUserSelect(user)}
					>
						<div className="groups-item_avatar-title">
							<div className="groups-item_avatar">
								<img src={user.avatar} alt="аватар пользователя" />
							</div>
							<div className="groups-item_main-title">
								<div className="title-group">
									<h4>{user.name}</h4>
								</div>
								<div className="context-group">
									<h6>{user.nickname}</h6>
								</div>
							</div>
						</div>
						<div className="groups-item_time-quantity">
							<div className="group-item_date">
								<span>{new Date(user.createdAt).toLocaleString()}</span>
							</div>
							<div className="group-item_quantity">
								<span className="group-quantity none">2</span>
								<span className="group-check-all none">
									<IoCheckmarkDone className="check-all-ico" />
								</span>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default UsersList

// useEffect(() => {
// 	const fetchUsers = async () => {
// 		try {
// 			const token = localStorage.getItem('accessToken') // Получаем авторизационный токен из локального хранилища
// 			const headers = {
// 				Authorization: `Bearer ${token}`, // Добавляем авторизационный токен в заголовок
// 				'Content-Type': 'application/json'
// 			}

// 			const response = await fetch(`${serverUrl}/users`, {
// 				method: 'GET',
// 				headers: headers
// 			})
// 			// console.log('Response status:', response.status)
// 			if (!response.ok) {
// 				// throw new Error('Сетевая ошибка')
// 				const errorData = await response.json()
// 				throw new Error('Ошибка сервера:' + errorData.message)
// 			}
// 			const data = await response.json()
// 			// console.log('Users:', data)
// 			setUsers(data)
// 		} catch (error) {
// 			// console.error('Ошибка при получении пользователей:', error)
// 			setError(error.message)
// 		} finally {
// 			setLoading(false) // Завершаем загрузку
// 		}
// 	}
// 	fetchUsers()
// }, [serverUrl])
// if (loading) return <div>Загрузка...</div> // Сообщение о загрузке
// if (error) return <div>Ошибка: {error}</div> // Сообщение об ошибке
// if (users.length === 0) return <div>Пользователи не найдены.</div> // Сообщение, если пользователей нет

// const onUserSelect = user => {
// 	setSelectedUser(user) // Обновляем выбранного пользователя
// }
// console.log('onUserSelect:', onUserSelect)
