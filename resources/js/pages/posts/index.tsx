//import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';

import { Input } from '@/components/ui/input';
import { Search,  Pencil, Trash2, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import React, { useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { toast } from 'sonner';
import  InertiaPagination from '@/components/inertia-pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/posts',
    },
];

interface LinksType {
    url: string;
    label: string;
    active: boolean;
}
interface PostType {
    id: number;
    title: string;
    content: string;
    category: string;
    status: string;
    image: string;
}
interface PostsType {
    data: PostType[];
    links: LinksType[];
    from: number;
    to: number;
    total: number;
}

export default function Dashboard({ posts }: {posts: PostsType }) {

    const {flash} = usePage<{ flash: { message?: string}}>().props;
    //если в контроллере есть пагинация, добавляется posts.data
    //console.log(posts.data);

    useEffect(() => {
        if (flash.message) {
            //console.log(flash.message);
            toast.success(flash.message);
        }
    }, [flash.message]);

    // search functional (search engine)
    const handleSearch = useRef(
        debounce((query: string) => {
            router.get('/posts', {search: query}, {preserveState: true, replace: true});
        }, 500),
    ).current;

    // search method (method call search engine)
    function  onSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const query = e.target.value;
        handleSearch(query);
    }

    // delete post
    function deletePost(id: number) {
        if (confirm('Are you sure you want to delete this post ?')) {
            router.delete(`/posts/${id}`);
            //toast.success('Post deleted successfully');
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="rounded border p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-5">
                        <div className="relative w-full sm:w-1/3">
                            {/* time 1:16:05 */}
                            <Input id={'search'}
                                   className="peer ps-9"
                                   placeholder="Search..."
                                   type="search"
                                   onChange={onSearchChange}
                            />
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
                                    {posts.data.map((post, index) => (
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
                                                {/*<Button asChild size={'sm'}>
                                                    <Link href={`/posts/${post.id}/edit`} prefetch>
                                                        Edit
                                                    </Link>
                                                </Button>
                                                <Button onClick={() => deletePost(post.id)} size={'sm'} variant="destructive">
                                                    Delete
                                                </Button>*/}
                                                <Button variant="ghost"  size="icon" className="hover:bg-primary/10 hover:text-primary">
                                                    <Link href={`/posts/${post.id}/edit`} prefetch>
                                                        <Pencil className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" onClick={() => deletePost(post.id)}
                                                        size="icon"  className="hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <InertiaPagination posts={posts} />
                </div>
            </div>
        </AppLayout>
    );
}
