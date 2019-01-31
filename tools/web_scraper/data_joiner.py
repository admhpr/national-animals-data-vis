# the idea here is to take the scraped national data and add it as 
# props of the world geo data set.
# source of world data set: https://github.com/johan/world.geo.json
from itertools import zip_longest
import json
import pprint


with open('world.geo.json', encoding='utf-8') as data_file:
    world_data = json.loads(data_file.read())

with open('national_animals.json', encoding='utf-8') as data_file:
    national_animals_list = json.loads(data_file.read())

animals_dict = {"name" : "national_animals", "data" : national_animals_list}

# ranges
# world data: 180
# national animals data: 80 
# matchable: 72

i = 0
while i < len(world_data['features']):
    world_data['features'][i]['properties']['country'] = world_data['features'][i]['properties'].pop('name')     
    world_data['features'][i]['properties']['national_animal']= []
    world_data['features'][i]['properties']['sci_name']= []
    world_data['features'][i]['properties']['media']= []

    for d in range(len(animals_dict['data'])):

        if(animals_dict['data'][d]["_values"]['country'] == world_data['features'][i]['properties']['country']):
            
            world_data['features'][i]['properties']['national_animal']= animals_dict['data'][d]["_values"]['animal']
            world_data['features'][i]['properties']['sci_name']= animals_dict['data'][d]["_values"]['sci_name']
            world_data['features'][i]['properties']['media']= animals_dict['data'][d]["_values"]['pic']
    i += 1

with open('national_animals_map.json', 'w') as outfile:
    json.dump(world_data, outfile, indent = 2)
