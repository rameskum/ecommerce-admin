'use client';

import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as z from 'zod';

import { AlertModal } from '@/components/modals/alert-modal';
import { ApiAlert } from '@/components/ui/api-alert';
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
import { Store } from '@prisma/client';
import { useOrigin } from '@/hooks/use-origin';

interface SettingfFormProps {
	initialData: Store;
}

const formSchema = z.object({
	name: z.string().min(1),
});

type SettingsFromValue = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingfFormProps> = ({ initialData }) => {
	const params = useParams();
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const origin = useOrigin();

	const form = useForm<SettingsFromValue>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
	});

	const onSubmit = async (data: SettingsFromValue) => {
		try {
			setLoading(true);
			await axios.patch(`/api/stores/${params.storeId}`, data);
			router.refresh();
			toast.success('Store updated');
		} catch (e) {
			console.error(e);
			toast.error('Something went wrong');
		} finally {
			setLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setLoading(true);
			await axios.delete(`/api/stores/${params.storeId}`);
			router.refresh();
			window.location.assign('/');
			toast.success('Store deleted');
		} catch (e) {
			console.error(e);
			toast.error('Make sure you remove all products and categories first.');
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
				<Heading title="Settings" description="Manage store preference" />
				<Button
					disabled={loading}
					variant="destructive"
					size="icon"
					onClick={() => setOpen(true)}
				>
					<Trash className="size-4" />
				</Button>
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
											placeholder="Store name"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<Button disabled={loading} className="ml-auto" type="submit">
						Save Changes
					</Button>
				</form>
			</Form>
			<Separator />
			<ApiAlert
				title="NEXT_PUBLIC_API_URL"
				description={`${origin}/api/${params.storeId}`}
				varient="public"
			/>
		</>
	);
};

export default SettingsForm;
