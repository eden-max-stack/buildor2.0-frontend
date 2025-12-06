import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import Link from 'next/link';

interface SidebarItem {
    name: string;
    path: string;
    open: boolean;
}

interface SidebarProps {
    isOpen?: boolean;
    onSidebarToggle?: (isOpen: boolean) => void;
}

function Sidebar({ isOpen = false, onSidebarToggle }: SidebarProps) {
    const [items, setItems] = React.useState<SidebarItem[]>([
        { name: 'Coding Practice', path: '/coding-practice-platform', open: false },
        { name: 'Recommendation Engine', path: '/recommendation-engine', open: false }
    ]);

    const [sidebarOpenInternal, setSidebarOpenInternal] = useState(isOpen ?? true);


    useEffect(() => {
        console.log(sidebarOpenInternal);
    })
    const handleToggleSidebar = () => {
        const newState = !sidebarOpenInternal;
        setSidebarOpenInternal(newState);
        if (onSidebarToggle) {
            onSidebarToggle(newState);
        }
    }

    const handleToggleItem = (idx: number) => {
        setItems((prev) => 
            prev.map((item, i) =>
                i === idx ? {... item, open: !item.open } : item
            )
        )
    };

    return (
        <aside style={{
            position: "fixed",
            top: 72,
            left: 0,
            height: "calc(100vh - 72px)",
            width: sidebarOpenInternal ? 240 : 24,
            borderRight: "1px solid #e5e7eb",
            boxShadow: sidebarOpenInternal ? "2px 0 5px rgba(0,0,0,0.1)" : "none",
            transition: "width 0.3s ease, box-shadow 0.3s ease",
            padding: sidebarOpenInternal ? "24px 0 0 0" : "0",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            gap: 0,
            overflow: "hidden",
            backgroundColor: "black"
        }}>
            <div style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                padding: sidebarOpenInternal ? "0 16px 0 0" : "0",
                height: 40
            }}>
                {sidebarOpenInternal ? (
                    <span 
                        style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 40 }}
                        onClick={handleToggleSidebar}>
                        <ChevronLeft />
                    </span>
                ) : (
                    <span 
                        style={{ cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 40 }}
                        onClick={handleToggleSidebar}>
                        <ChevronRight/>
                    </span>
                )}
            </div>

            {sidebarOpenInternal && (
                <div style={{ padding: "0 24px 0 24px"}}>
                    <ul style={{ listStyle: "none", padding: 0, margin: 0}}>
                        {items.map((item, idx) => (
                            <li key={item.name}>
                                <div 
                                    style={{}}>
                                    <Link href={item.path}>{item.name}</Link>
                                </div>
                                
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </aside>
    )
}

export default Sidebar