'use client';

import { Plus } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';

import ApiList from '@/components/ui/api-list';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

import { columns, SizeColumn } from './columns';

interface SizesClientProps {
	data: SizeColumn[];
}

export const SizesClient: React.FC<SizesClientProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();

	return (
		<>
			<div className="flex items-center justify-between">
				<Heading
					title={`Sizes (${data.length})`}
					description="Manage sizes for your store"
				/>
				<Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
					<Plus className="mr-2 size-4" />
					Add New
				</Button>
			</div>
			<Separator />
			<DataTable columns={columns} data={data} searchKey="name" />
			<Heading title="API" description="API Calls for sizes" />
			<Separator />
			<ApiList entityName="sizes" entityIdName="sizeId" />
		</>
	);
};
