import NavigationBar from "../dashboard/NavigationBar"
import { SidebarProvider } from "../ui/sidebar"
import { Outlet } from "react-router"


export default function Dashboard() {
    return (
        <SidebarProvider>
            <div className="flex h-screen">
                <NavigationBar />
                <main className="p-6 flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    )
}