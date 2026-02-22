import csv
import os
import json

# Use current working directory
cwd = os.getcwd()
print(f'Current working directory: {cwd}')

# Try different path approaches
possible_roots = [
    cwd,
    '/vercel/share/v0-project',
    os.path.join(cwd, '..'),
]

project_root = None
for root in possible_roots:
    test_path = os.path.join(root, 'dataset_extraction', 'census_data_output', 'B25002_occupancy_status_zcta.csv')
    if os.path.exists(test_path):
        project_root = root
        print(f'Found project root: {project_root}')
        break

if not project_root:
    print('ERROR: Could not find project root')
    print('Searched in:', possible_roots)
    exit(1)

input_csv = os.path.join(project_root, 'dataset_extraction', 'census_data_output', 'B25002_occupancy_status_zcta.csv')
zipcode_csv = os.path.join(project_root, 'public', 'zipcode-data.csv')
output_csv = os.path.join(project_root, 'public', 'housing-data.csv')

print(f'Reading housing data from: {input_csv}')
print(f'Reading zipcode data from: {zipcode_csv}')

# Read housing data
housing_data = []
with open(input_csv, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        housing_data.append({
            'zcta': row['zcta'],
            'year': int(row['year']),
            'total_units': int(row['total_units']),
            'occupied_units': int(row['occupied_units']),
            'vacant_units': int(row['vacant_units'])
        })

print(f'Loaded {len(housing_data)} housing records')

# Read zipcode coordinates
coordinates_map = {}
with open(zipcode_csv, 'r') as f:
    reader = csv.DictReader(f)
    for row in reader:
        zipcode = row['zipcode']
        coordinates_map[zipcode] = {
            'latitude': float(row['latitude']),
            'longitude': float(row['longitude'])
        }

print(f'Loaded coordinates for {len(coordinates_map)} zipcodes')

# Calculate min and max for normalization
all_total_units = [d['total_units'] for d in housing_data]
min_units = min(all_total_units)
max_units = max(all_total_units)

print(f'Total units range: {min_units} - {max_units}')

# Merge and normalize data
output_data = []
for row in housing_data:
    zipcode = row['zcta']
    if zipcode in coordinates_map:
        # Normalize to 0-100 scale
        normalized_value = ((row['total_units'] - min_units) / (max_units - min_units)) * 100
        
        output_data.append({
            'zipcode': zipcode,
            'year': row['year'],
            'total_units': row['total_units'],
            'occupied_units': row['occupied_units'],
            'vacant_units': row['vacant_units'],
            'normalized_units': round(normalized_value, 2),
            'latitude': coordinates_map[zipcode]['latitude'],
            'longitude': coordinates_map[zipcode]['longitude']
        })

print(f'Created {len(output_data)} records with coordinates')

# Write combined output
with open(output_csv, 'w', newline='') as f:
    fieldnames = ['zipcode', 'year', 'total_units', 'occupied_units', 'vacant_units', 'normalized_units', 'latitude', 'longitude']
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(output_data)

print(f'✓ Written processed data to {output_csv}')

# Create year-specific files
for year in range(2011, 2023):
    year_data = [d for d in output_data if d['year'] == year]
    year_path = os.path.join(project_root, 'public', f'housing-data-{year}.csv')
    
    with open(year_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(year_data)
    
    print(f'✓ Created housing-data-{year}.csv with {len(year_data)} records')

print('✓ Data processing complete!')
