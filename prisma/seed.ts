import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample electronic parts
  const parts = [
    {
      part_number: 'R-1K-0603',
      name: '1K Ohm Resistor',
      description: '1K ohm, 1/4W, 5% tolerance, 0603 package',
      manufacturer: 'Yageo',
      category: 'resistor',
      quantity: 100,
      location: 'Drawer A1',
      datasheet_url: 'https://example.com/datasheet1.pdf',
      specifications: {
        resistance: '1K ohm',
        power_rating: '1/4W',
        tolerance: '5%',
        package: '0603',
        temperature_coefficient: '100 ppm/°C'
      }
    },
    {
      part_number: 'C-100nF-0603',
      name: '100nF Ceramic Capacitor',
      description: '100nF, 50V, X7R, 0603 package',
      manufacturer: 'Murata',
      category: 'capacitor',
      quantity: 50,
      location: 'Drawer B2',
      datasheet_url: 'https://example.com/datasheet2.pdf',
      specifications: {
        capacitance: '100nF',
        voltage_rating: '50V',
        dielectric: 'X7R',
        package: '0603',
        tolerance: '10%'
      }
    },
    {
      part_number: 'IC-ATMEGA328P',
      name: 'ATmega328P Microcontroller',
      description: '8-bit AVR microcontroller, 32KB flash, 2KB RAM',
      manufacturer: 'Microchip',
      category: 'IC',
      quantity: 5,
      location: 'ESD Safe Box',
      datasheet_url: 'https://example.com/datasheet3.pdf',
      specifications: {
        architecture: '8-bit AVR',
        flash_memory: '32KB',
        ram: '2KB',
        eeprom: '1KB',
        package: 'DIP-28',
        operating_voltage: '1.8V - 5.5V'
      }
    },
    {
      part_number: 'LED-RED-5MM',
      name: 'Red LED 5mm',
      description: 'Red LED, 5mm, 20mA forward current',
      manufacturer: 'Kingbright',
      category: 'LED',
      quantity: 25,
      location: 'Drawer C3',
      specifications: {
        color: 'Red',
        forward_voltage: '2.0V',
        forward_current: '20mA',
        package: '5mm',
        viewing_angle: '30°'
      }
    },
    {
      part_number: 'CONN-HEADER-2.54',
      name: '2.54mm Pin Header',
      description: '2.54mm pitch, 40-pin, straight header',
      manufacturer: 'Sullins',
      category: 'connector',
      quantity: 10,
      location: 'Drawer D1',
      specifications: {
        pitch: '2.54mm',
        pins: 40,
        orientation: 'straight',
        material: 'PBT',
        plating: 'Gold'
      }
    }
  ]

  for (const part of parts) {
    await prisma.part.create({
      data: part
    })
  }

  console.log('Seed data created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
