const developer = {
	name: 'Max',
	job: 'Front-end dev',
	experience: 24,
	jobAllInfo: {
		type: 'Front-end',
		framework: 'ReactJS',
	},
}

console.log('type:', developer.jobAllInfo.type)
console.log('framework:', developer['jobAllInfo']['framework'])

// // 1 - .

// console.log('name:', developer.name)
// console.log('Job All Info:', developer.jobAllInfo)

// // 2

// const key = 'name'

// console.log('name:', developer[key])

const student = {
	id: 1,
	programmingLanguage: 'JS',
	hasExperienceInReact: false,
}

//  Добавление

student.experience = 6
console.log(student)

//  Удаление

// delete student.hasExperienceInReact
// console.log(student)

// Изменение

student.experience = 12
student.id = 2
console.log(student)

const ordersArr = [4, 2, 1, 3]
const people = [
	{ id: 1, name: 'Максим' },
	{ id: 2, name: 'Николай' },
	{ id: 3, name: 'Ангелина' },
	{ id: 4, name: 'Виталий' },
]

giveTalonsInOrder = (patients, orders) => {
	const objectWithInd = patients.reduce((acc, curPerson) => {
		acc[curPerson.id] = curPerson
		return acc
	}, {})
	return orders.map(order => objectWithInd[order])
}

const result = giveTalonsInOrder(people, ordersArr)
console.log('result', result)
/* Возвращает массив
[
   { id: 4, name: 'Виталий' },
   { id: 2, name: 'Николай' },
   { id: 1, name: 'Максим' },
   { id: 3, name: 'Ангелина' }
]
*/

// Объект-ссылочный тип данных

const setName = (entity, value) => {
	if (typeof entity === 'object') {
		entity.name = value
	} else {
		entity = value
	}
}

const developer = {
	name: 'Maxim',
}
let developerName = 'Maxim'

setName(developer, 'Max')
setName(developerName, 'Max')

// console.log('developer', developer)
// console.log('developerName', developerName)

const entity = {}
const entityCopy = entity

// console.log({} === {})
console.log(entity === entityCopy)

const goodInfo = {
	id: 1,
	price: 80,
	curency: '$',
	name: 'shoes',
}

console.log(goodInfo)

// for in
// for (const key in goodInfo) {
// 	console.log(key)
// 	const value = goodInfo[key]
// 	console.log(value)
// }

// Object.keys

const keys = Object.keys(goodInfo)
console.log(keys)

// Object.values

const values = Object.values(goodInfo)
console.log(values)

// Object.entries

const entries = Object.entries(goodInfo)
console.log(entries)

// string | symbol

const id = Symbol('id')

const user = {
	[id]: 1,
	name: 'Maxim',
}

console.log(user)

console.log(user[id])

// in

console.log('name' in user)
console.log('age' in user)
console.log(id in user)

const developer = {
	name: 'Maxim',
	job: 'Front-End Dev',
	experience: 24,
	jobAllInfo: {
		type: 'Front-End',
		framework: 'ReactJS',
	},
}

console.log(developer.jobAllInfo)

// 1
// if (developer.jobAllInfo.framework) {

if (developer && developer.jobAllInfo && developer.jobAllInfo.framework) {
	console.log('Все норм')
} else {
	console.log('Еще не норм')
}

// 2 - опциональная цепочка

if (developer?.jobAllInfo?.framework) {
	console.log('Все норм')
} else {
	console.log('Еще не норм')
}

const person = new Object({
	name: 'Maxim',
	age: 25,
	greet: function () {
		console.log('Greet!')
	},
})

console.log(person)

Object.prototype.sayHello = function () {
	console.log('Hello')
}

console.log(person.sayHello())

const lena = Object.create(person)

lena.name = 'Lena'

// const str = 'I am string'
const str = new String('I am string')

console.dir(str)

const citiesRussia = ['Москва', 'Санкт-Петербург', 'Казань', 'Новосибирск']
const citiesEurope = ['Берлин', 'Прага', 'Париж']

const citiesRussiaWithPopulation = {
	Moscow: 20,
	SaintP: 8,
	Kazan: 5,
	Novosibirsk: 3,
}
const citiesEuropeWithPopulation = {
	Berlin: 4,
	Praga: 7,
	Paris: 12,
}

// Spread

// const allCities = [...citiesRussia, 'Вашингтон', ...citiesEurope]
// console.log(allCities)

// console.log({ ...citiesRussiaWithPopulation })

// console.log({ ...citiesRussiaWithPopulation, ...citiesEuropeWithPopulation })

// Practice

// const numbers = [5, 37, 42, 17]

// console.log(Math.max(...numbers))

// Rest

function sum(a, b, ...rest) {
	return a + b + rest.reduce((a, i) => a + i, 0)
}
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

// console.log(sum(...numbers))

// const a = numbers[0]
// const b = numbers[1]
// console.log(a, b)

// const [a, b, ...other] = numbers
// console.log(a, b, ...other)

const person = {
	name: 'Max',
	age: 20,
	city: 'Moscow',
	country: 'Russia',
}

const { name, age, ...address } = person

console.log(name, age, address)

// Деструктуризация
function calcValues(a, b) {
	return [a + b, a - b, a * b, a / b]
}

// const result = calcValues(42, 10)

// const sum = result[0]
// const sub = result[1]

// console.log(sum, sub)

// const [sum, sub = 'Вычитания нет', mult, ...other] = calcValues(42, 10)
// console.log(sum, sub, mult, other)

// Object

const person = {
	name: 'Max',
	age: 20,
	address: {
		country: 'Russia',
		city: 'Moscow',
	},
}

const {
	name: firstName = 'Без имени',
	age,
	car = 'Машины нет',
	address: { city: homeTown, country },
} = person

// console.log(firstName, age, car, homeTown, country)
// const { name, ...info } = person

// console.log(name, info)

function logPerson({ name, age }) {
	console.log(name + ' ' + age)
}

logPerson(person)

// const date = new Date()

// console.log(date)

// const newDate = new Date(2000, 1, 10, 11, 55, 5, 5000)

// console.log('newDate', newDate)

// console.log('year', newDate.getFullYear())
// console.log('month', newDate.getMonth())
// console.log('date', newDate.getDate())

// console.log('day', newDate.getDay())

// newDate.setFullYear(2001)

// console.log('year', newDate.getFullYear())

// getTime

const date1 = new Date(2005, 4, 20)
const date2 = new Date(2006, 4, 10)

console.log(date1.getTime())
console.log(date2.getTime())

const difference = date2.getTime() - date1.getTime()

console.log(difference)
// console.log(difference / 1000 / 60 / 60 / 24 / 30)

const startTime = Date.now()

for (let i = 0; i < 1000000; i++) {
	// do
}

const endTime = Date.now()

console.log(endTime - startTime)
