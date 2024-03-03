import Link from 'next/link';
import React from 'react'
import { twMerge } from 'tailwind-merge';
import CypressHomeIcon from '../icons/cypressHomeIcon';
import CypressSettingsIcon from '../icons/cypressSettingsIcon';
import CypressTrashIcon from '../icons/cypressTrashIcon';
// import Settings from '../settings/settings';
import Settings from '../settings/settings'
import Trash from '../trash/trash';

interface NativeNavigationProps{
    myFolderId:string;
    className?:string;
    getSelectedItem?: (item: string) => void;
}

const NativeNavigation:React.FC<NativeNavigationProps> = ({myFolderId,className}) => {
  return (
    <nav className={twMerge("my-2",className)}>
        <ul className='flex flex-col gap-2'>
            <li>
                <Link className='group/native flex text-Neutrals/neutrals-7 transition-all gap-2' href={`/dashboard/${myFolderId}`}>
                    <CypressHomeIcon/>
                    <span>my folder</span>
                </Link>
            </li>
            <Settings>
                <li className='group/native flex text-Neutrals/neutrals-7 transition-all gap-2 cursor-pointer'>
                    <CypressSettingsIcon/>
                    <span>Settings</span>
                </li>
            </Settings>
            <Trash>
                <li className='group/native flex text-Neutrals/neutrals-7 transition-all gap-2'>
                    <CypressTrashIcon/>
                    <span>Trash</span>
                </li>                
            </Trash>

        </ul>
    </nav>
  )
}

export default NativeNavigation