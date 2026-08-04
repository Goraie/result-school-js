const AUTHOR_URL = 'https://jsonplaceholder.typicode.com/users'
const USER_POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

const container = document.querySelector('#blog-container')

const authorsList = container.querySelector('.blog__authors .blog__list')
const postsList = container.querySelector('.blog__posts .blog__list')
const search = container.querySelector('#search')

let currentPosts = []

const renderAuthorHtml = user => {
	const { id, name, username, email } = user

	const el = document.createElement('li')
	const elCount = document.createElement('span')
	const elNickName = document.createElement('h3')
	const elFullName = document.createElement('p')
	const elEmail = document.createElement('input')
	const wrapperTop = document.createElement('div')
	const wrapperBottom = document.createElement('div')

	wrapperTop.className = 'blog-item__w blog-item__w_top'
	wrapperBottom.className = 'blog-item__w blog-item__w_bottom'

	el.className = 'blog__item blog-item'
	elCount.className = 'blog-item__count'
	elNickName.className = 'blog-item__title'
	elFullName.className = 'blog-item__name'
	elEmail.className = 'blog-item__email'

	el.dataset.userId = id

	elCount.textContent = id
	elNickName.textContent = name
	elFullName.textContent = username

	elEmail.name = 'email-name'
	elEmail.value = email
	elEmail.readOnly = true

	wrapperTop.append(elCount, elNickName)
	wrapperBottom.append(elFullName, elEmail)
	el.append(wrapperTop, wrapperBottom)

	return el
}

const renderPostHtml = post => {
	const { title, body } = post

	const el = document.createElement('li')
	const elTitle = document.createElement('h3')
	const elText = document.createElement('p')

	el.className = 'blog__item blog-item active'
	elTitle.className = 'blog-item__title'
	elText.className = 'blog-item__text'

	elTitle.textContent = title
	elText.textContent = body

	el.append(elTitle, elText)

	return el
}

const renderPosts = posts => {
	postsList.replaceChildren()

	if (posts.length === 0) {
		const message = document.createElement('li')
		message.className = 'blog__empty'
		message.textContent = 'Посты не найдены'

		postsList.append(message)
		return
	}

	const fragment = document.createDocumentFragment()

	posts.forEach(post => {
		fragment.append(renderPostHtml(post))
	})

	postsList.append(fragment)
}

const renderStatusHtml = (text, className = '') => {
	const element = document.createElement('li')

	element.className = `blog__status ${className}`.trim()
	element.textContent = text

	return element
}

const showLoading = (list, text = 'Загрузка...') => {
	list.replaceChildren(renderStatusHtml(text, 'blog__status_loading'))
}

const showError = (list, text) => {
	list.replaceChildren(renderStatusHtml(text, 'blog__status_error'))
}

const hiddenSearch = (status = false) => {
	search.hidden = status

	if (status) {
		search.value = ''
	}
}

// Обработчик создаётся только один раз
search.addEventListener('input', event => {
	const value = event.target.value.trim().toLowerCase()

	const filteredPosts = currentPosts.filter(post => {
		const title = post.title.toLowerCase()
		const body = post.body.toLowerCase()

		return title.includes(value) || body.includes(value)
	})

	renderPosts(filteredPosts)
})

const showAllPosts = async userId => {
	try {
		hiddenSearch(true)
		showLoading(postsList, 'Загрузка постов...')

		const url = `${USER_POSTS_URL}?userId=${userId}`
		const response = await fetch(url)

		if (!response.ok) {
			throw new Error(`Ошибка в получении постов автора с id=${userId}`)
		}

		currentPosts = await response.json()

		renderPosts(currentPosts)
		hiddenSearch(false)
	} catch (error) {
		currentPosts = []

		showError(postsList, 'Не удалось загрузить посты')

		console.error(error)
	}
}

const getAllAuthors = async () => {
	try {
		showLoading(authorsList, 'Загрузка авторов...')

		const response = await fetch(AUTHOR_URL)

		if (!response.ok) {
			throw new Error('Ошибка в получении данных об авторах')
		}

		const authors = await response.json()
		const fragment = document.createDocumentFragment()

		authors.forEach(author => {
			fragment.append(renderAuthorHtml(author))
		})

		// Удаляем загрузку и выводим авторов
		authorsList.replaceChildren(fragment)

		authorsList.addEventListener('click', event => {
			const authorElement = event.target.closest('li[data-user-id]')

			if (!authorElement) {
				return
			}

			authorsList.querySelectorAll('li[data-user-id]').forEach(element => {
				element.classList.remove('active')
			})

			authorElement.classList.add('active')

			showAllPosts(authorElement.dataset.userId)
		})
	} catch (error) {
		showError(authorsList, 'Не удалось загрузить авторов')

		console.error(error)
	}
}

getAllAuthors()
