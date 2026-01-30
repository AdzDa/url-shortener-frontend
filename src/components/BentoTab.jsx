import React, {useState} from 'react'

export default function BentoTab({
    tabs = [],
    defaultTabIndex = 0,
}) {
    const [activeTab, setActiveTab] = useState(defaultTabIndex);

    if (!tabs || tabs.length === 0) {
        return (
            <div className='bg-white rounded-[10px]'>
                <p>No tabs available</p>
            </div>
        );
    }

  return (
    <div className='w-full flex flex-col'>
        {/* Tab Headers */}
        <div className='w-full'>
            <div className='flex flex-row justify-between space-x-0'>
                {tabs.map((tab, index) => (
                    <div
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`flex-1 text-center py-[10px] cursor-pointer rounded-t-[10px] ${
                            index === activeTab
                                ? 'font-bold text-[var(--color-primary)] bg-white rounded-t-[10px]'
                                : 'font-bold text-white'
                        }`}
                    >
                        <p className='p-body1 font-bold'>{tab.label}</p>           
                    </div>
                ))}
            </div>
        </div>

        {/* Tab Content */}
        <div className='bg-white rounded-b-[10px] p-[20px]'>
            {tabs[activeTab]?.content || (
                <p className='p-body1 text-[var(--color-text-secondary)]'>No content available</p>
            )}
        </div>
    </div>
  )
}
