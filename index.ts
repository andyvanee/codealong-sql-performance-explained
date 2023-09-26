import {query, create} from './src'

const SHOULD_CREATE = process.env.CREATE === 'true'

if (SHOULD_CREATE) await create()

console.log(query())
