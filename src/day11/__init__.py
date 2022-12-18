import os
import re


def read_file(is_test):
    suffix = '_test' if is_test else ''
    file_path = "{base_dir}/inputs/day11{suffix}".format(
        base_dir=os.getcwd(), suffix=suffix)
    f = open(file_path, 'r')
    return f.read()


class Item():
    def __init__(self, value):
        self.value = value
        self.factors = self.factorize(value)

    def add(self, n):
        value = self.sum() + n
        self.factors = self.factorize(value)

    def multiply(self, n):
        # self.value *= n
        # self.factors = self.factorize(self.value)
        self.factors = [*self.factors, n]

    def pow2(self):
        self.factors = [*self.factors, *self.factors]
        # self.value **= 2

    def sum(self):
        sum = 1
        for i in self.factors:
            sum *= i
        return sum

    def is_divisible(self, n):
        return n in self.factors

    def factorize(self, n):
        primes = [2, 3, 5, 7, 11, 13, 17, 19, 23]
        factors = []
        for i in primes:
            if n % i == 0:
                factors.append(i)
                n //= i

        factors.append(n)
        return factors


class Monkey():
    def __init__(self, items, operation, test, true_target, false_target):
        self.items = items
        self.operation = operation
        self.test = test
        self.true_target = true_target
        self.false_target = false_target
        self.activity = 0

    def turn_part_one(self, monkeys):
        for item in self.items:
            new_item = self.inspect(item) // 3
            if new_item % self.test == 0:
                monkeys[self.true_target].items.append(new_item)
            else:
                monkeys[self.false_target].items.append(new_item)
        self.activity += len(self.items)
        self.items = []

    def turn_part_two(self, monkeys):
        for item in self.items:
            new_item = self.inspect_part_two(item)
            if new_item.is_divisible(self.test):
                monkeys[self.true_target].items.append(new_item)
            else:
                monkeys[self.false_target].items.append(new_item)

        self.activity += len(self.items)
        self.items = []

    def inspect(self, item):
        [_, operator, t2] = self.operation.split(' = ')[1].split(' ')
        term_two = item if t2 == 'old' else int(t2)
        if operator == '+':
            return item + term_two
        return item * term_two

    def inspect_part_two(self, item):
        [_, operator, t2] = self.operation.split(' = ')[1].split(' ')
        if operator == '+':
            item.add(int(t2))
            return item
        if t2 == 'old':
            item.pow2()
            return item
        item.multiply(int(t2))
        return item

    def get_terms(self, item):
        [t1, operator, t2] = self.operation.split(' = ')[1].split(' ')
        term_one = item if t1 == 'old' else int(t1)
        term_two = item if t2 == 'old' else int(t2)
        return (term_one, operator, term_two)


def parse_monkey(row):
    item_row, operation_row, test_row, true_row, false_row, * \
        _ = row.split('\n')
    items = [Item(int(val)) for val in item_row.split(': ')[1].split(', ')]
    operation = operation_row.split(': ')[1]
    test = int(test_row.split(': ')[1].split('divisible by ')[1])
    true_target = int(true_row.split(' throw to monkey ')[1])
    false_target = int(false_row.split(' throw to monkey ')[1])
    return Monkey(items, operation, test, true_target, false_target)


def run_part_one():
    raw_input = read_file(True)
    rows = re.split('Monkey \d+:\n', raw_input)
    monkeys = [parse_monkey(row) for row in rows[1:]]
    for _ in range(0, 20):
        for monkey in monkeys:
            monkey.turn_part_one(monkeys)

    print("PART ONE: {}".format([m.activity for m in monkeys]))


def run_part_two():
    raw_input = read_file(True)
    rows = re.split('Monkey \d+:\n', raw_input)
    monkeys = [parse_monkey(row) for row in rows[1:]]
    for round in range(0, 2000):
        for monkey in monkeys:
            monkey.turn_part_two(monkeys)

        if round % 100 == 0:
            print("Round: {}".format(round), [m.activity for m in monkeys])

    print("PART TWO: {}".format([m.activity for m in monkeys]))
