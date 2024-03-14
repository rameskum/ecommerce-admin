'use client';

import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { CategoryColumn } from './columns';
import axios from 'axios';
import { AlertModal } from '@/components/modals/alert-modal';

interface CellActionProps {
	data: CategoryColumn;
}

const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const router = useRouter();
	const params = useParams();

	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	const onCopy = (id: string) => {
		navigator.clipboard.writeText(id);
		toast.success('Category Id copied to clipboard');
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/categories/${data.id}`);
			router.refresh();
			toast.success('Category deleted');
		} catch (e) {
			console.error(e);
			toast.error(
				'Make sure you remove all products using this category first.'
			);
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			<AlertModal
				isOpen={open}
				onClose={() => setOpen(false)}
				onConfirm={onDelete}
				loading={loading}
			/>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="size-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="size-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					<DropdownMenuItem onClick={() => onCopy(data.id)}>
						<Copy className="size-4 mr-4" />
						Copy Id
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							router.push(`/${params.storeId}/categories/${data.id}`);
						}}
					>
						<Edit className="size-4 mr-4" />
						Update
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setOpen(true)}>
						<Trash className="size-4 mr-4" />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

export default CellAction;
