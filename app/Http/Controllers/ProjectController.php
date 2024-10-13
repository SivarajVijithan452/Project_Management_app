<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Task;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Initialize a query for the Project model
        $query = Project::query();

        // Retrieve sorting fields and direction from the request, defaulting if not provided
        $sortFields = request("sort_field", 'created_at');
        $sortDirection = request("sort_direction", "desc");

        // Check if 'name' is present in the request and add a 'where' condition if it is
        if (request("name")) {
            $query->where("name", "like", "%" . request("name") . "%");
        }

        // Check if 'status' is present in the request and add a 'where' condition if it is
        if (request(key: "status")) {
            $query->where("status", request("status"));
        }

        // Order the results based on specified sort field and direction, then paginate the results
        $projects = $query->orderBy($sortFields, $sortDirection)->paginate(10)->onEachSide(1);

        // Return the Inertia response with the projects and current query parameters
        return inertia("Project/Index", [
            'projects' => ProjectResource::collection($projects),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }



    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Project/Create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        // Validate and retrieve the data
        $data = $request->validated();

        // Set created_by and updated_by fields
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();

        // Handle the image upload if present
        if (isset($data['image'])) {
            // Store the image in the public storage under 'project' directory
            $data['image_path'] = $data['image']->store('project', 'public');
        }

        // Create the project
        Project::create($data);

        // Redirect to the project index with a success message
        return to_route('project.index')->with('success', 'Project Successfully Created!!!');
    }


    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $query = $project->tasks();

        // Retrieve sorting fields and direction from the request
        $sortField = request('sort_field', 'created_at');
        $sortDirection = request('sort_direction', 'desc');

        // Apply filters
        if ($name = request('name')) {
            $query->where('name', 'like', '%' . $name . '%');
        }
        if ($status = request('status')) {
            $query->where('status', $status);
        }

        // Apply sorting
        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return inertia('Project/Show', [
            'tasks' => TaskResource::collection($tasks),
            'project' => new ProjectResource($project),
            'queryParams' => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return inertia('Project/Edit', [
            'project' => new ProjectResource($project),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        // Log incoming request data
        Log::info('Attempting to update project.', [
            'data' => $request->all(),
            'project_id' => $project->id,
        ]);
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['updated_by'] = Auth::id();

        // Log the incoming request data for debugging
        Log::info('Validated data:', $request->validated());
        // Check if a new image is being uploaded
        if ($image) {
            // Delete the existing image if it exists
            if ($project->image_path) {
                \Storage::disk('public')->delete($project->image_path);
            }

            // Store the new image
            $data['image_path'] = $image->store('project', 'public');
        }

        // Update the project with the new data
        $project->update($data);

        return to_route('project.index')->with('success', 'Project Successfully Updated!!!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $ids = $request->input('ids');

        if ($ids) {
            foreach ($ids as $id) {
                // Delete related records first
                Task::where('project_id', $id)->delete(); // Adjust based on actual relationships
                Project::destroy($id); // Now delete the project
            }
            return to_route('project.index')->with('success', 'Projects Successfully Deleted!!!');
        }
    }


    public function singledestroy(Project $project)
    {
        // Optionally delete related records first
        Task::where('project_id', $project->id)->delete(); // Adjust based on actual relationships
        if ($project->image_path) {
            \Storage::disk('public')->delete($project->image_path);
        }
        $project->delete(); // Now delete the project

        return to_route('project.index')->with('success', 'Project Successfully Deleted!!!');
    }

}
