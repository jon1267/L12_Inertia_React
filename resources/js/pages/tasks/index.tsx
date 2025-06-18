import { Head, router, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
//import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, CheckCircle2, XCircle, Calendar, List, CheckCircle, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Dashboard from '../dashboard';
import InputError from '@/components/input-error';

interface Task {
    id: number;
    title: string;
    description: string | null;
    is_completed: boolean;
    due_date: string | null;
    image: string | null;
    lists_id: number;
    lists: {
        id: number;
        title: string;
    };
}

interface List {
    id: number;
    title: string;
}

interface Props {
    tasks: {
        data: Task[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    lists: List[];
    filters: {
        search: string;
        filter: string;
    };
    flash?: {
        message?: string;
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

export default function TasksIndex({ tasks, lists, filters, flash }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');
    const [searchTerm, setSearchTerm] = useState(filters.search);
    const [completionFilter, setCompletionFilter] = useState<'all' | 'completed' | 'pending'>(filters.filter as 'all' | 'completed' | 'pending');

    useEffect(() => {
        /*if (flash?.success) {
            setToastMessage(flash?.success);
            setToastType('success'); // (flash.success ? 'success' : 'error')
            setShowToast(true);
        } else */
        if (flash?.message) {
            setToastMessage(flash?.message);
            setToastType('success');
            setShowToast(true);
        } else if (flash?.error) {
            setToastMessage(flash.error);
            setToastType('error');
            setShowToast(true);
        }
    }, [flash]);

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false)
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    const {data, setData, post, put, errors, processing, reset, delete: destroy} = useForm({
        title: '',
        description: '',
        due_date: '',
        lists_id: '',
        is_completed: false as boolean,
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //console.log(tasks);
        if (editingTask) {
            put(route('tasks.update', editingTask.id), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                    setEditingTask(null);
                },
            });
        } else {
            post(route('tasks.store'), {
                onSuccess: () => {
                    setIsOpen(false);
                    reset();
                },
            });
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setData({
            'title': task.title,
            'description': task.description || '',
            'due_date': task.due_date || '',
            'lists_id': task.lists_id.toString(),
            'is_completed': task.is_completed,
            'image': null, // Reset image to null when editing
        });
        setIsOpen(true);
    };

    const handleDelete = (task: Task) => {
        destroy(route('tasks.destroy', task.id));
    };

    // time 1:07:30
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(route('tasks.index'), {
            search: searchTerm,
            filter: completionFilter,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleFilterChange = (value: 'all' | 'completed' | 'pending') => {
        setCompletionFilter(value);
        router.get(route('tasks.index'), {
            search: searchTerm,
            filter: value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            route('tasks.index'),
            {
                page: page,
                search: searchTerm,
                filter: completionFilter,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="from-background to-muted/20 flex h-full flex-1 flex-col gap-6 rounded-xl bg-gradient-to-br p-6">
                {showToast && (
                    <div
                        className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg p-4 shadow-lg ${
                            toastType === 'success' ? 'bg-green-500' : 'bg-red-500'
                        } animate-in fade-in slide-in-from-top-5 text-white`}
                    >
                        {toastType === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                        <span>{toastMessage}</span>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>{' '}
                        <p className="text-muted-foreground mt-1">Manage your tasks and stay organized</p>
                    </div>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger>
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg">
                                <Plus className="mr-2 h-4 w-4" />
                                New Task
                            </Button>{' '}
                        </DialogTrigger>{' '}
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle className="text-xl">{editingTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>{' '}
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>{' '}
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        required
                                        className="focus:ring-primary focus:ring-2"
                                    />
                                    <InputError message={errors.title} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>{' '}
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="focus:ring-primary focus:ring-2"
                                    />
                                    <InputError message={errors.description} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="list_id">List</Label>{' '}
                                    <Select value={data.lists_id} onValueChange={(value) => setData('lists_id', value)}>
                                        <SelectTrigger className="focus:ring-primary focus:ring-2">
                                            <SelectValue placeholder="Select a list" />
                                        </SelectTrigger>{' '}
                                        <SelectContent>
                                            {lists.map((list) => (
                                                <SelectItem key={list.id} value={list.id.toString()}>
                                                    {list.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>{' '}
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="image">Image</Label>
                                    <Input type="file" id="image" placeholder="Image for List"
                                       onChange={(e) => {
                                           const file = e.target.files?.[0];
                                           if (file) {
                                               setData('image', file);
                                           }
                                       }}
                                       aria-invalid={!!errors.image}
                                    />

                                    {data.image && <img src={URL.createObjectURL(data.image)}
                                            alt="Preview" className="mt-2 h-24 object-cover rounded-xl" /> }
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="due_date">Due Date</Label>{' '}
                                    <Input
                                        id="due_date"
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="focus:ring-primary focus:ring-2"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="is_completed"
                                        checked={data.is_completed}
                                        onChange={(e) => setData('is_completed', e.target.checked)}
                                        className="focus:ring-primary h-4 w-4 rounded border-gray-300 focus:ring-2"
                                    />
                                    <Label htmlFor="is_completed">Completed</Label>
                                </div>
                                <Button type="submit" disabled={processing} className="bg-primary hover:bg-primary/90 w-full text-white shadow-lg">
                                    {editingTask ? 'Update' : 'Create'}
                                </Button>
                            </form>
                        </DialogContent>{' '}
                    </Dialog>
                </div>
                <div className="mb-4 flex gap-4">
                    <form onSubmit={handleSearch} className="relative flex-1">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                        <Input placeholder="Search tasks..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
                    </form>
                    <Select value={completionFilter} onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>{' '}
                        <SelectContent>
                            <SelectItem value="all">All Tasks</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>{' '}
                            <SelectItem value="pending">Pending</SelectItem>{' '}
                        </SelectContent>{' '}
                    </Select>
                </div>
                <div className="rounded-md border">
                    <div className="relative w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm">
                            <thead className="[&_tr]:border-b">
                                <tr className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">ID</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Title</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Description</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">List</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Due Date</th>
                                    <th className="text-muted-foreground h-12 px-4 text-left align-middle font-medium">Status</th>
                                    <th className="text-muted-foreground h-12 px-4 text-right align-middle font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">

                                {tasks.data.map((task) => (
                                    <tr key={task.id} className="hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors">
                                        <td className="p-4 align-middle">{task.id}</td>
                                        <td className="p-4 align-middle font-medium">{task.title}</td>
                                        <td className="max-w-[200px] truncate p-4 align-middle">{task.description || 'No description'}</td>
                                        <td className="p-4 align-middle">
                                            <div className="flex items-center gap-2">
                                                <List className="text-muted-foreground h-4 w-4" />
                                                {task.lists.title}
                                            </div>
                                        </td>
                                        <td className="p-4 align-middle">
                                            {task.due_date ? (
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="text-muted-foreground h-4 w-4" />
                                                    {new Date(task.due_date).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">No due date</span>
                                            )}
                                        </td>
                                        <td className="p-4 align-middle">
                                            {task.is_completed ? (
                                                <div className="flex items-center gap-2 text-green-500">
                                                    <CheckCircle className="h-4 w-4" />
                                                    <span>Completed</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-yellow-500">
                                                    <XCircle className="h-4 w-4" />
                                                    <span>Pending</span>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-right align-middle">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEdit(task)}
                                                    className="hover:bg-primary/10 hover:text-primary"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>{' '}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(task)}
                                                    className="hover:bg-destructive/10 hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )) }

                                {tasks.data.length === 0
                                    && (
                                    <tr>
                                        <td colSpan={6} className="text-muted-foreground p-4 text-center">
                                            No tasks found
                                        </td>
                                    </tr>
                                )}

                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Pagination */}
                <div className="flex items-center justify-between px-2">
                    <div className="text-muted-foreground text-sm">
                        Showing {tasks.from} to {tasks.to} of {tasks.total} results
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(tasks.current_page - 1)}
                            disabled={tasks.current_page === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center space-x-1">
                            {Array.from({ length: tasks.last_page }, (_, i) => i + 1).map((page) => (
                                <Button
                                    key={page}
                                    variant={page === tasks.current_page ? 'default' : 'outline'}
                                    size="icon"
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(tasks.current_page + 1)}
                            disabled={tasks.current_page === tasks.last_page}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
