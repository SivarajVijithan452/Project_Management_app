import { Link } from "@inertiajs/react";

// Pagination component receives a 'links' prop which is an array of link objects
export default function Pagination({ links }) {
    return (
        <nav className="text-center mt-4">
            {links.map(link => (
                // Map over each link object and create a Link component for each
                <Link 
                    preserveScroll
                    href={link.url || ""} // Use the link's URL or an empty string if undefined
                    key={link.label} // Set a unique key for each link based on its label
                    className={
                        "inline-block py-2 px-3 rounded-lg text-gray-200 text-xs " + 
                        (link.active ? "bg-gray-950 " : " ") + // Add active class if the link is active
                        (!link.url ? "text-gray-500 cursor-not-allowed " : "hover:bg-gray-950") // Add styles for inactive links
                    }
                    // Use dangerouslySetInnerHTML to render HTML content as the link's label
                    dangerouslySetInnerHTML={{ __html: link.label }}
                ></Link>
            ))}
        </nav>
    );
}
