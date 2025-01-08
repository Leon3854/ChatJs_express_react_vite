import UsersGroups from '../users-groups/UsersGroups'
import UsersList from '../users-list/UsersList'
import UserSearch from '../users-search/UserSearch'

function UserInfoBlock() {
	const serverUrl = import.meta.env.VITE_SERVER_URL
	// console.log('Server URL:', serverUrl)
	return (
		<div className="col-inf">
			<UserSearch />
			<UsersGroups serverUrl={serverUrl} />
			<UsersList serverUrl={serverUrl} />
		</div>
	)
}
export default UserInfoBlock
