import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex overflow-x-hidden">

            {/* Fixed Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main
                className="flex-1 min-h-screen relative ml-72"
            >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20">
                    {children}
                </div>
            </main>

        </div>
    );
};

export default AdminLayout;

