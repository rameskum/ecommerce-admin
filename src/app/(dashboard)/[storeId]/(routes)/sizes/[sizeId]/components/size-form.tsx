'use client';

import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

import { AlertModal } from '@/components/modals/alert-modal';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Heading } from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Size } from '@prisma/client';

const formSchema = z.object({
	name: z.string().min(1),
	value: z.string().min(1),
});

type SizeFormValue = z.infer<typeof formSchema>;

interface SizeFormProps {
	initialData: Size | null;
}

const SizeForm: React.FC<SizeFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit Size' : 'Create Size';
	const description = initialData ? 'Edit a Size' : 'Add a new Size';
	const toastMessage = initialData ? 'Size updated.' : 'Size created.';
	const action = initialData ? 'Save Changes' : 'Create';

	const form = useForm<SizeFormValue>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			value: '',
		},
	});

	const onSubmit = async (data: SizeFormValue) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/sizes/${params.sizeId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/sizes`, data);
			}
			router.push(`/${params.storeId}/sizes`);
			router.refresh();
			toast.success(toastMessage);
		} catch (e) {
			console.error(e);
			toast.error('Something went wrong.');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
			router.push(`/${params.storeId}/sizes`);
			router.refresh();
			toast.success('Size deleted.');
		} catch (e) {
			console.error(e);
			toast.error('Make sure you remove all products using this size first.');
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
			></AlertModal>
			<div className="flex items-center justify-between">
				<Heading title={title} description={description} />
				{initialData && (
					<Button
						disabled={loading}
						variant="destructive"
						size="icon"
						onClick={() => setOpen(true)}
					>
						<Trash className="size-4" />
					</Button>
				)}
			</div>
			<Separator />
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="space-y-8 w-full"
				>
					<div className="grid grid-cols-3 gap-8">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Size name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="value"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Value</FormLabel>
									<FormControl>
										<Input
											disabled={loading}
											placeholder="Size value"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={loading} className="ml-auto" type="submit">
						{action}
					</Button>
				</form>
			</Form>
		</>
	);
};

export default SizeForm;
