import './index.css'

import { sum } from './main'

const array = [1, 2, 3].map(i => i + 1)

function hello(...args) {
	console.log('###: Hello Rollup!', args[0], args[1])
}

hello(sum(1, 2), array)
