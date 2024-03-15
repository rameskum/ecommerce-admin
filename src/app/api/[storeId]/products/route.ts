import { NextResponse } from 'next/server';

import prismadb from '@/lib/prismadb';
import { auth } from '@clerk/nextjs';

export async function POST(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { userId } = auth();
		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 401 });
		}
		const body = await req.json();
		const {
			name,
			price,
			categoryId,
			colorId,
			sizeId,
			images,
			isFeatured,
			isArchived,
		} = body;

		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}

		if (!price) {
			return new NextResponse('Price is required', { status: 400 });
		}

		if (!categoryId) {
			return new NextResponse('CategoryId is required', { status: 400 });
		}

		if (!colorId) {
			return new NextResponse('ColorId is required', { status: 400 });
		}

		if (!sizeId) {
			return new NextResponse('SizeId is required', { status: 400 });
		}

		if (!images || !images.length) {
			return new NextResponse('Images are required', { status: 400 });
		}

		if (!params.storeId) {
			return new NextResponse('Store Id is required', { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				userId: userId,
				id: params.storeId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 403 });
		}

		const product = await prismadb.product.create({
			data: {
				name,
				price,
				isFeatured,
				isArchived,
				colorId,
				sizeId,
				categoryId,
				storeId: params.storeId,
				images: {
					createMany: {
						data: [...images.map((image: { url: string }) => image)],
					},
				},
			},
		});

		return NextResponse.json(product);
	} catch (e) {
		console.error('[PRODUCTS_POST]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}

export async function GET(
	req: Request,
	{ params }: { params: { storeId: string } }
) {
	try {
		const { searchParams } = new URL(req.url);
		const categoryId = searchParams.get('categoryId') || undefined;
		const colorId = searchParams.get('colorId') || undefined;
		const sizeId = searchParams.get('sizeId') || undefined;
		const isFeatured = searchParams.get('isFeatured');

		if (!params.storeId) {
			return new NextResponse('Store id is required', { status: 400 });
		}

		const products = await prismadb.product.findMany({
			where: {
				storeId: params.storeId,
				categoryId,
				colorId,
				sizeId,
				isFeatured: isFeatured ? true : undefined,
				isArchived: false,
			},
			include: {
				images: true,
				category: true,
				color: true,
				size: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		});

		return NextResponse.json(products);
	} catch (e) {
		console.error('[PRODUCTS_GET]', e);
		return new NextResponse('Internal Server Error', { status: 500 });
	}
}
