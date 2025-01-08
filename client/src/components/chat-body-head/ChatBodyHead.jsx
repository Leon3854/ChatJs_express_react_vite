import { LuPhone } from 'react-icons/lu'
import { GoDeviceCameraVideo } from 'react-icons/go'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { useUser } from '../../context/UserContext'
import './ChatBodyHead.component.css'

function ChatBodyHead() {
	const { selectedUser } = useUser() // Получаем выбранного пользователя из контекста

	if (!selectedUser) {
		return <h6>Выберите пользователя для начала общения</h6>
	}

	return (
		<>
			<div className="col-chat-body_head">
				<div className="col-chat-body_head-left">
					<div className="groups-item_avatar-title">
						<div className="groups-item_avatar">
							<img
								src={selectedUser.avatar}
								alt={`${selectedUser.nickname}'s avatar`}
							/>
						</div>
						<div className="groups-item_main-title">
							<div className="title-group">
								<h4>{selectedUser.name}</h4>
							</div>
							<div className="context-group">
								<h6>{new Date(selectedUser.updatedAt).toLocaleDateString()}</h6>
							</div>
						</div>
					</div>
				</div>
				<div className="col-chat-body_head-right">
					<button type="button" className="btn btn-link chat-icon-color">
						<LuPhone className="chat-head-icon phone" />
					</button>
					<button type="button" className="btn btn-link chat-icon-color">
						<GoDeviceCameraVideo className="chat-head-icon camera" />
					</button>
					<button type="button" className="btn btn-link chat-icon-color">
						<BsThreeDotsVertical className="chat-head-icon three-dots" />
					</button>
				</div>
			</div>
		</>
	)
}
export default ChatBodyHead
