// Четыре принципа ООП

// 1. Насследование
// 2. Инкапсуляция - скрытие данных. public, private
// 3. Полиморфизм - одно действие несколько реализаций
// 4. Абстракция - абстрактная общая реализация одного объекта с последующим раскрытием в наследуемых классах. Создание интерфейса по сути

// ООП

// function Animal(name) {
// 	this.name = name

// 	this.getName = function () {
// 		return this.name
// 	}
// }

// const zebra = new Animal('Зебра')
// console.log(zebra.getName())

class Animal {
	constructor(name) {
		this.name = name
	}

	getName() {
		return this.name
	}
}

const zebra = new Animal('Зебра')
const dog = new Animal('Собака')

console.log(zebra)
console.log(dog)

// 1. Насследование
// 2. Инапсуляция
// 3. Полиморфизм
// 4. Абстракция

class Plane {
	constructor(type, numberOfPassengers) {
		this.type = type
		this.numberOfPassengers = numberOfPassengers
	}

	startFlight() {
		console.log('Полетели!')
	}
}

class MilitaryPlane extends Plane {
	constructor(type) {
		super(type, 0)

		this.numberOfGuns = 0
	}

	startFlight() {
		console.log('Полетели в атаку!')
	}

	setNumberOfGuns(numberOfGuns) {
		this.numberOfGuns = numberOfGuns
	}

	shoot() {
		console.log('Стреляем')
	}
}

const plane = new Plane('Пассажирский', 100)

console.log(plane)
plane.startFlight()

const militaryPlane = new MilitaryPlane('Военный')
militaryPlane.startFlight()
militaryPlane.setNumberOfGuns(20)
militaryPlane.shoot()

console.log(militaryPlane)

console.log(militaryPlane instanceof Plane)

// // // //

class Developer {
	#salary

	constructor(name, programmingLanguage) {
		this.name = name
		this.programmingLanguage = programmingLanguage
		this.#salary = 3000
	}

	get devSalary() {
		return this.#salary
	}

	set setSalary(salary) {
		this.#salary = salary
	}

	startCoding() {
		console.log(this.#salary)
		console.log(`${this.name} начинает писать код`)
	}

	#printProgrammingLanguage() {
		console.log(`Язык программирования: ${this.programmingLanguage}`)
	}
}

class JuniorDeveloper extends Developer {
	constructor(name, programmingLanguage) {
		super(name, programmingLanguage)
	}
}

const developer = new Developer('Maxim', 'Javascript')

const juniorDeveloper = new JuniorDeveloper('Oleg', 'Javascript')

console.log(developer.devSalary)
developer.setSalary = 5000
console.log(developer.devSalary)

// // // //

class Animal {
	constructor(name) {
		this.name = name
	}

	makeSound() {
		console.log(first)
	}
}

class Dog extends Animal {
	constructor(name) {
		super(name)
	}

	makeSound() {
		console.log('Гав-гав')
	}
}
class Horse extends Animal {
	constructor(name) {
		super(name)
	}

	makeSound() {
		console.log('Игогошеньки охаешеньки')
	}
}

// // // //

class Footballer {
	constructor(name, club) {
		this.name = name
		this.club = club
	}

	shoot() {}
	celebrating() {}
	pass() {}
}

class Forward extends Footballer {
	constructor(name, club) {
		super(name, club)
	}

	shoot() {
		console.log('Очень сильный удар')
	}
	celebrating() {
		console.log('Я забил гол')
	}
	pass() {
		console.log('Средненький пас')
	}
}

//  // // // // // // //

// Статические методы и свойства

class Car {
	static isCar(car) {
		return car instanceof Car
	}

	static initialParams = {
		name: 'Audi',
		maxSpeed: '150',
	}

	constructor(name, maxSpeed) {
		this.name = name ?? Car.initialParams.name
		this.maxSpeed = maxSpeed ?? Car.initialParams.maxSpeed
	}

	drive() {
		console.log(`Машина ${this.name} в пути`)
	}
}

const car = new Car('BMW', 200)
const car2 = new Car()

console.log(car2)
