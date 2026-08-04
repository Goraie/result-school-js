const USERS_DATA = 'https://jsonplaceholder.typicode.com/users'
const container = document.querySelector('#data-container')

const createUserElement = userName => {
	const userElement = document.createElement('li')
	const userElementLink = document.createElement('a')

	userElementLink.href = '#'
	userElementLink.textContent = userName

	userElement.append(userElementLink)

	return userElement
}

const loading = () => {
	const loader = document.querySelector('#loader')
	const isHidden = loader.hasAttribute('hidden')

	if (isHidden) {
		loader.removeAttribute('hidden')
	} else {
		loader.setAttribute('hidden', '')
	}
}

const showAllUsers = () => {
	loading()

	const result = fetch(USERS_DATA, {
		method: 'GET',
	})

	result
		.then(response => {
			if (!response.ok) {
				throw new Error('Ошибка в ответе')
			}
			return response.json()
		})
		.then(users => {
			users.forEach(user => {
				const userEl = createUserElement(user.name)
				container.append(userEl)
			})
		})
		.catch(error => {
			console.log(error)
		})
		.finally(() => {
			loading()
		})
}

showAllUsers()
