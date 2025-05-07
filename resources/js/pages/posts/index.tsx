//import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts',
    },
];

interface PostType {
    id: number;
    title: string;
    content: string;
    category: string;
    status: string;
    image: string;
}

export default function Dashboard({ posts }: {posts: PostType[] }) {

    const {flash} = usePage<{ flash: { message?: string}}>().props;
    console.log(posts);

    useEffect(() => {
        if (flash.message) {
            //console.log(flash.message);
            toast.success(flash.message);
        }
    }, [flash.message]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                        <div className="relative w-full sm:w-1/3">
                            {/* time 1:16:05 */}
                            <Input id={'search'} className="peer ps-9" placeholder="Search..." type="search" />
                            <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                                <Search size={16} aria-hidden="true" />
                            </div>
                        </div>

                        <Button>
                            <Link href="/posts/create" prefetch>
                                Create Post
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#</TableHead>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Content</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {posts.map((post, index) => (
                                        <TableRow key={ post.id }>
                                            <TableCell>{ index + 1 }</TableCell>
                                            <TableCell>
                                                <img src={`/storage/${post.image}`} alt={post.title}
                                                     className="w-16 h-16 rounded-xl" />
                                            </TableCell>
                                            <TableCell>{ post.title }</TableCell>
                                            <TableCell>{ post.content }</TableCell>
                                            <TableCell>{ post.category }</TableCell>
                                            <TableCell>
                                                { post.status == '0' ?
                                                    <Badge className="bg-red-500">Inactive</Badge> :
                                                    <Badge className="bg-green-500">Active</Badge> }
                                            </TableCell>
                                            <TableCell className="space-x-1">
                                                <Button asChild size={'sm'}>
                                                    <Link href={`/posts/${post.id}/edit`} prefetch>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button size={'sm'} variant="destructive">
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AppLayout>
    );
}
