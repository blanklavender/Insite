import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'dataset_extraction', 'census_data_output', 'B25002_occupancy_status_zcta.csv')
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error) {
    console.error('Error reading housing data:', error)
    return NextResponse.json({ error: 'Failed to load housing data' }, { status: 500 })
  }
}
