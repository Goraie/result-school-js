// this

// console.log(this)

const user = {
	name: 'Maksim',
	dateOfBirth: 2001,
	getName() {
		// return user.name

		return this.name
	},
	calculateAge() {
		const currentYear = new Date().getFullYear()
		return currentYear - this.dateOfBirth
	},
	getAllInfo: function () {
		const age = this.calculateAge()
		console.log('Имя:', this.name, 'Возраст:', age)
	},
}

user.getAllInfo()

// bind, call, apply

const user2 = {
	name: 'Igor',
}

const user2Name = user.getName.call(user2)

console.log(user2Name)

// bind, call, apply

const mainHero = {
	fulllName: 'SpiderMan',
	health: 65,
	strength: 5,
}

const badHero = {
	fulllName: 'Joker',
	health: 55,
	strength: 10,
}

function printHeroInfo(extraInfo = '') {
	console.log(
		`Имя: ${this.fulllName}, Здоровье: ${this.health}, Сила: ${this.strength}, ${extraInfo}`,
	)
}

// call
printHeroInfo.call(badHero, 'Роль: злодей')
// apply
printHeroInfo.apply(badHero, ['Роль: злодей'])
// bind
const bindedPrintHeroInfo = printHeroInfo.bind(mainHero, 'Роль: главный герой')
bindedPrintHeroInfo()

// потеря контекста

const user = {
	name: 'Maksim',
	programmingLanguage: 'JavaScript',
	getName() {
		return this.name
	},
	// У стрелочной функции нет this
	getProgrammingLanguage: function () {
		return this.programmingLanguage
	},
}

console.log('GetName:', user.getName())

const newGetName = user.getName

console.log('NewGetName:', newGetName.call(user))

console.log('getProgrammingLanguage:', user.getProgrammingLanguage())

// 1 случай - вызов функции без контекста
// 2 случай - использование стрелочных функций, которые не имеют своего контекста this
