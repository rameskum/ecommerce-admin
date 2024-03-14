'use client';

import { Trash } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

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
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client';
import { Input } from '@/components/ui/input';

interface SettingfFormProps {
	initialData: Store;
}

const formSchema = z.object({
	name: z.string().min(1),
});

type SettingsFromValue = z.infer<typeof formSchema>;

const SettingsForm: React.FC<SettingfFormProps> = ({ initialData }) => {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);

	const form = useForm<SettingsFromValue>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData,
	});

	const onSubmit = async (data: SettingsFromValue) => {
		console.log(data);
	};

	return (
		<>
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
		</>
	);
};

export default SettingsForm;
