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
import { Color } from '@prisma/client';

const formSchema = z.object({
	name: z.string().min(1),
	value: z
		.string()
		.min(4)
		.regex(/^#/, { message: 'String must be a valid hex code' }),
});

type ColorFormValue = z.infer<typeof formSchema>;

interface ColorFormProps {
	initialData: Color | null;
}

const ColorForm: React.FC<ColorFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const title = initialData ? 'Edit Color' : 'Create Color';
	const description = initialData ? 'Edit a Color' : 'Add a new Color';
	const toastMessage = initialData ? 'Color updated.' : 'Color created.';
	const action = initialData ? 'Save Changes' : 'Create';

	const form = useForm<ColorFormValue>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {
			name: '',
			value: '',
		},
	});

	const onSubmit = async (data: ColorFormValue) => {
		try {
			setLoading(true);
			if (initialData) {
				await axios.patch(
					`/api/${params.storeId}/colors/${params.colorId}`,
					data
				);
			} else {
				await axios.post(`/api/${params.storeId}/colors`, data);
			}
			router.push(`/${params.storeId}/colors`);
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
			await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
			router.push(`/${params.storeId}/colors`);
			router.refresh();
			toast.success('Color deleted.');
		} catch (e) {
			console.error(e);
			toast.error('Make sure you remove all products using this color first.');
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
											placeholder="Color name"
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
										<div className="flex items-center gap-x-4">
											<Input
												disabled={loading}
												placeholder="Color value"
												{...field}
											/>
											<div
												className="p-4 rounded-full border"
												style={{ backgroundColor: field.value }}
											/>
										</div>
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

export default ColorForm;
