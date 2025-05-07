<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //$posts = Auth::user()->posts()->latest()->get();
        $posts = Post::all();
        return Inertia::render('posts/index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //return Inertia::render('posts/create');
        return inertia()->render('posts/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //dd($request->all());
        $data = $request->validate([
            'title' => ['required','string','min:3','max:255'],
            'content' => ['required','string'],
            'status' => ['required','string'],
            'category' => ['required','string'],
            'image' => ['required','image','max:2048'],
        ]);

        $file = $request->file('image');
        $filePath = $file->store('posts', 'public');
        $data['image'] = $filePath;
        $data['user_id'] = auth()->user()?->id;
        $data['slug'] = Str::slug($data['title']);
        //dd($data);

        Post::create($data);

        // time 55:50 install flash
        return redirect()->route('posts.index')->with('message','Post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Post $post)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Post $post)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {
        //
    }
}
