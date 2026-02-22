'use client'

import { useEffect, useState, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card } from '@/components/ui/card'
import { getZipCodeCoordinates } from '@/lib/zipcode-geocoder'

// Mapbox access token from environment
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYWJoaXJhc3RvZ2k4MDAiLCJhIjoiY21seDkzdTh3MGp2eTNkb2oyZWM2ZDZiZCJ9.aBgaZF9WCksZNbiDeXs5DQ'

interface HousingData {
  zipcode: string
  year: number
  total_units: number
  occupied_units: number
  vacant_units: number
  normalized_units: number
  latitude: number
  longitude: number
}

export function HousingHeatmap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [selectedYear, setSelectedYear] = useState<string>('2022')
  const [housingData, setHousingData] = useState<HousingData[]>([])
  const [loading, setLoading] = useState(true)
  const [minValue, setMinValue] = useState(0)
  const [maxValue, setMaxValue] = useState(100)

  const years = Array.from({ length: 12 }, (_, i) => 2011 + i)

  // Load and process data
  useEffect(() => {
    async function loadData() {
      try {
        console.log('[v0] Starting data load...')
        
        // Load housing occupancy data
        const housingResponse = await fetch('/api/housing-data')
        if (!housingResponse.ok) {
          throw new Error(`Failed to fetch housing data: ${housingResponse.status}`)
        }
        const housingText = await housingResponse.text()
        console.log('[v0] Housing data loaded, length:', housingText.length)
        
        const housingLines = housingText.trim().split('\n')
        const housingHeaders = housingLines[0].split(',')
        console.log('[v0] Housing headers:', housingHeaders)
        console.log('[v0] Housing data lines:', housingLines.length)
        
        const housingRecords: HousingData[] = []
        for (let i = 1; i < housingLines.length; i++) {
          const values = housingLines[i].split(',')
          if (values.length >= 5) {
            const totalUnits = parseInt(values[2])
            if (!isNaN(totalUnits)) {
              housingRecords.push({
                zipcode: values[0],
                year: parseInt(values[1]),
                total_units: totalUnits,
                occupied_units: parseInt(values[3]),
                vacant_units: parseInt(values[4]),
                normalized_units: 0, // Will calculate
                latitude: 0, // Will populate
                longitude: 0 // Will populate
              })
            }
          }
        }
        console.log('[v0] Parsed housing records:', housingRecords.length)

        // Use the geocoder to get coordinates for all zipcodes
        const coordsMap = new Map<string, { lat: number; lng: number }>()
        const uniqueZips = new Set(housingRecords.map(r => r.zipcode))
        
        console.log('[v0] Geocoding', uniqueZips.size, 'unique zip codes...')
        
        uniqueZips.forEach(zip => {
          const coords = getZipCodeCoordinates(zip)
          if (coords) {
            coordsMap.set(zip, coords)
          }
        })
        
        console.log('[v0] Successfully geocoded:', coordsMap.size, 'zipcodes')

        // Calculate normalization values
        const allTotalUnits = housingRecords.map(r => r.total_units)
        const min = Math.min(...allTotalUnits)
        const max = Math.max(...allTotalUnits)
        console.log('[v0] Unit range:', min, '-', max)
        setMinValue(min)
        setMaxValue(max)

        // Merge and normalize
        const merged = housingRecords
          .filter(r => coordsMap.has(r.zipcode))
          .map(r => {
            const coord = coordsMap.get(r.zipcode)!
            const normalized = ((r.total_units - min) / (max - min)) * 100
            return {
              ...r,
              normalized_units: normalized,
              latitude: coord.lat,
              longitude: coord.lng
            }
          })

        console.log('[v0] Merged records:', merged.length)
        console.log('[v0] Sample merged record:', merged[0])
        
        setHousingData(merged)
        setLoading(false)
      } catch (error) {
        console.error('[v0] Error loading data:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || loading) return

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-98.5795, 39.8283], // Center of US
      zoom: 3.5
    })

    map.current.on('load', () => {
      console.log('[v0] Map loaded')
    })

    return () => {
      map.current?.remove()
    }
  }, [loading])

  // Update heatmap when year changes
  useEffect(() => {
    if (!map.current || housingData.length === 0) return

    const yearData = housingData.filter(d => d.year === parseInt(selectedYear))
    console.log('[v0] Updating map for year', selectedYear, ':', yearData.length, 'records')

    // Convert to GeoJSON
    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: yearData.map(d => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [d.longitude, d.latitude]
        },
        properties: {
          normalized_units: d.normalized_units,
          total_units: d.total_units,
          zipcode: d.zipcode
        }
      }))
    }

    if (map.current.getSource('housing')) {
      const source = map.current.getSource('housing') as mapboxgl.GeoJSONSource
      source.setData(geojson)
    } else {
      map.current.addSource('housing', {
        type: 'geojson',
        data: geojson
      })

      // Add heatmap layer with pastel colors
      map.current.addLayer({
        id: 'housing-heat',
        type: 'heatmap',
        source: 'housing',
        maxzoom: 15,
        paint: {
          // Increase weight based on normalized value
          'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'normalized_units'],
            0, 0,
            100, 1
          ],
          // Increase intensity as zoom level increases
          'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 0.5,
            15, 1.5
          ],
          // Pastel color palette: light blue → soft pink → light coral
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(236, 252, 255, 0)', // Transparent light cyan
            0.2, 'rgba(179, 229, 252, 0.4)', // Pastel sky blue
            0.4, 'rgba(147, 197, 253, 0.6)', // Soft blue
            0.6, 'rgba(251, 207, 232, 0.7)', // Pastel pink
            0.8, 'rgba(253, 164, 175, 0.8)', // Light coral pink
            1, 'rgba(254, 202, 202, 0.9)' // Soft coral
          ],
          // Adjust radius by zoom level
          'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 3,
            15, 20
          ],
          // Transition from heatmap to circle layer by zoom level
          'heatmap-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            7, 0.8,
            15, 0.3
          ]
        }
      })

      // Add circle layer for high zoom levels with pastel colors
      map.current.addLayer({
        id: 'housing-point',
        type: 'circle',
        source: 'housing',
        minzoom: 10,
        paint: {
          // Size circles based on normalized value
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'normalized_units'],
            0, 3,
            100, 12
          ],
          // Color circles with pastel gradient
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'normalized_units'],
            0, '#B3E5FC', // Light blue
            25, '#93C5FD', // Soft blue
            50, '#FBCFE8', // Pastel pink
            75, '#FBA4AF', // Light coral
            100, '#FECACA' // Soft coral
          ],
          'circle-stroke-color': '#fff',
          'circle-stroke-width': 1,
          'circle-opacity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 0,
            12, 0.8
          ]
        }
      })

      // Add popup on hover
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      })

      map.current.on('mouseenter', 'housing-point', (e) => {
        if (!map.current || !e.features || !e.features[0]) return
        map.current.getCanvas().style.cursor = 'pointer'

        const feature = e.features[0]
        const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice()
        const { zipcode, total_units, normalized_units } = feature.properties as any

        popup
          .setLngLat([coordinates[0], coordinates[1]] as [number, number])
          .setHTML(`
            <div style="padding: 8px; font-family: sans-serif;">
              <div style="font-weight: 600; margin-bottom: 4px;">ZIP: ${zipcode}</div>
              <div style="font-size: 13px; color: #666;">
                <div>Total Units: ${total_units.toLocaleString()}</div>
                <div>Normalized: ${normalized_units.toFixed(1)}/100</div>
              </div>
            </div>
          `)
          .addTo(map.current)
      })

      map.current.on('mouseleave', 'housing-point', () => {
        if (!map.current) return
        map.current.getCanvas().style.cursor = ''
        popup.remove()
      })
    }
  }, [selectedYear, housingData])

  return (
    <div className="relative w-full h-full">
      {/* Controls */}
      <Card className="absolute top-4 left-4 z-10 p-4 bg-white/95 backdrop-blur">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Year</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Legend */}
      <Card className="absolute bottom-4 left-4 z-10 p-4 bg-white/95 backdrop-blur">
        <div className="space-y-2">
          <div className="text-sm font-medium">Housing Units Density</div>
          <div className="flex items-center gap-2">
            <div className="w-32 h-4 rounded" style={{
              background: 'linear-gradient(to right, #B3E5FC, #93C5FD, #FBCFE8, #FBA4AF, #FECACA)'
            }}></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Low</span>
            <span>High</span>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Range: {minValue.toLocaleString()} - {maxValue.toLocaleString()} units
          </div>
        </div>
      </Card>

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/80">
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
            <div className="text-sm text-muted-foreground">Loading housing data...</div>
          </div>
        </div>
      )}

      {/* Map container */}
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  )
}
