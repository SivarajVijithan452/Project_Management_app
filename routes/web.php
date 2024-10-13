<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController; 
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route; 
use Inertia\Inertia; 

// Redirect root URL to the dashboard
Route::redirect('/', '/dashboard');

// Group routes that require authentication and email verification
Route::middleware(['auth', 'verified'])->group(function() {
    // Define the dashboard route, rendering the Dashboard React component
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::resource('project', ProjectController::class);
    Route::get('/task/my-tasks', [TaskController::class, 'myTasks'])
    ->name('task.myTasks');
    Route::resource('task', TaskController::class);
    Route::resource('user', UserController::class);
    Route::delete('/projects/destroy', [ProjectController::class, 'destroy'])->name('project.destroy');
    // Route for single deletion (requires a project ID)
    Route::delete('/projects/{project}', [ProjectController::class, 'singledestroy'])->name(name: 'project.destroy.single');
     
});

// Group routes that only require authentication
Route::middleware('auth')->group(function () {
    // Route to edit the user profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');

    // Route to update the user profile
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Route to delete the user profile
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Include additional authentication routes (like login, registration, etc.)
require __DIR__.'/auth.php';
