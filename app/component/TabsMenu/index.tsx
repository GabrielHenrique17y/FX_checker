import { LogType } from '@/app/types/logs';
import { TabsMenuType } from '@/app/types/tabsMenu';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  selectedTab: TabsMenuType;
  setSelectedTab: Dispatch<SetStateAction<TabsMenuType>>;
  favorites: string[];
  logs: LogType[];
}

const tabs: Array<{
  id: TabsMenuType;
  label: string;
  badge?: (props: { favorites: string[]; logs: LogType[] }) => number;
}> = [
  { id: 'History', label: 'HISTORY' },
  { id: 'Compare', label: 'COMPARE' },
  {
    id: 'favorite',
    label: 'FAVORITES',
    badge: ({ favorites }) => favorites.length,
  },
  {
    id: 'Log',
    label: 'LOG',
    badge: ({ logs }) => logs.length,
  },
];

export function TabsMenu({
  selectedTab,
  setSelectedTab,
  favorites,
  logs,
}: Props) {
  const badgeCount = (tab: (typeof tabs)[0]) => {
    if (!tab.badge) return undefined;
    return tab.badge({ favorites, logs });
  };

  return (
    <>
      <ul
        className='hidden sm:flex gap-2 text-md text-neutral-50 border-b border-neutral-600 h-10'
        role='tablist'
      >
        {tabs.map(tab => {
          const isActive = selectedTab === tab.id;
          return (
            <li
              key={tab.id}
              className={`
                border border-transparent px-4 h-full flex gap-2 items-center cursor-pointer
                active:rounded-lg active:border-lime-500
                ${isActive && 'border-b-2 border-b-lime-500'}
              `}
              role='tab'
              aria-selected={isActive}
              onClick={() => setSelectedTab(tab.id)}
            >
              <span>{tab.label}</span>
              {badgeCount(tab) !== undefined && (
                <div className='bg-lime-800 rounded-full text-lime-500 text-[10px] w-5 h-5 flex items-center justify-center'>
                  {badgeCount(tab)}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <select
        className='bg-neutral-700 flex sm:hidden w-full text-neutral-50 px-3 py-2 border border-neutral-400 rounded-lg focus:outline-0 active:border-lime-500'
        value={selectedTab}
        onChange={e => setSelectedTab(e.target.value as TabsMenuType)}
        aria-label='Selecione a aba'
      >
        {tabs.map(tab => (
          <option key={tab.id} value={tab.id}>
            {tab.label}
          </option>
        ))}
      </select>
    </>
  );
}
