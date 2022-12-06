package utils

import (
	"fmt"
	"os"
	"path/filepath"
)

func Check(e error) {
	if e != nil {
		panic(e)
	}
}

func ReadInput(day int, isTest bool) (*os.File, error) {
	pwd, _ := os.Getwd()
	prefix := fmt.Sprintf("day%d", day)
	var file string
	if isTest {
		file = fmt.Sprintf("%s_test", prefix)
	} else {
		file = prefix
	}
	return os.Open(filepath.Join(pwd, "inputs", file))
}
