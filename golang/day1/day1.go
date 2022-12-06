package day1

import (
	"bufio"
	"fmt"
	"os"
	"sort"
	"strconv"

	"github.com/j-tegen/advent-of-code-2022/golang/utils"
)

func parseElves(file *os.File) []int {
	fileScanner := bufio.NewScanner(file)
	fileScanner.Split(bufio.ScanLines)

	elves := []int{0}
	for fileScanner.Scan() {
		row := fileScanner.Text()
		val, err := strconv.Atoi(row)
		if err == nil {
			elves[len(elves)-1] += val
		} else {
			elves = append(elves, 0)
		}
	}
	return elves
}

func sumElves(elves []int, nbr int) int {
	sort.Sort(sort.Reverse(sort.IntSlice(elves)))
	sum := 0
	for index, elf := range elves {
		sum += elf
		if index >= nbr-1 {
			return sum
		}
	}
	return sum
}

func Run(isTest bool) {
	file, _ := utils.ReadInput(1, isTest)
	elves := parseElves(file)
	partOne := sumElves(elves, 1)
	partTwo := sumElves(elves, 3)
	fmt.Println(partOne)
	fmt.Println(partTwo)
}
