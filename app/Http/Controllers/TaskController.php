<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use  App\Http\Requests\Taskslists\TaskCreateRequest;
use Inertia\Inertia;
use App\Models\Task;
use App\Models\Lists;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //dd($request);
        $query = Task::with('lists')
            ->whereHas('lists', function ($query) {
                $query->where('user_id', auth()->id());
            })->orderBy('created_at', 'desc');

        // handle search functionality
        if ($request->has('search') && $request->search !== null) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                      ->orWhere('description', 'like', '%' . $search . '%');
            });
        }

        if ($request->has('filter') && $request->filter !== null) {
            $query->where('is_completed', $request->filter === 'completed');
        }

        $tasks = $query->paginate(10);
        $lists = Lists::where('user_id', auth()->id())->get();
        //dd($tasks, $lists);
        // time 1:24:00 не работают фильтры и поиск (images не отображаются)

        return Inertia::render('tasks/index', [
            'tasks' => $tasks,
            'lists' => $lists,
            'filters' => [
                'search' => $request->search ?? '',
                'filter' => $request->filter ?? '',
            ],
            'flash' => [
                'message' => session('message'), //'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TaskCreateRequest $request)
    {
        $validated = $request->validated();

        Task::create($validated);

        return to_route('tasks.index')->with('message', 'Task created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TaskCreateRequest $request, Task $task)
    {
        $validated = $request->validated();

        $task->update($validated);

        return to_route('tasks.index')->with('message', 'Task updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return to_route('tasks.index')->with('message', 'Task deleted successfully.');
    }
}
