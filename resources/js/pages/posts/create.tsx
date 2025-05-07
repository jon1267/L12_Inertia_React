import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Posts',
        href: '/create/posts',
    },
];

export default function Dashboard() {

    const {data, setData, post, errors, processing} = useForm<{
        title: string,
        category: string,
        status: string,
        content: string,
        image: File | null;
    }>({
        title: '',
        category: '',
        status: '',
        content: '',
        image: null,
    });

    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/posts');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border p-6 shadow-xl">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="text-xl text-slate-600">Create Post</div>

                        <Button>
                            <Link href="/posts" prefetch>
                                Go Back
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <form onSubmit={handleFormSubmit}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input
                                            type="text"
                                            id="title"
                                            placeholder="Enter Post Title"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            aria-invalid={!!errors.title}
                                        />
                                        <InputError message={errors.title} />
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <Label htmlFor="category">Category</Label>
                                        <Select value={data.category} onValueChange={(e) => setData('category', e)} >
                                            <SelectTrigger id="category" aria-invalid={!!errors.category}>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="marvel">Marvel</SelectItem>
                                                <SelectItem value="DC">DC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.category} />
                                    </div>

                                    <div className="col-span-2 md:col-span-1">
                                        <Label htmlFor="category">Status</Label>
                                        <Select value={data.status} onValueChange={(e) => setData('status', e)}>
                                            <SelectTrigger id="status" aria-invalid={!!errors.category}>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">Active</SelectItem>
                                                <SelectItem value="0">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <InputError message={errors.status} />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <Label htmlFor="content">Content</Label>
                                    <Textarea
                                        rows={6}
                                        id="content"
                                        placeholder="Type content here..."
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        aria-invalid={!!errors.content}
                                    />
                                    <InputError message={errors.content} />
                                </div>
                                <div className="mt-4">
                                    <Label htmlFor="image">Image</Label>
                                    <Input
                                        type="file"
                                        id="image"
                                        placeholder="Select image for post"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setData('image', file);
                                            }
                                        }}
                                        aria-invalid={!!errors.image}
                                    />
                                    <InputError message={errors.image} />
                                    { data.image && <img src={URL.createObjectURL(data.image)}
                                        alt="Preview" className="mt-2 h-24 object-cover rounded-xl" /> }
                                </div>

                                <div className="mt-4 text-end">
                                    <Button size={'lg'} type="submit" disabled={processing}>
                                        { processing && <Loader2 className="animate-spin" /> }
                                        <span>Create Post</span>
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
