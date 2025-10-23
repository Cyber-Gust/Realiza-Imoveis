import properties from '@/data/properties.json';

export async function GET() {
  return Response.json(properties);
}
