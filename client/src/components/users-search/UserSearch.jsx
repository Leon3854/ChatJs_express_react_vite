function UserSearch() {
	return (
		<>
			<div className="search-window">
				<div className="search-window_input">
					<button
						className="btn btn-link btn-search"
						type="button"
						id="button-addon1"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="26"
							height="23"
							fill="currentColor"
							className="bi bi-search"
							viewBox="0 0 16 16"
						>
							<path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
						</svg>
					</button>
					<input type="text" className="search-input" placeholder="Search" />
				</div>
			</div>
		</>
	)
}
export default UserSearch
