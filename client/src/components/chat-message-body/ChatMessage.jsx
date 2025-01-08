import { useUser } from '../../context/UserContext'

function ChatMessageBody() {
	const { messages } = useUser()
	return (
		<div className="col-chat-body_body">
			<div className="chat-body_wrapper">
				{messages.map((message, index) => (
					<div
						key={index}
						className={`chat-body_message ${message.userId === 1 ? 'user' : 'other'}`} // Замените на правильную логику для определения отправителя
					>
						<div
							className={`message-text ${message.userId === 1 ? 'user' : 'other'}`}
						>
							{message.content}
						</div>
						<div
							className={`chat-message-date ${message.userId === 1 ? 'user' : 'other'}`}
						>
							<div
								className={`message-dot ${message.userId === 1 ? 'user' : 'other'}`}
							></div>
							<div
								className={`message-date ${message.userId === 1 ? 'user' : 'other'}`}
							>
								{new Date(message.createdAt).toLocaleString()}{' '}
								{/* Используем createdAt вместо date */}
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default ChatMessageBody

// // import { useUser } from '../../context/UserContext'

// function ChatMessageBody({ messages }) {
// 	// const { messages } = useUser()
// 	return (
// 		<>
// 			<div className="col-chat-body_body">
// 				<div className="chat-body_wrapper">
// 					{messages.map((message, index) => (
// 						<div
// 							key={index}
// 							className={`chat-body_message
// 							${message.userId === 1 ? 'user' : 'other'}`} // Замените на правильную логику для определения отправителя
// 						>
// 							<div
// 								className={`message-text ${message.userId === 1 ? 'user' : 'other'}`}
// 							>
// 								{message.content}
// 							</div>
// 							<div
// 								className={`chat-message-date ${message.userId === 1 ? 'user' : 'other'}`}
// 							>
// 								<div
// 									className={`message-dot ${message.userId === 1 ? 'user' : 'other'}`}
// 								></div>
// 								<div
// 									className={`message-date ${message.userId === 1 ? 'user' : 'other'}`}
// 								>
// 									{new Date(message.createdAt).toLocaleString()}{' '}
// 									{/* Используем createdAt вместо date */}
// 								</div>
// 							</div>
// 						</div>
// 					))}
// 				</div>
// 			</div>
// 		</>
// 	)
// }
// export default ChatMessageBody

/*

*/
