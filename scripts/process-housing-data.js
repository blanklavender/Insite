import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// US ZIP code centroids dataset (a small subset for demonstration)
// In production, you'd want a complete ZIP code database
const zipCodeGeoData = {
  // This is a simplified mapping - you'll need a complete geocoding database
  // For now, we'll use a basic US centroid approach
};

async function fetchZipCodeCoordinates(zipcode) {
  // Using a free geocoding API (Nominatim) with rate limiting
  // In production, consider using a paid service or a local database
  const url = `https://nominatim.openstreetmap.org/search?postalcode=${zipcode}&country=US&format=json`;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Housing-Data-Viz/1.0'
      }
    });
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
  } catch (error) {
    console.error(`Error fetching coordinates for ${zipcode}:`, error.message);
  }
  
  return null;
}

async function processHousingData() {
  console.log('Processing housing data...');
  
  // Read the occupancy status data
  const csvPath = path.join(__dirname, '../dataset_extraction/census_data_output/B25002_occupancy_status_zcta.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  
  // Parse CSV
  const lines = csvContent.trim().split('\n');
  const headers = lines[0].split(',');
  
  const data = [];
  const zctaSet = new Set();
  
  // Parse all data
  lines.slice(1).forEach(line => {
    const values = line.split(',');
    const row = {
      zcta: values[0],
      year: parseInt(values[1]),
      total_units: parseInt(values[2]),
      occupied_units: parseInt(values[3]),
      vacant_units: parseInt(values[4])
    };
    data.push(row);
    zctaSet.add(row.zcta);
  });
  
  console.log(`Found ${data.length} records for ${zctaSet.size} unique zip codes`);
  
  // Group by year
  const dataByYear = {};
  for (let year = 2011; year <= 2022; year++) {
    dataByYear[year] = data.filter(d => d.year === year);
  }
  
  // Calculate statistics for normalization
  const allTotalUnits = data.map(d => d.total_units);
  const minUnits = Math.min(...allTotalUnits);
  const maxUnits = Math.max(...allTotalUnits);
  
  console.log(`Total units range: ${minUnits} - ${maxUnits}`);
  
  // For simplicity, we'll use the existing zipcode-data.csv coordinates
  // and match with our housing data
  const existingZipPath = path.join(__dirname, '../public/zipcode-data.csv');
  const existingZipContent = fs.readFileSync(existingZipPath, 'utf-8');
  const existingZipLines = existingZipContent.trim().split('\n');
  
  const coordinatesMap = {};
  existingZipLines.slice(1).forEach(line => {
    const parts = line.split(',');
    if (parts.length >= 5) {
      coordinatesMap[parts[0]] = {
        latitude: parseFloat(parts[3]),
        longitude: parseFloat(parts[4])
      };
    }
  });
  
  console.log(`Loaded coordinates for ${Object.keys(coordinatesMap).length} zip codes`);
  
  // Create output data with coordinates
  const outputData = [];
  
  data.forEach(row => {
    const coords = coordinatesMap[row.zcta];
    if (coords) {
      // Normalize total_units to 0-100 scale
      const normalizedValue = ((row.total_units - minUnits) / (maxUnits - minUnits)) * 100;
      
      outputData.push({
        zipcode: row.zcta,
        year: row.year,
        total_units: row.total_units,
        occupied_units: row.occupied_units,
        vacant_units: row.vacant_units,
        normalized_units: Math.round(normalizedValue * 100) / 100,
        latitude: coords.latitude,
        longitude: coords.longitude
      });
    }
  });
  
  console.log(`Created ${outputData.length} records with coordinates`);
  
  // Write to public directory
  const outputPath = path.join(__dirname, '../public/housing-data.csv');
  
  const csvOutput = [
    'zipcode,year,total_units,occupied_units,vacant_units,normalized_units,latitude,longitude',
    ...outputData.map(d => 
      `${d.zipcode},${d.year},${d.total_units},${d.occupied_units},${d.vacant_units},${d.normalized_units},${d.latitude},${d.longitude}`
    )
  ].join('\n');
  
  fs.writeFileSync(outputPath, csvOutput);
  console.log(`✓ Written processed data to ${outputPath}`);
  
  // Also create year-specific files for easier loading
  for (let year = 2011; year <= 2022; year++) {
    const yearData = outputData.filter(d => d.year === year);
    const yearPath = path.join(__dirname, `../public/housing-data-${year}.csv`);
    
    const yearCsvOutput = [
      'zipcode,year,total_units,occupied_units,vacant_units,normalized_units,latitude,longitude',
      ...yearData.map(d => 
        `${d.zipcode},${d.year},${d.total_units},${d.occupied_units},${d.vacant_units},${d.normalized_units},${d.latitude},${d.longitude}`
      )
    ].join('\n');
    
    fs.writeFileSync(yearPath, yearCsvOutput);
  }
  
  console.log('✓ Created year-specific data files');
  console.log('✓ Data processing complete!');
}

processHousingData().catch(console.error);
