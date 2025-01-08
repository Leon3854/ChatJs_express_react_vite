import ChatBlock from './components/chat-block/ChatBlock'
import NavAuthBlock from './components/nav-auth-block/NavAuthBlock'
import UserInfoBlock from './components/user-info-block/UserInfoBlock'
import { UserProvider } from './context/UserContext'
import { useParams } from 'react-router-dom'

function App() {
	const { chatId } = useParams() // Предположим, что вы получаете chatId из URL
	return (
		<div className="custom-container">
			<UserProvider initialUserId={chatId}>
				<NavAuthBlock />
				<UserInfoBlock serverUrl={import.meta.env.VITE_SERVER_URL} />
				<ChatBlock />
			</UserProvider>
		</div>
	)
}

export default App
