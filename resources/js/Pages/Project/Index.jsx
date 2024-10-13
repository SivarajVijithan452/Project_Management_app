import React, { useState, useEffect } from "react";
import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { router } from '@inertiajs/react';
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/16/solid';

export default function Index({ auth, projects, queryParams = null, success }) {
    queryParams = queryParams || {};

    // State for selected projects and success message visibility
    const [selectedProjects, setSelectedProjects] = useState([]);
    // const [showSuccess, setShowSuccess] = useState(!!success); 

    const toggleProjectSelection = (projectId) => {
        setSelectedProjects(prev => {
            if (prev.includes(projectId)) {
                return prev.filter(id => id !== projectId);
            } else {
                return [...prev, projectId];
            }
        });
    };

    const deleteProject = (project) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            router.delete(route('project.destroy.single', { project: project.id }))
        }
    };


    const deleteSelectedProjects = () => {
        if (selectedProjects.length === 0) {
            alert('No projects selected for deletion.');
            return;
        }

        if (window.confirm('Are you sure you want to delete the selected projects?')) {
            router.delete(route('project.destroy'), {
                data: { ids: selectedProjects }
            })
            .then(response => {
                console.log('Projects deleted:', response);
                setSelectedProjects([]); // Clear selections after deletion
            })
            .catch(error => {
                console.error('Error deleting projects:', error);
            });
        }
    };

    const searchfieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }
        router.get(route('project.index'), queryParams);
    };

    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;
        searchfieldChanged(name, e.target.value);
    };

    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            queryParams.sort_direction = queryParams.sort_direction === 'asc' ? 'desc' : 'asc';
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route('project.index'), queryParams);
    };

    
    // useEffect(() => {
    //     if (success) {
    //         const timer = setTimeout(() => {
    //             setShowSuccess(false);
    //         }, 3000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [success]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Projects
                    </h2>
                    <div className="flex gap-4"> 
                        <Link href={route('project.create')} className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
                            Add New
                        </Link>
                        <button
                            onClick={deleteSelectedProjects}
                            className="bg-red-500 text-white py-1 px-3 rounded transition-all hover:bg-red-600"
                        >
                            Delete Selected
                        </button>
                    </div>
                </div>
            }
        >

            <Head title="Projects" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {success && (
                        <div className="bg-emerald-500 py-2 mb-3 px-4 text-white rounded">
                            {success}
                        </div>
                    )}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">Projects</div>
                        <div className="overflow-auto">
                            <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowrap">
                                        <th className="px-3 py-2 dark:text-white">
                                            <input
                                                type="checkbox"
                                                onChange={e => setSelectedProjects(e.target.checked ? projects.data.map(p => p.id) : [])}
                                            />
                                        </th>
                                        <th onClick={(e) => sortChanged('id')} className="px-3 py-2 flex items-center justify-between gap-1 dark:text-white cursor-pointer">
                                            ID
                                            <div>
                                                <ChevronUpIcon className={"w-4" + (queryParams.sort_field === 'id' && queryParams.sort_direction === 'asc' ? ' text-green-600' : '')} />
                                                <ChevronDownIcon className={"w-4 -mt-2" + (queryParams.sort_field === 'id' && queryParams.sort_direction === 'desc' ? ' text-green-600' : '')} />
                                            </div>
                                        </th>
                                        <th className="px-3 py-2 dark:text-white">Image</th>
                                        <th onClick={(e) => sortChanged('name')} className="cursor-pointer">
                                            <div className="px-3 py-2 flex items-center justify-between gap-1 dark:text-white">
                                                Name
                                                <div>
                                                    <ChevronUpIcon className={"w-4" + (queryParams.sort_field === 'name' && queryParams.sort_direction === 'asc' ? ' text-green-600' : '')} />
                                                    <ChevronDownIcon className={"w-4 -mt-2" + (queryParams.sort_field === 'name' && queryParams.sort_direction === 'desc' ? ' text-green-600' : '')} />
                                                </div>
                                            </div>
                                        </th>
                                        <th onClick={(e) => sortChanged('status')} className="cursor-pointer">
                                            <div className="px-3 py-2 flex items-center justify-between gap-1 dark:text-white">
                                                Status
                                                <div>
                                                    <ChevronUpIcon className={"w-4" + (queryParams.sort_field === 'status' && queryParams.sort_direction === 'asc' ? ' text-green-600' : '')} />
                                                    <ChevronDownIcon className={"w-4 -mt-2" + (queryParams.sort_field === 'status' && queryParams.sort_direction === 'desc' ? ' text-green-600' : '')} />
                                                </div>
                                            </div>
                                        </th>
                                        <th onClick={(e) => sortChanged('created_at')} className="cursor-pointer">
                                            <div className="px-3 py-2 flex items-center justify-between gap-1 dark:text-white">
                                                Create Date
                                                <div>
                                                    <ChevronUpIcon className={"w-4" + (queryParams.sort_field === 'created_at' && queryParams.sort_direction === 'asc' ? ' text-green-600' : '')} />
                                                    <ChevronDownIcon className={"w-4 -mt-2" + (queryParams.sort_field === 'created_at' && queryParams.sort_direction === 'desc' ? ' text-green-600' : '')} />
                                                </div>
                                            </div>
                                        </th>
                                        <th onClick={(e) => sortChanged('due_date')} className="cursor-pointer">
                                            <div className="px-3 py-2 flex items-center justify-between gap-1 dark:text-white">
                                                Due Date
                                                <div>
                                                    <ChevronUpIcon className={"w-4" + (queryParams.sort_field === 'due_date' && queryParams.sort_direction === 'asc' ? ' text-green-600' : '')} />
                                                    <ChevronDownIcon className={"w-4 -mt-2" + (queryParams.sort_field === 'due_date' && queryParams.sort_direction === 'desc' ? ' text-green-600' : '')} />
                                                </div>
                                            </div>
                                        </th>
                                        <th className="px-3 py-2 dark:text-white">Created By</th>
                                        <th className="px-3 py-2 dark:text-white">Actions</th>
                                    </tr>
                                </thead>
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                    <tr className="text-nowarp">
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2">
                                            <TextInput className="w-full" defaultValue={queryParams.name} placeholder="Task Name" onBlur={e => searchfieldChanged('name', e.target.value)} onKeyPress={e => onKeyPress('name', e)} />
                                        </th>
                                        <th className="px-3 py-2">
                                            <SelectInput className="w-full" defaultValue={queryParams.status} onChange={e => searchfieldChanged("status", e.target.value)}>
                                                <option value="">Select Status</option>
                                                <option value="pending">Pending</option>
                                                <option value="in_progress">In Progress</option>
                                                <option value="completed">Completed</option>
                                            </SelectInput>
                                        </th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                        <th className="px-3 py-2"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.data.map((project) => (
                                        <tr key={project.id} className="bg-white border-b dark:bg-gray-500 dark:border-gray-700">
                                            <td className="px-3 py-3 dark:text-white">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProjects.includes(project.id)}
                                                    onChange={() => toggleProjectSelection(project.id)}
                                                />
                                            </td>
                                            <td className="px-3 py-3 dark:text-white">{project.id}</td>
                                            <td className="px-3 py-3">
                                                <img src={project.image_path} alt={project.name} style={{ width: 60 }} />
                                            </td>
                                            <td className="px-3 py-3 dark:text-white hover:underline">
                                                <Link href={route('project.show', project.id)}>
                                                    {project.name}
                                                </Link>
                                            </td>
                                            <td className="px-3 py-3">
                                                <span className={"px-2 py-1 rounded text-white " + PROJECT_STATUS_CLASS_MAP[project.status]}>
                                                    {PROJECT_STATUS_TEXT_MAP[project.status]}
                                                </span>
                                            </td>
                                            <td className="px-3 py-3 text-nowrap dark:text-white">{project.created_at}</td>
                                            <td className="px-3 py-3 text-nowrap dark:text-white">{project.due_date}</td>
                                            <td className="px-3 py-3 dark:text-white">{project.createdBy.name}</td>
                                            <td className="px-3 py-3 text-nowrap">
                                                <Link href={route('project.edit', project)} className="font-medium text-blue-600 hover:underline mx-1 dark:text-blue-500">Edit</Link>
                                                <button onClick={() => deleteProject(project)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <Pagination links={projects.meta.links} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
