/**
 * Navigation Bar - Simple 3-section tabs with mobile support
 */

'use client';

interface NavigationProps {
    activeTab: 'remix' | 'library' | 'profile';
    onTabChange: (tab: 'remix' | 'library' | 'profile') => void;
    isMobile?: boolean;
}

export function Navigation({ activeTab, onTabChange, isMobile = false }: NavigationProps) {
    const tabs = [
        { id: 'remix' as const, label: 'Remix', icon: '🎵' },
        { id: 'library' as const, label: 'Library', icon: '📚' },
        { id: 'profile' as const, label: 'Profile', icon: '👤' },
    ];

    return (
        <div style={{
            display: 'flex',
            gap: isMobile ? '4px' : '8px',
            marginLeft: 'auto',
            alignItems: 'center',
        }}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    style={{
                        padding: isMobile ? '8px 12px' : '10px 24px',
                        background: activeTab === tab.id
                            ? 'rgba(74, 158, 255, 0.2)'
                            : 'transparent',
                        border: activeTab === tab.id
                            ? '1px solid rgba(74, 158, 255, 0.5)'
                            : '1px solid transparent',
                        borderRadius: isMobile ? '8px' : '10px',
                        color: activeTab === tab.id ? '#4a9eff' : '#999',
                        fontSize: isMobile ? '12px' : '14px',
                        fontWeight: activeTab === tab.id ? '600' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        minHeight: '40px',
                    }}
                    onMouseEnter={(e) => {
                        if (activeTab !== tab.id) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.color = '#e0e0e0';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeTab !== tab.id) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#999';
                        }
                    }}
                >
                    {isMobile && <span>{tab.icon}</span>}
                    {!isMobile && tab.label}
                    {isMobile && activeTab === tab.id && <span>{tab.label}</span>}
                </button>
            ))}
        </div>
    );
}
