# Electronic Parts Database

A simple web application for managing electronic component inventory built with Next.js, PostgreSQL, and shadcn/ui.

## Features

- **CRUD Operations**: Create, read, update, and delete electronic parts
- **Search & Filter**: Search by part number, name, or manufacturer. Filter by category
- **Clean UI**: Modern, responsive interface built with shadcn/ui and Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Flexible Schema**: JSONB specifications field for custom part data

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL with Prisma ORM
- **Development**: Docker Compose for local database

## Getting Started

### Prerequisites

- Node.js 18+ 
- Docker and Docker Compose
- npm or yarn

### Installation

1. **Clone and install dependencies**:
   ```bash
   npm install
   ```

2. **Start the database**:
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   ```

4. **Seed the database with sample data**:
   ```bash
   npm run db:seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

### Database Schema

The application uses a simple `parts` table with the following fields:

- `id` - Auto-increment primary key
- `part_number` - Unique part identifier
- `name` - Part name
- `description` - Optional description
- `manufacturer` - Optional manufacturer
- `category` - Part category (resistor, capacitor, IC, etc.)
- `quantity` - Current stock quantity
- `location` - Optional storage location
- `datasheet_url` - Optional link to datasheet
- `specifications` - JSONB field for flexible part specifications
- `created_at` / `updated_at` - Timestamps

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database with sample data

### API Endpoints

- `GET /api/parts` - List all parts (supports search and category filters)
- `POST /api/parts` - Create a new part
- `GET /api/parts/[id]` - Get a specific part
- `PUT /api/parts/[id]` - Update a part
- `DELETE /api/parts/[id]` - Delete a part

## Usage

1. **View Parts**: The main page displays all parts in a table with search and filter options
2. **Add Parts**: Click "New Part" to create a new electronic component entry
3. **Edit Parts**: Click the edit button on any row to modify part information
4. **Delete Parts**: Click the delete button to remove parts (with confirmation)
5. **Search**: Use the search bar to find parts by part number, name, or manufacturer
6. **Filter**: Use the category dropdown to filter parts by type

## Development

The application is built with modern React patterns and includes:

- **Type Safety**: Full TypeScript support
- **Responsive Design**: Mobile-friendly interface
- **Error Handling**: Proper error states and loading indicators
- **Form Validation**: Client-side validation for required fields
- **Database Relations**: Ready for future schema extensions

## License

MIT