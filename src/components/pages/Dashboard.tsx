import NavigationBar from "../dashboard/NavigationBar"
import { SidebarProvider } from "../ui/sidebar"


export default function Dashboard() {
    return (
        <SidebarProvider>
            <NavigationBar />
        </SidebarProvider>
    )
}