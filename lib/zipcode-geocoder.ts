/**
 * Approximate ZIP code geocoding based on ZIP code prefix ranges
 * This provides rough coordinates for US ZIP codes based on their first 3 digits
 */

interface ZipRange {
  prefix: string
  lat: number
  lng: number
  region: string
}

// Approximate centroids for ZIP code ranges (first 3 digits)
const ZIP_RANGES: ZipRange[] = [
  // Northeast
  { prefix: '006', lat: 40.85, lng: -73.87, region: 'Puerto Rico' },
  { prefix: '007', lat: 40.85, lng: -73.87, region: 'Puerto Rico' },
  { prefix: '008', lat: 40.85, lng: -73.87, region: 'Virgin Islands' },
  { prefix: '009', lat: 40.85, lng: -73.87, region: 'Puerto Rico' },
  { prefix: '010', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '011', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '012', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '013', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '014', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '015', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '016', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '017', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '018', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '019', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '020', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '021', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '022', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '023', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '024', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '025', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '026', lat: 42.36, lng: -71.06, region: 'MA' },
  { prefix: '027', lat: 42.36, lng: -71.06, region: 'MA' },
  // ... Add more ranges
  
  // New York  
  { prefix: '100', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '101', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '102', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '103', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '104', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '105', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '106', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '107', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '108', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '109', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '110', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '111', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '112', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '113', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '114', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '115', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '116', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '117', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '118', lat: 40.73, lng: -73.93, region: 'NY' },
  { prefix: '119', lat: 40.73, lng: -73.93, region: 'NY' },
  
  // Pennsylvania
  { prefix: '150', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '151', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '152', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '153', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '154', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '155', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '156', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '157', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '158', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '159', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '160', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '161', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '162', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '163', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '164', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '165', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '166', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '167', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '168', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '169', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '170', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '171', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '172', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '173', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '174', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '175', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '176', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '177', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '178', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '179', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '180', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '181', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '182', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '183', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '184', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '185', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '186', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '187', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '188', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '189', lat: 40.44, lng: -79.99, region: 'PA' },
  { prefix: '190', lat: 39.95, lng: -75.17, region: 'PA' },
  { prefix: '191', lat: 39.95, lng: -75.17, region: 'PA' },
  { prefix: '192', lat: 39.95, lng: -75.17, region: 'PA' },
  { prefix: '193', lat: 39.95, lng: -75.17, region: 'PA' },
  { prefix: '194', lat: 39.95, lng: -75.17, region: 'PA' },
  { prefix: '195', lat: 39.95, lng: -75.17, region: 'PA' },
  { prefix: '196', lat: 39.95, lng: -75.17, region: 'PA' },
  
  // Texas
  { prefix: '750', lat: 31.76, lng: -106.49, region: 'TX' },
  { prefix: '751', lat: 31.76, lng: -106.49, region: 'TX' },
  { prefix: '752', lat: 31.76, lng: -106.49, region: 'TX' },
  { prefix: '753', lat: 29.76, lng: -95.37, region: 'TX' },
  { prefix: '754', lat: 29.76, lng: -95.37, region: 'TX' },
  { prefix: '755', lat: 29.76, lng: -95.37, region: 'TX' },
  { prefix: '756', lat: 29.42, lng: -98.49, region: 'TX' },
  { prefix: '757', lat: 29.42, lng: -98.49, region: 'TX' },
  { prefix: '758', lat: 29.42, lng: -98.49, region: 'TX' },
  { prefix: '759', lat: 32.78, lng: -96.80, region: 'TX' },
  { prefix: '760', lat: 32.78, lng: -96.80, region: 'TX' },
  { prefix: '761', lat: 32.78, lng: -96.80, region: 'TX' },
  { prefix: '762', lat: 32.78, lng: -96.80, region: 'TX' },
  { prefix: '763', lat: 32.78, lng: -96.80, region: 'TX' },
  { prefix: '764', lat: 32.78, lng: -96.80, region: 'TX' },
  { prefix: '765', lat: 32.78, lng: -96.80, region: 'TX' },
  { prefix: '766', lat: 33.58, lng: -101.89, region: 'TX' },
  { prefix: '767', lat: 32.75, lng: -97.33, region: 'TX' },
  { prefix: '768', lat: 32.75, lng: -97.33, region: 'TX' },
  { prefix: '769', lat: 32.75, lng: -97.33, region: 'TX' },
  { prefix: '770', lat: 29.76, lng: -95.37, region: 'TX' },
  { prefix: '771', lat: 29.76, lng: -95.37, region: 'TX' },
  { prefix: '772', lat: 29.76, lng: -95.37, region: 'TX' },
  { prefix: '773', lat: 29.76, lng: -95.37, region: 'TX' },
  { prefix: '774', lat: 29.76, lng: -95.37, region: 'TX' },
  { prefix: '775', lat: 29.76, lng: -95.37, region: 'TX' },
  { prefix: '776', lat: 28.03, lng: -97.04, region: 'TX' },
  { prefix: '777', lat: 28.03, lng: -97.04, region: 'TX' },
  { prefix: '778', lat: 29.42, lng: -98.49, region: 'TX' },
  { prefix: '779', lat: 29.42, lng: -98.49, region: 'TX' },
  { prefix: '780', lat: 30.27, lng: -97.74, region: 'TX' },
  { prefix: '781', lat: 30.27, lng: -97.74, region: 'TX' },
  { prefix: '782', lat: 30.27, lng: -97.74, region: 'TX' },
  { prefix: '783', lat: 30.27, lng: -97.74, region: 'TX' },
  { prefix: '784', lat: 30.27, lng: -97.74, region: 'TX' },
  { prefix: '785', lat: 26.19, lng: -98.23, region: 'TX' },
  { prefix: '786', lat: 30.60, lng: -96.34, region: 'TX' },
  { prefix: '787', lat: 30.60, lng: -96.34, region: 'TX' },
  { prefix: '788', lat: 28.03, lng: -97.04, region: 'TX' },
  { prefix: '789', lat: 28.81, lng: -100.01, region: 'TX' },
  { prefix: '790', lat: 33.58, lng: -101.89, region: 'TX' },
  { prefix: '791', lat: 33.58, lng: -101.89, region: 'TX' },
  { prefix: '792', lat: 31.86, lng: -102.37, region: 'TX' },
  { prefix: '793', lat: 31.86, lng: -102.37, region: 'TX' },
  { prefix: '794', lat: 31.86, lng: -102.37, region: 'TX' },
  { prefix: '795', lat: 33.58, lng: -101.89, region: 'TX' },
  { prefix: '796', lat: 32.45, lng: -99.73, region: 'TX' },
  { prefix: '797', lat: 31.45, lng: -100.44, region: 'TX' },
  { prefix: '798', lat: 31.76, lng: -106.49, region: 'TX' },
  { prefix: '799', lat: 31.76, lng: -106.49, region: 'TX' },
  
  // California
  { prefix: '900', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '901', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '902', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '903', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '904', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '905', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '906', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '907', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '908', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '910', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '911', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '912', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '913', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '914', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '915', lat: 34.05, lng: -118.24, region: 'CA' },
  { prefix: '916', lat: 38.58, lng: -121.49, region: 'CA' },
  { prefix: '917', lat: 38.58, lng: -121.49, region: 'CA' },
  { prefix: '918', lat: 38.58, lng: -121.49, region: 'CA' },
  { prefix: '919', lat: 32.71, lng: -117.16, region: 'CA' },
  { prefix: '920', lat: 32.71, lng: -117.16, region: 'CA' },
  { prefix: '921', lat: 32.71, lng: -117.16, region: 'CA' },
  { prefix: '922', lat: 33.77, lng: -116.96, region: 'CA' },
  { prefix: '923', lat: 33.77, lng: -116.96, region: 'CA' },
  { prefix: '924', lat: 34.09, lng: -117.43, region: 'CA' },
  { prefix: '925', lat: 33.83, lng: -116.54, region: 'CA' },
  { prefix: '926', lat: 33.95, lng: -116.24, region: 'CA' },
  { prefix: '927', lat: 33.11, lng: -115.56, region: 'CA' },
  { prefix: '928', lat: 34.43, lng: -119.62, region: 'CA' },
  { prefix: '930', lat: 36.33, lng: -119.29, region: 'CA' },
  { prefix: '931', lat: 35.37, lng: -119.02, region: 'CA' },
  { prefix: '932', lat: 36.75, lng: -119.77, region: 'CA' },
  { prefix: '933', lat: 36.75, lng: -119.77, region: 'CA' },
  { prefix: '934', lat: 35.30, lng: -120.66, region: 'CA' },
  { prefix: '935', lat: 37.35, lng: -121.96, region: 'CA' },
  { prefix: '936', lat: 36.60, lng: -121.89, region: 'CA' },
  { prefix: '937', lat: 36.97, lng: -122.03, region: 'CA' },
  { prefix: '938', lat: 37.35, lng: -121.96, region: 'CA' },
  { prefix: '939', lat: 36.75, lng: -119.77, region: 'CA' },
  { prefix: '940', lat: 37.77, lng: -122.42, region: 'CA' },
  { prefix: '941', lat: 37.77, lng: -122.42, region: 'CA' },
  { prefix: '942', lat: 38.45, lng: -122.71, region: 'CA' },
  { prefix: '943', lat: 37.35, lng: -121.96, region: 'CA' },
  { prefix: '944', lat: 37.35, lng: -121.96, region: 'CA' },
  { prefix: '945', lat: 37.35, lng: -121.96, region: 'CA' },
  { prefix: '946', lat: 37.35, lng: -121.96, region: 'CA' },
  { prefix: '947', lat: 37.68, lng: -121.76, region: 'CA' },
  { prefix: '948', lat: 37.99, lng: -121.30, region: 'CA' },
  { prefix: '949', lat: 38.58, lng: -121.49, region: 'CA' },
  { prefix: '950', lat: 38.58, lng: -121.49, region: 'CA' },
  { prefix: '951', lat: 38.58, lng: -121.49, region: 'CA' },
  { prefix: '952', lat: 39.73, lng: -121.84, region: 'CA' },
  { prefix: '953', lat: 38.58, lng: -121.49, region: 'CA' },
  { prefix: '954', lat: 38.45, lng: -122.71, region: 'CA' },
  { prefix: '955', lat: 40.59, lng: -122.39, region: 'CA' },
  { prefix: '956', lat: 40.59, lng: -122.39, region: 'CA' },
  { prefix: '957', lat: 40.59, lng: -122.39, region: 'CA' },
  { prefix: '958', lat: 40.59, lng: -122.39, region: 'CA' },
  { prefix: '959', lat: 41.73, lng: -122.63, region: 'CA' },
  { prefix: '960', lat: 39.16, lng: -123.21, region: 'CA' },
  { prefix: '961', lat: 39.16, lng: -123.21, region: 'CA' },
]

const prefixMap = new Map<string, ZipRange>()
ZIP_RANGES.forEach(range => {
  prefixMap.set(range.prefix, range)
})

/**
 * Get approximate coordinates for a ZIP code
 */
export function getZipCodeCoordinates(zipcode: string): { lat: number; lng: number } | null {
  // Normalize to 5 digits
  const normalized = zipcode.padStart(5, '0')
  const prefix = normalized.substring(0, 3)
  
  const range = prefixMap.get(prefix)
  if (range) {
    // Add small random offset to avoid overlapping points (within ~10km)
    const latOffset = (Math.random() - 0.5) * 0.1
    const lngOffset = (Math.random() - 0.5) * 0.1
    return {
      lat: range.lat + latOffset,
      lng: range.lng + lngOffset
    }
  }
  
  return null
}
