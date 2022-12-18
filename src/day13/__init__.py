import os
import re
import functools


def read_file(is_test):
    suffix = '_test' if is_test else ''
    file_path = "{base_dir}/inputs/day13{suffix}".format(
        base_dir=os.getcwd(), suffix=suffix)
    f = open(file_path, 'r')
    return f.read()


def parse_packet_pairs(raw_input):
    rows = re.split('\n\n', raw_input)
    packets = []
    for row in rows:
        left, right, *_ = row.split('\n')
        packets.append({'left': eval(left), 'right': eval(right)})
    return packets


def parse_packets(raw_input):
    rows = re.split('\n\n', raw_input)
    packets = []
    for row in rows:
        left, right, *_ = row.split('\n')
        packets.append(eval(left))
        packets.append(eval(right))
    return packets


def compare_packet_pair(left, right, level=1):
    for index, left_value in enumerate(left):
        if index >= len(right):
            return -1

        right_value = right[index]
        left_type = type(left_value)
        right_type = type(right_value)

        if left_type == int and right_type == int:
            if left_value < right_value:
                return 1
            if right_value < left_value:
                return -1

        if left_type == list and right_type == list:
            val = compare_packet_pair(left_value, right_value, level + 1)
            if val == 1 or val == -1:
                return val

        if left_type == list and right_type == int:
            val = compare_packet_pair(left_value, [right_value], level + 1)
            if val == 1 or val == -1:
                return val

        if left_type == int and right_type == list:
            val = compare_packet_pair([left_value], right_value, level + 1)
            if val == 1 or val == -1:
                return val

    if len(right) > len(left):
        return 1


def run():
    raw_input = read_file(False)
    packet_pairs = parse_packet_pairs(raw_input)
    result = [(index + 1, compare_packet_pair(packet['left'], packet['right']))
              for index, packet in enumerate(packet_pairs)]
    part_one = 0
    for index, val in result:
        if val == 1:
            part_one += index
    print(part_one)

    divider_packets = [[[2]], [[6]]]
    packet_list = [*parse_packets(raw_input), *divider_packets]
    sorted_packets = sorted(
        packet_list, key=functools.cmp_to_key(compare_packet_pair), reverse=True)
    divider_packet_indices = [index + 1 for index, packet in enumerate(
        sorted_packets) if packet in divider_packets]
    part_two = divider_packet_indices[0] * divider_packet_indices[1]
    print(part_two)
