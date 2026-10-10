import { NextRequest, NextResponse } from 'next/server';
import { getProducts, createProduct } from '@/lib/data/store-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const categorySlug = searchParams.get('category') || undefined;
    const searchQuery = searchParams.get('q') || undefined;
    const featuredOnly = searchParams.get('featured') === 'true';
    const newArrivalsOnly = searchParams.get('new') === 'true';

    const products = await getProducts({
      categorySlug,
      searchQuery,
      featuredOnly: featuredOnly || undefined,
      newArrivalsOnly: newArrivalsOnly || undefined,
    });

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('API /products GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.category_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required product attributes' },
        { status: 400 }
      );
    }

    const created = await createProduct(body);
    return NextResponse.json({ success: true, product: created }, { status: 201 });
  } catch (error) {
    console.error('API /products POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create product' }, { status: 500 });
  }
}
