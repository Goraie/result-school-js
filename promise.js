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
