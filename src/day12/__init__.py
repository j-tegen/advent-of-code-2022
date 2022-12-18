import os
import math


def read_file(is_test):
    suffix = '_test' if is_test else ''
    file_path = "{base_dir}/inputs/day12{suffix}".format(
        base_dir=os.getcwd(), suffix=suffix)
    f = open(file_path, 'r')
    return f.read()


def find_coordinates(map, target_char, max_col):
    points = []
    for i, row in enumerate(map):
        for j, col in enumerate(row):
            if col == target_char and j <= max_col:
                points.append((i, j))
    return points


def find_connections(topology, start, visited):
    (start_i, start_j) = start
    min_i = max(0, start_i - 1)
    min_j = max(0, start_j - 1)
    max_i = min(len(topology) - 1, start_i + 1)
    max_j = min(len(topology[start_i]) - 1, start_j + 1)
    neighbours = list(
        set([(start_i, max_j), (start_i, min_j), (min_i, start_j), (max_i, start_j)]))
    not_visited_neighbours = [
        point for point in neighbours if point not in visited]
    return [point for point in not_visited_neighbours if topology[point[0]][point[1]] - topology[start_i][start_j] <= 1]


def make_topology(raw_map):
    topology = []
    for row in raw_map:
        topology_row = []
        for c in row:
            if c == 'S':
                topology_row.append(ord('a') - 96)
            elif c == 'E':
                topology_row.append(ord('z') - 96)
            else:
                topology_row.append(ord(c) - 96)
        topology.append(topology_row)

    return topology


# Too slow
def walk(topology, start, end, visited, steps=0):
    if start == end:
        yield steps
    paths = find_connections(topology, start, visited)
    if len(paths) == 0:
        yield None
    for path in paths:
        yield from walk(topology, path, end, [*visited, path], steps + 1)


def make_graph(topology):
    graph = {}
    for i, row in enumerate(topology):
        for j, _ in enumerate(row):
            neighbours = find_connections(topology, (i, j), [(i, j)])
            node = 'n{i}.{j}'.format(i=i, j=j)
            graph[node] = {'n{ii}.{jj}'.format(
                ii=ii, jj=jj): 1 for (ii, jj) in neighbours}

    return graph


def dijkstra(graph, start, end):
    distances = {node: math.inf for node in graph}
    previous_nodes = {node: None for node in graph}

    distances[start] = 0
    unvisited_nodes = set(graph.keys())

    while unvisited_nodes:
        current_node = min(unvisited_nodes, key=lambda node: distances[node])
        if current_node == end:
            break

        unvisited_nodes.remove(current_node)

        for neigbour, _ in graph[current_node].items():
            new_distance = distances[current_node] + 1

            if new_distance < distances[neigbour]:
                distances[neigbour] = new_distance
                previous_nodes[neigbour] = current_node

    path = []
    current_node = end
    while current_node is not None:
        path.append(current_node)
        current_node = previous_nodes[current_node]

    return path


def run():
    raw_input = read_file(False)
    raw_map = raw_input.split('\n')
    topology = make_topology(raw_map)
    max_col = len(topology[0]) - 1
    start_part_one = find_coordinates(raw_map, 'S', max_col)[0]
    end = find_coordinates(raw_map, 'E', max_col)[0]
    graph = make_graph(topology)
    # Part one
    start_node = 'n{i}{j}'.format(i=start_part_one[0], j=start_part_one[1])
    end_node = 'n{i}{j}'.format(i=end[0], j=end[1])
    path = dijkstra(graph, start_node, end_node)
    print('Part one: ', len(path) - 1)

    # Part two
    starts = find_coordinates(raw_map, 'a', 2)
    lengths = []
    for start in starts:
        start_node = 'n{i}.{j}'.format(i=start[0], j=start[1])
        end_node = 'n{i}.{j}'.format(i=end[0], j=end[1])
        length = len(dijkstra(graph, start_node, end_node)) - 1
        lengths.append(length)

    # length = 0 means that there's no path available
    print('Part two: ', min([length for length in lengths if length > 0]))
