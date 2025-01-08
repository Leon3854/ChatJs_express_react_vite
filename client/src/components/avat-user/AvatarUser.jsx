//
//
function AvatarUser({ avatar }) {
	return (
		<>
			<div className="avatar">
				{avatar ? (
					<img src={avatar} alt="Avatar" />
				) : (
					// Показать изображение по умолчанию, если аватар не задан
					<img src="avatar.webp" alt="Default Avatar" />
				)}
			</div>
		</>
	)
}
export default AvatarUser
