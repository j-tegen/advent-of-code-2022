export const sumCaloriesByElf = (inventory: number[]): number[] => {
  const summarizedInventory: number[] = [0]
  inventory.forEach((item: number) => {
    if (!item) {
      summarizedInventory.push(0)
    } else {
      summarizedInventory[summarizedInventory.length - 1] += item
    }
  })
  return summarizedInventory
}

export const getMaxCalories = (
  summarizedInventory: number[],
  nbr: number = 3
): number[] => {
  return summarizedInventory.sort((a: number, b: number) => b - a).slice(0, nbr)
}
