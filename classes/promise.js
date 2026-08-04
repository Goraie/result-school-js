const developer = {
	name: 'Maksim',
	isJSDev: true,
}

// setTimeout(() => {
// 	console.log('SetTimeout')
// }, 3000)

// console.log(developer)

// setInterval(() => {
// 	console.log('SetInsetInterval')
// }, 1200)

// pending, fulfilled, rejected

const promise = new Promise((resolve, reject) => {
	if (developer.isJSDev) {
		setTimeout(() => {
			resolve(`${developer.name} является JS-разработчиком`)
		}, 3000)
	} else {
		reject(`${developer.name} не является JS-разработчиком`)
	}
})

console.log(promise)

// then, catch, finally

promise
	.then(successMessage => {
		console.log(successMessage)
	})
	.catch(error => {
		console.log('error', error)
	})
	.finally(() => {
		console.log('finally')
	})

// Promise.all([new Promise(), new Promise(), new Promise()])

// fulfilled
// rejected
//

// fetch

const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos/'
const todosIds = [43, 10, 5, 100, 101]
const dataContainer = document.querySelector('#data-container')

const createTodoElement = text => {
	const toDoElement = document.createElement('li')
	const toDoElementAnchor = document.createElement('a')

	toDoElementAnchor.href = '#'
	toDoElementAnchor.textContent = text

	toDoElement.append(toDoElementAnchor)

	return toDoElement
}

const getTodoByIDs = ids => {
	const requests = ids.map(id => fetch(`${TODOS_URL}/${id}`))
	console.log('requests', requests)
	Promise.all(requests)
		.then(responses => {
			console.log('responses', responses)
			const dataResults = responses.map(response => response.json())
			console.log('dataResults', dataResults)
			return Promise.all(dataResults)
		})
		.then(todos => {
			console.log('todos', todos)
			todos.forEach(todo => {
				console.log('todo', todo)
				const todoHTML = createTodoElement(todo.title)
				dataContainer.append(todoHTML)
			})
		})
		.catch(error => {
			console.error(error)
		})
}

getTodoByIDs(todosIds)

// Promise race

// Promise.race([
// 	new Promise(),
// 	new Promise(),
// 	new Promise(),
// ])

const promise1 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('primise1')
	}, 2500)
})
const promise2 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('primise2')
	}, 2000)
})
const promise3 = new Promise((resolve, reject) => {
	setTimeout(() => {
		resolve('primise3')
	}, 1000)
})

Promise.race([promise1, promise2, promise3])
	.then(res => {
		console.log('resolve:', res)
	})
	.catch(error => {
		console.log('error:', error)
	})

const PHOTO_URL = 'https://api.slingacademy.com/v1/sample-data/photos'
const photoIds = [
	1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 52, 24, 57, 30, 29, 27,
]
const container = document.querySelector('#data-container')

const createPhotoElement = elem => {
	const wrap = document.createElement('li')
	const image = document.createElement('img')
	const text = document.createElement('h3')

	const { url, description } = elem

	wrap.className = 'photo-item'
	image.className = 'photo-item__image'
	image.src = url
	text.textContent = description

	wrap.append(image)
	wrap.append(text)

	return wrap
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

const getFastestLoadedPhoto = ids => {
	loading()

	const requests = ids.map(id => fetch(`${PHOTO_URL}/${id}`))

	Promise.race(requests)
		.then(response => {
			console.log('response', response)
			return response.json()
		})
		.then(elem => {
			console.log('elem', elem)

			const photoHTML = createPhotoElement(elem.photo)

			container.append(photoHTML)
		})
		.catch(error => {
			console.log(error)
		})
		.finally(() => {
			loading()
		})
}

getFastestLoadedPhoto(photoIds)
