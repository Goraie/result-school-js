const salariesOfDevelopers = [400, 500, 600, 700, 800, 12000, 130]

const updatedSalaries = salariesOfDevelopers.map((salary, i, array) => {
	return salary + ' рубля'
})

// console.log(updatedSalaries)

const filteredSalaries = salariesOfDevelopers.filter((salary, i, array) => {
	return (i + 1) % 2
})

// console.log(filteredSalaries)

const findSalaries = salariesOfDevelopers.find(salary => {
	return salary === 500
})

// console.log(findSalaries)

const findIndexSalaries = salariesOfDevelopers.findIndex(salary => {
	return salary === 700
})

// console.log(findIndexSalaries)

const someSalaries = salariesOfDevelopers.some(salary => {
	return salary > 1000
})

// console.log(someSalaries)

const everySalaries = salariesOfDevelopers.every(salary => {
	return salary > 400
})

// console.log(everySalaries)

const sum = salariesOfDevelopers.reduce((acc, salary, i, array) => {
	// console.log(acc)
	return acc + salary
}, 0)

// console.log('sum:', sum)

salariesOfDevelopers.sort((a, b) => {})
console.log('salariesOfDevelopers', salariesOfDevelopers)

// splice
const cars = ['bmw', 'Mercedes', 'Lada']

const removeCars = cars.splice(0, 2, 'Audi')

console.log(removeCars)

// slice

const agesOfDevs = [25, 18, 45, 30]

// console.log(agesOfDevs.slice(0, 2))
const slicedAgesOfDevs = agesOfDevs.slice(0, 2)
console.log(slicedAgesOfDevs)

// indexOf

const favFood = ['Ice Cream', 'Cake', 'Coffee']

const indexOfFood = favFood.indexOf('Cake')
console.log(indexOfFood)

// includes

const technologies = ['JS', 'HTML', 'CSS']
const isTechnologyExist = technologies.includes('CSS')
console.log(isTechnologyExist)

// split + join

const listOfOrders = 'T-shirt, shirts, sneakers, bag'

const listOfOrdersArray = listOfOrders.split(', ')

console.log(listOfOrdersArray)

const ordersString = listOfOrdersArray.join('; ')
console.log(ordersString)

// reverse

console.log(technologies)
technologies.reverse()
console.log('rev:', technologies)

// concat

const currentDevs = ['Max', 'Oleg']
const newDevs = ['Anton', 'Gleb']

// const allDevs = currentDevs.concat(newDevs, ['SexyBoy'])

// console.log(allDevs)

const allDevs = [...currentDevs, ...newDevs]

console.log(allDevs)
