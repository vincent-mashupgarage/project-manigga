'use client'

import React, { useState, useMemo } from 'react'
import {
  LayoutDashboard,
  FolderOpenDot,
  Users,
  Settings,
  Video,
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  Folders,
} from 'lucide-react'
import { useStore } from '../../stores/Store'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import './sidebar.css'
import { workspacesData } from '../../mockData/workspaceData'

const Sidebar: React.FC = () => {
  const { currentProject, activeWorkspaceId } = useStore()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // Find the active workspace by ID, default to first one if not found
  const activeWorkspace = useMemo(() => {
    if (activeWorkspaceId) {
      return workspacesData.find((workspace) => workspace.id === activeWorkspaceId) || workspacesData[0];
    }
    return workspacesData && workspacesData.length > 0 ? workspacesData[0] : null;
  }, [activeWorkspaceId]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', pathCheck: '/dashboard' },
    { href: '/projectLists', icon: Folders, label: 'All Projects', pathCheck: ['/projectLists', '/projectList'] },
    { href: '/project', icon: FolderOpenDot, label: 'Projects', pathCheck: ['/project', '/project-project'] },
    { href: '/huddle', icon: Video, label: 'Huddles', pathCheck: ['/huddles', '/huddle'] },
    { href: '/team', icon: Users, label: 'Team', pathCheck: '/team' },
    { href: '/settings', icon: Settings, label: 'Settings', pathCheck: '/settings' }
  ]

  const isActive = (pathCheck: string | string[]) => {
    if (Array.isArray(pathCheck)) {
      return pathCheck.some(path => pathname === path)
    } 
    return pathname === pathCheck
  }

  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn(
        'bg-gray-800 text-white flex flex-col h-screen border-r border-gray-700 transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}>
        {/* Workspace logo */}
        <div className="p-4 flex items-center h-14 border-b border-gray-700">
          <div className={cn(
            "min-w-[32px] w-8 h-8 rounded-md flex items-center justify-center text-white font-bold text-lg mr-2",
            activeWorkspace?.color?.replace('bg-', 'bg-') || "bg-blue-600"
          )}>
            {activeWorkspace ? activeWorkspace.letter : 'T'}
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-lg whitespace-nowrap overflow-hidden">
              {activeWorkspace ? activeWorkspace.name : 'No Workspace'}
            </span>
          )}
        </div>

        {/* Middle Section (Scrollable Nav) */}
        <div className="flex-1 overflow-y-auto">
          <nav className="p-2 pt-4 space-y-1">
            {navItems.map(({ href, icon: Icon, label, pathCheck }) => (
              <Tooltip key={label}>
                <TooltipTrigger asChild>
                   <Link
                    href={href}
                    className={cn(
                      'sidebar-nav-item flex items-center justify-start rounded-md transition-colors',
                      isActive(pathCheck)
                        ? 'sidebar-nav-item-active bg-blue-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50',
                       isCollapsed ? 'h-10 w-10 p-0 justify-center' : 'h-10 px-3 py-1.5'
                    )}
                  >
                    <Icon size={18} className={cn(isCollapsed ? '' : 'mr-3')} />
                    <span className={cn('whitespace-nowrap', isCollapsed ? 'hidden' : 'block')}>
                      {label}
                    </span>
                  </Link>
                </TooltipTrigger>
                {isCollapsed && (
                   <TooltipContent side="right" sideOffset={5}>
                      {label}
                   </TooltipContent>
                )}
              </Tooltip>
            ))}
          </nav>
        </div>

        {/* Bottom Fixed Section */}
        <div className="shrink-0">
          {/* Collapse Toggle Button */}
          <div className="p-2 border-t border-gray-700">
            <Tooltip>
               <TooltipTrigger asChild>
                 <button
                   onClick={toggleSidebar}
                   className={cn(
                      'w-full flex items-center justify-start h-10 px-3 py-1.5 rounded-md text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors',
                      isCollapsed && 'justify-center px-0'
                   )}
                 >
                   {isCollapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} className="mr-3"/>}
                   <span className={cn('whitespace-nowrap', isCollapsed ? 'hidden' : 'block')}>
                      Collapse
                   </span>
                 </button>
               </TooltipTrigger>
               {isCollapsed && (
                  <TooltipContent side="right" sideOffset={5}>
                      Expand Sidebar
                   </TooltipContent>
               )}
            </Tooltip>
          </div>

          {/* Current Project */}
          {!isCollapsed && currentProject && (
            <div className="p-4 border-t border-gray-700">
              <div className="mb-3">
                <button className="flex items-center justify-between w-full text-sm font-medium text-gray-300 hover:text-white">
                  <span>Current Project</span>
                  <ChevronDown size={16} />
                </button>
              </div>
              
              <div className="bg-gray-750 rounded-md p-3">
                <h3 className="font-medium text-white mb-2">{currentProject.name}</h3>
                
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{currentProject.progress}%</span>
                  </div>
                  <div className="project-progress-bar">
                    <div 
                      className="project-progress-bar-fill" 
                      style={{ width: `${currentProject.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Tasks</span>
                  <span>{currentProject.tasksCompleted}/{currentProject.totalTasks}</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </TooltipProvider>
  )
}

export default Sidebar 