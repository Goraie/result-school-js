const API_URL = 'https://jsonplaceholder.typicode.com'

const usersList = document.querySelector('#users-list')
const postsList = document.querySelector('#posts-list')
const commentsList = document.querySelector('#comments-list')
const commentForm = document.querySelector('#comment-form')
const commentFormStatus = document.querySelector('#comment-form-status')
const commentSubmitButton = commentForm.querySelector('.comment-form__submit')

const state = {
	users: [],
	postsByUser: new Map(),
	commentsByPost: new Map(),
	selectedUserId: null,
	selectedPostId: null,
}

const fetchJson = async (url, options = {}) => {
	const response = await fetch(url, options)

	if (!response.ok) {
		throw new Error(`HTTP ${response.status}: ${response.statusText}`)
	}

	return response.json()
}

const getUsers = () => fetchJson(`${API_URL}/users`)

const getPostsByUser = userId => {
	const url = new URL(`${API_URL}/posts`)
	url.searchParams.set('userId', userId)

	return fetchJson(url)
}

const getCommentsByPost = postId => {
	const url = new URL(`${API_URL}/comments`)
	url.searchParams.set('postId', postId)

	return fetchJson(url)
}

const addComment = comment => {
	return fetchJson(`${API_URL}/comments`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(comment),
	})
}

const createStatus = (text, type = 'empty') => {
	const status = document.createElement('li')

	status.className = `blog-board__status blog-board__status--${type}`
	status.textContent = text

	if (type === 'error') {
		status.setAttribute('role', 'alert')
	}

	return status
}

const showStatus = (list, text, type) => {
	list.replaceChildren(createStatus(text, type))
}

const createUserCard = user => {
	const item = document.createElement('li')
	const button = document.createElement('button')
	const count = document.createElement('span')
	const name = document.createElement('strong')
	const username = document.createElement('span')
	const email = document.createElement('span')

	item.className = 'blog-board__item'
	button.className = 'board-card board-card--user'
	button.type = 'button'
	button.dataset.userId = user.id
	button.setAttribute('aria-pressed', 'false')
	count.className = 'board-card__count'
	name.className = 'board-card__title'
	username.className = 'board-card__meta'
	email.className = 'board-card__email'

	count.textContent = user.id
	name.textContent = user.name
	username.textContent = `@${user.username}`
	email.textContent = user.email

	button.append(count, name, username, email)
	item.append(button)

	return item
}

const createPostCard = post => {
	const item = document.createElement('li')
	const button = document.createElement('button')
	const count = document.createElement('span')
	const title = document.createElement('strong')
	const body = document.createElement('span')

	item.className = 'blog-board__item'
	button.className = 'board-card board-card--post'
	button.type = 'button'
	button.dataset.postId = post.id
	button.setAttribute('aria-pressed', 'false')
	count.className = 'board-card__count'
	title.className = 'board-card__title'
	body.className = 'board-card__text'

	count.textContent = post.id
	title.textContent = post.title
	body.textContent = post.body

	button.append(count, title, body)
	item.append(button)

	return item
}

const createCommentCard = comment => {
	const item = document.createElement('li')
	const header = document.createElement('div')
	const name = document.createElement('strong')
	const meta = document.createElement('span')
	const body = document.createElement('p')

	item.className = 'comment-card'
	header.className = 'comment-card__header'
	name.className = 'comment-card__name'
	meta.className = 'comment-card__email'
	body.className = 'comment-card__text'

	name.textContent = comment.name
	meta.textContent = comment.isLocal ? 'Только что' : comment.email
	body.textContent = comment.body

	header.append(name, meta)
	item.append(header, body)

	return item
}

const renderCollection = (list, items, createElement, emptyText) => {
	if (items.length === 0) {
		showStatus(list, emptyText, 'empty')
		return
	}

	const fragment = document.createDocumentFragment()

	items.forEach(item => fragment.append(createElement(item)))
	list.replaceChildren(fragment)
}

const renderUsers = users => {
	renderCollection(usersList, users, createUserCard, 'Авторы не найдены')
}

const renderPosts = posts => {
	renderCollection(postsList, posts, createPostCard, 'У этого автора нет постов')
}

const renderComments = comments => {
	renderCollection(
		commentsList,
		comments,
		createCommentCard,
		'У этого поста пока нет комментариев',
	)
}

const setActiveCard = (list, selector, activeId, dataKey) => {
	list.querySelectorAll(selector).forEach(button => {
		const isActive = Number(button.dataset[dataKey]) === activeId

		button.classList.toggle('is-active', isActive)
		button.setAttribute('aria-pressed', String(isActive))
	})
}

const setFormStatus = (text = '', type = '') => {
	commentFormStatus.className = 'comment-form__status'
	commentFormStatus.textContent = text

	if (type) {
		commentFormStatus.classList.add(`comment-form__status--${type}`)
	}
}

const resetComments = () => {
	state.selectedPostId = null
	setActiveCard(postsList, '[data-post-id]', null, 'postId')
	setFormStatus()
	commentForm.hidden = true
	showStatus(commentsList, 'Выберите пост, чтобы увидеть комментарии', 'empty')
}

const selectUser = async userId => {
	if (state.selectedUserId === userId) {
		return
	}

	state.selectedUserId = userId
	setActiveCard(usersList, '[data-user-id]', userId, 'userId')
	resetComments()

	if (state.postsByUser.has(userId)) {
		renderPosts(state.postsByUser.get(userId))
		return
	}

	showStatus(postsList, 'Загрузка постов…', 'loading')

	try {
		const posts = await getPostsByUser(userId)
		state.postsByUser.set(userId, posts)

		if (state.selectedUserId !== userId) {
			return
		}

		renderPosts(posts)
	} catch (error) {
		if (state.selectedUserId !== userId) {
			return
		}

		showStatus(postsList, 'Не удалось загрузить посты', 'error')
		console.error(error)
	}
}

const selectPost = async postId => {
	if (state.selectedPostId === postId) {
		return
	}

	state.selectedPostId = postId
	setActiveCard(postsList, '[data-post-id]', postId, 'postId')
	setFormStatus()
	commentForm.hidden = true

	if (state.commentsByPost.has(postId)) {
		renderComments(state.commentsByPost.get(postId))
		commentForm.hidden = false
		return
	}

	showStatus(commentsList, 'Загрузка комментариев…', 'loading')

	try {
		const comments = await getCommentsByPost(postId)
		state.commentsByPost.set(postId, comments)

		if (state.selectedPostId !== postId) {
			return
		}

		renderComments(comments)
		commentForm.hidden = false
	} catch (error) {
		if (state.selectedPostId !== postId) {
			return
		}

		showStatus(commentsList, 'Не удалось загрузить комментарии', 'error')
		console.error(error)
	}
}

usersList.addEventListener('click', event => {
	const button = event.target.closest('[data-user-id]')

	if (!button || !usersList.contains(button)) {
		return
	}

	selectUser(Number(button.dataset.userId))
})

postsList.addEventListener('click', event => {
	const button = event.target.closest('[data-post-id]')

	if (!button || !postsList.contains(button)) {
		return
	}

	selectPost(Number(button.dataset.postId))
})

commentForm.addEventListener('submit', async event => {
	event.preventDefault()

	const postId = state.selectedPostId
	const formData = new FormData(commentForm)
	const name = String(formData.get('name') ?? '').trim()
	const body = String(formData.get('body') ?? '').trim()

	if (!postId || !name || !body) {
		setFormStatus('Заполните имя и текст комментария', 'error')
		return
	}

	commentSubmitButton.disabled = true
	commentSubmitButton.textContent = 'Отправка…'
	setFormStatus()

	try {
		const response = await addComment({ postId, name, body })
		const newComment = { ...response, postId, name, body, isLocal: true }
		const comments = state.commentsByPost.get(postId) ?? []
		const updatedComments = [newComment, ...comments]

		state.commentsByPost.set(postId, updatedComments)

		if (state.selectedPostId === postId) {
			renderComments(updatedComments)
			commentForm.reset()
			setFormStatus('Комментарий добавлен', 'success')
		}
	} catch (error) {
		if (state.selectedPostId === postId) {
			setFormStatus('Не удалось отправить комментарий', 'error')
		}

		console.error(error)
	} finally {
		commentSubmitButton.disabled = false
		commentSubmitButton.textContent = 'Отправить комментарий'
	}
})

const init = async () => {
	showStatus(usersList, 'Загрузка авторов…', 'loading')

	try {
		state.users = await getUsers()
		renderUsers(state.users)
	} catch (error) {
		showStatus(usersList, 'Не удалось загрузить авторов', 'error')
		console.error(error)
	}
}

init()
