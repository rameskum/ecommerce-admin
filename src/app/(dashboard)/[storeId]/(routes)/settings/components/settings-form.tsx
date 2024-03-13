'use client';

import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Store } from '@prisma/client';
import { Trash } from 'lucide-react';
import React from 'react';

interface SettingfFormProps {
	initialData: Store;
}

const SettingsForm: React.FC<SettingfFormProps> = ({ initialData }) => {
	return (
		<>
			<div className="flex items-center justify-between">
				<Heading title="Settings" description="Manage store preference" />
				<Button variant="destructive" size="icon" onClick={() => {}}>
					<Trash className="size-4" />
				</Button>
			</div>
			<Separator />
		</>
	);
};

export default SettingsForm;
