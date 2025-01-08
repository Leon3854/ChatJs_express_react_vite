import { PiHouse } from 'react-icons/pi'
import { IoChatboxEllipsesOutline } from 'react-icons/io5'
import { FaRegBell } from 'react-icons/fa'
import { IoSettingsOutline } from 'react-icons/io5'

function UserMenu() {
	return (
		<>
			<div className="navigation-chat">
				<button type="button" className="btn btn-link btn-nav">
					<PiHouse className="icon-house" />
				</button>
				<button type="button" className="btn btn-link btn-nav">
					<IoChatboxEllipsesOutline className="chat-dots" />
				</button>
				<button type="button" className="btn btn-link btn-nav">
					<FaRegBell className="bell-icon" />
				</button>
				<button type="button" className="btn btn-link btn-nav">
					<IoSettingsOutline className="settings-icon" />
				</button>
			</div>
		</>
	)
}
export default UserMenu
