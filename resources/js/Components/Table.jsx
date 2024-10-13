// Table.js
import React from "react";
import { Link } from "@inertiajs/react";
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/16/solid';
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants";

const Table = ({ projects, queryParams, toggleProjectSelection, selectedProjects, deleteProject, sortChanged }) => {
    return (
        <div className="overflow-auto">
            <table className='w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400'>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                        <th className="px-3 py-2 dark:text-white">
                            <input
                                type="checkbox"
                                onChange={e => toggleProjectSelection(e.target.checked ? projects.data.map(p => p.id) : [])}
                            />
                        </th>
                        <th onClick={() => sortChanged('id')} className="px-3 py-2 flex items-center justify-between gap-1 dark:text-white cursor-pointer">
                            ID
                            <div>
                                <ChevronUpIcon className={"w-4" + (queryParams.sort_field === 'id' && queryParams.sort_direction === 'asc' ? ' text-green-600' : '')} />
                                <ChevronDownIcon className={"w-4 -mt-2" + (queryParams.sort_field === 'id' && queryParams.sort_direction === 'desc' ? ' text-green-600' : '')} />
                            </div>
                        </th>
                        <th className="px-3 py-2 dark:text-white">Image</th>
                        <th onClick={() => sortChanged('name')} className="cursor-pointer">
                            <div className="px-3 py-2 flex items-center justify-between gap-1 dark:text-white">
                                Name
                                <div>
                                    <ChevronUpIcon className={"w-4" + (queryParams.sort_field === 'name' && queryParams.sort_direction === 'asc' ? ' text-green-600' : '')} />
                                    <ChevronDownIcon className={"w-4 -mt-2" + (queryParams.sort_field === 'name' && queryParams.sort_direction === 'desc' ? ' text-green-600' : '')} />
                                </div>
                            </div>
                        </th>
                        <th onClick={() => sortChanged('status')} className="cursor-pointer">
                            <div className="px-3 py-2 flex items-center justify-between gap-1 dark:text-white">
                                Status
                                <div>
                                    <ChevronUpIcon className={"w-4" + (queryParams.sort_field === 'status' && queryParams.sort_direction === 'asc' ? ' text-green-600' : '')} />
                                    <ChevronDownIcon className={"w-4 -mt-2" + (queryParams.sort_field === 'status' && queryParams.sort_direction === 'desc' ? ' text-green-600' : '')} />
                                </div>
                            </div>
                        </th>
                        <th onClick={() => sortChanged('created_at')} className="cursor-pointer">
                            <div className="px-3 py-2 flex items-center justify-between gap-1 dark:text-white">
                                Create Date
                                <div>
                                    <ChevronUpIcon className={"w-4" + (queryParams.sort_field === 'created_at' && queryParams.sort_direction === 'asc' ? ' text-green-600' : '')} />
                                    <ChevronDownIcon className={"w-4 -mt-2" + (queryParams.sort_field === 'created_at' && queryParams.sort_direction === 'desc' ? ' text-green-600' : '')} />
                                </div>
                            </div>
                        </th>
                        <th onClick={() => sortChanged('due_date')} className="cursor-pointer">
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
                                <button className="font-medium text-blue-600 hover:underline mx-1 dark:text-blue-500">Edit</button>
                                <button onClick={() => deleteProject(project)} className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
