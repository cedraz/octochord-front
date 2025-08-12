import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd } from "lucide-react";

import { NavMain } from "../nav-main";
import { NavProjects } from "../nav-projects";
import { NavUser } from "../nav-user";
import { TeamSwitcher } from "../team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "../ui/sidebar";

const data = {
    user: {
        name: "T. Apiari",
        email: "tito@arpejo.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Corp.",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Arpejo Inc",
            logo: AudioWaveform,
            plan: "Record Label",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
}

export default function NavigationBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
        </Sidebar>
    )
}
