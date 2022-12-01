import { getMaxCalories, sumCaloriesByElf } from './day1'
import { inventory, testInventory } from './day1/inventory'

const summarizedInventory: number[] = sumCaloriesByElf(inventory)
const max: number[] = getMaxCalories(summarizedInventory, 3)
const [part1]: number[] = max
const part2: number = max.reduce((acc: number, curr: number) => acc + curr, 0)
console.log(part1, part2)
