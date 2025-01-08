import { BsPaperclip } from 'react-icons/bs'
import { SlEmotsmile } from 'react-icons/sl'
import { IoIosMic } from 'react-icons/io'
import { useUser } from '../../context/UserContext'
import { MdOutlineKeyboardReturn } from 'react-icons/md'

import './ChatInput.component.css'

function ChatInput() {
	const { inputText, setInputText, sendMessage } = useUser() // Получаем inputText и setInputText из контекста

	const handleSubmit = e => {
		e.preventDefault() // Предотвращаем перезагрузку страницы
		if (inputText.trim()) {
			// sendMessage(chatId, inputText)
			sendMessage(inputText) // Вызываем функцию отправки с введенным сообщением
			setInputText('') // Очищаем поле ввода
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div className="col-chat-body_input-voice">
					<div className="chat-group_btn-input">
						<div className="add-folders">
							<button className="btn btn-link">
								<BsPaperclip className="chat-icon paperclip" />
							</button>
						</div>
						<div className="chat-input_text">
							<textarea
								className="input-text"
								aria-label="With textarea"
								placeholder="Type your message here..."
								value={inputText}
								// Обновляем состояние при вводе
								onChange={e => setInputText(e.target.value)}
							></textarea>
						</div>
						<div className="add-smile_icons">
							<div className="btn btn-link">
								<SlEmotsmile className="chat-icon smile" />
							</div>
						</div>
						<div className="add-user-images">
							<div className="btn btn-link" onClick={handleSubmit}>
								<MdOutlineKeyboardReturn className="chat-icon return" />
							</div>
						</div>
					</div>
					<div className="chat-record-voice">
						<button type="button" className="btn btn-primary">
							<IoIosMic className="chat-icon microfon" />
						</button>
					</div>
				</div>
			</form>
		</>
	)
}
export default ChatInput

/*

*/
