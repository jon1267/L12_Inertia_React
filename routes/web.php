<?php

use App\Http\Controllers\PostController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // time 14:05
    Route::resource('posts', PostController::class);
    Route::resource('lists', ListController::class);
    Route::resource('tasks', TaskController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
