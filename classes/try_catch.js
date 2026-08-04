const USERS_URL = 'https://jsonplaceholder.typicode.com/users'
const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos'

// try catch finally

const getTodosWithUserData = async () => {
	try {
		const response = await fetch(USERS_URL)
		if (!response.ok) {
			throw new Error('Ошибка в получении данных о пользователях')
		}
		const users = await response.json()
		const firstUserId = users[0]?.id
		console.log('users', users)
		const todosResponse = await fetch(`${TODOS_URL}?userId=${firstUserId}`)
		if (!todosResponse.ok) {
			throw new Error('Ошибка в получении данных о задачах')
		}
		const todos = await todosResponse.json()
		console.log('todos', todos)
	} catch (error) {
		console.log('error', error)
	} finally {
		console.log('finally')
	}
}

getTodosWithUserData()
