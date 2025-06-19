<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Lists;
//use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();

        if (!$user) {
            return to_route('login');
        }

        $lists = Lists::where('user_id', $user->id)->get();

        $tasks = Task::whereHas('lists', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->get();

        $stats = [
            'totalLists' => $lists->count(),
            'totalTasks' => $tasks->count(),
            'completedTasks' => $tasks->where('is_completed', true)->count(),
            'pendingTasks' => $tasks->where('is_completed', false)->count(),
        ];

        return Inertia::render('tasks/tasks_lists_dashboard', [
            'stats' => $stats,
            'lists' => $lists,
            'tasks' => $tasks,
            'flash' => [
                'message' => session('message'),
                'success' => session('success'),
                'error' => session('error')
            ]
        ]);
    }
}
