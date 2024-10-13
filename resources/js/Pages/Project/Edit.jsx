import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, project }) {
    const { data, setData, post, errors, reset } = useForm({
        image: null, // Start with null for file input
        name: project.name || "",
        description: project.description || "",
        status: project.status || "",
        due_date: project.due_date ? project.due_date.trim() : "",
        _method: "PUT",
    });

    const onSubmit = (e) => {
        e.preventDefault();
    
        // Create FormData
        const formData = new FormData();
        
        // Append data
        if (data.image) {
            formData.append('image', data.image);
        }
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('status', data.status);
        formData.append('due_date', data.due_date);
    
        // Debugging: Log form data
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }
    
        // Make the PUT request
        post(route('project.update', project.id), formData);
    };
    

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit Project "{project.name}"
                    </h2>
                </div>
            }
        >
            <Head title="Edit Project" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={onSubmit} className="p-4 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                                {project.image_path && (
                                    <div>
                                        <InputLabel value="Current Image" />
                                        <img src={project.image_path} className="w-full h-64 object-cover mt-4" alt="Current project" />
                                    </div>
                                )}
                                <div className="mt-4">
                                    <InputLabel htmlFor="project_image_path" value="Image" />
                                    <TextInput
                                        id="project_image_path"
                                        type="file"
                                        name="image"
                                        className="mt-3 block w-full"
                                        onChange={e => setData('image', e.target.files[0])}
                                    />
                                    <InputError message={errors.image} className="mt-3" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="project_name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        className="mt-3 block w-full"
                                        onChange={e => setData('name', e.target.value)}
                                    />
                                    <InputError message={errors.name} className="mt-3" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="description" value="Description" />
                                    <TextAreaInput
                                        id="project_description"
                                        name="description"
                                        value={data.description}
                                        className="mt-3 block w-full"
                                        onChange={e => setData('description', e.target.value)}
                                        rows="4"
                                    />
                                    <InputError message={errors.description} className="mt-3" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="status" value="Status" />
                                    <SelectInput
                                        id="project_status"
                                        name="status"
                                        value={data.status}
                                        className="mt-3 block w-full"
                                        onChange={e => setData('status', e.target.value)}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                    </SelectInput>
                                    <InputError message={errors.status} className="mt-3" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="due_date" value="Due Date" />
                                    <TextInput
                                        id="project_due_date"
                                        type="date"
                                        name="due_date"
                                        value={data.due_date}
                                        className="mt-3 block w-full"
                                        onChange={e => setData('due_date', e.target.value)}
                                    />
                                    <InputError message={errors.due_date} className="mt-3" />
                                </div>

                                <div className="mt-6 flex gap-5">
                                    <button
                                        type="submit"
                                        className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Edit Project
                                    </button>

                                    <Link href={route('project.index')} className="bg-gray-100 py-2 px-4 text-gray-500 rounded shadow transition-all hover:bg-gray-200 mr-2">
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
