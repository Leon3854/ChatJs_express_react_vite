import ChatBodyHead from '../chat-body-head/ChatBodyHead'
import { useState } from 'react'

import ChatMessageBody from '../chat-message-body/ChatMessage'
import ChatInput from '../chat-input/ChatInput'

function ChatBlock() {
	// console.log('ChatBlock rendered')
	const [messages, setMessages] = useState([]) // Состояние для хранения сообщений

	const handleSendMessage = message => {
		// Добавляем новое сообщение в состояние
		setMessages(prevMessages => [...prevMessages, message])
	}

	return (
		<>
			<div className="col-chat-body">
				<ChatBodyHead />
				{/* Передаем сообщения в ChatMessageBody */}
				<ChatMessageBody messages={messages} />
				{/* Передаем функцию отправки в ChatInput */}
				<ChatInput onSendMessage={handleSendMessage} />
			</div>
		</>
	)
}
export default ChatBlock
