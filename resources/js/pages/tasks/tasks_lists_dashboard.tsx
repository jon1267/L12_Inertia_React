//import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { List, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

interface Props {
    stats?: {
        totalLists: number;
        totalTasks: number;
        completedTasks: number;
        pendingTasks: number;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({
    stats = {
        totalLists: 0,
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
    },
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="from-background to-muted/20 flex h-full flex-1 flex-col gap-6 rounded-xl bg-gradient-to-br p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>{' '}
                        <p className="text-muted-foreground mt-1">Welcome back! Here's your overview</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('lists.index')}>
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg">
                                <List className="mr-2 h-4 w-4" />
                                View ists
                            </Button>{' '}
                        </Link>{' '}
                        <Link href={route('tasks.index')}>
                            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg">
                                <CheckCircle className="mr-2 h-4 w-4" />
                                View tasks
                            </Button>{' '}
                        </Link>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-500">Total lists</CardTitle> <List className="h-4 w-4 text-blue-500" />
                        </CardHeader>{' '}
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-500">{stats.totalLists}</div>
                            <p className="text-muted-foreground text-xs">Your task lists</p>
                        </CardContent>{' '}
                    </Card>
                    <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-green-500">Total tasks</CardTitle>{' '}
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>{' '}
                        <CardContent>
                            <div className="text-2xl font-bold text-green-500">{stats.totalTasks}</div>
                            <p className="text-muted-foreground text-xs">All your tasks</p>
                        </CardContent>{' '}
                    </Card>
                    <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-yellow-500">Pending tasks</CardTitle>{' '}
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>{' '}
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-500">{stats.pendingTasks}</div>
                            <p className="text-muted-foreground text-xs">Tasks to completed </p>
                        </CardContent>{' '}
                    </Card>
                    <Card className="border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-purple-600/10">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-500">Completed tasks</CardTitle>{' '}
                            <AlertCircle className="h-4 w-4 text-purple-500" />
                        </CardHeader>{' '}
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-500">{stats.completedTasks}</div>
                            <p className="text-muted-foreground text-xs">Tasks DialogContent </p>
                        </CardContent>{' '}
                    </Card>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg">Quick Actions</CardTitle>{' '}
                        </CardHeader>{' '}
                        <CardContent>
                            <div className="grid gap-4">
                                <Link href={route('lists.index')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <List className="mr-2 h-4 w-4" />
                                        View All
                                    </Button>{' '}
                                </Link>{' '}
                                <Link href={route('tasks.index')}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        View All
                                    </Button>{' '}
                                </Link>
                            </div>
                        </CardContent>{' '}
                    </Card>
                    <Card className="border-primary/20">
                        <CardHeader>
                            <CardTitle className="text-lg">Recent Activity</CardTitle>{' '}
                        </CardHeader>{' '}
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="bg-primary/10 rounded-full p-2">
                                        <Plus className="text-primary h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Welcome to Task Manager</p>{' '}
                                        <p className="text-muted-foreground text-xs">Get started by creating your first list or Task </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>{' '}
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}