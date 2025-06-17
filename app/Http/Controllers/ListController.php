<?php

namespace App\Http\Controllers;

use App\Models\Lists;
use App\Http\Requests\Taskslists\ListCreateRequest; //use Illuminate\Http\Request;
use Inertia\Inertia;

class ListController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lists = Lists::where('user_id', auth()->id())->get();
        return Inertia::render('lists/index', [
            'lists' => $lists,
            'flash' => [
                'message' => session('message'),
                'success' => session('success'),
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
    public function store(ListCreateRequest $request)
    {
         $validated = $request->validated();

        Lists::create($validated);

        return to_route('lists.index')->with('message','List created successfully.');
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
    public function update(ListCreateRequest $request, Lists $list)
    {
        $validated = $request->validated();

        $list->update($validated);

        return to_route('lists.index')->with('message','List Updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Lists $list)
    {
        $list->delete();

        return to_route('lists.index')->with('message','List Deleted successfully.');
    }
}
