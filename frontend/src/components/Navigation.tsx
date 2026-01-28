/**
 * Navigation Bar - Netflix-style premium tabs
 */

'use client';

interface NavigationProps {
    activeTab: 'remix' | 'library' | 'profile';
    onTabChange: (tab: 'remix' | 'library' | 'profile') => void;
    isMobile?: boolean;
}

export function Navigation({ activeTab, onTabChange, isMobile = false }: NavigationProps) {
    const tabs = [
        { id: 'remix' as const, label: 'Studio', shortLabel: 'Mix' },
        { id: 'library' as const, label: 'Collection', shortLabel: 'Lib' },
        { id: 'profile' as const, label: 'Profile', shortLabel: 'Me' },
    ];

    return (
        <div style={{
            display: 'flex',
            gap: isMobile ? '6px' : '8px',
            marginLeft: 'auto',
            alignItems: 'center',
        }}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    style={{
                        padding: isMobile ? '6px 10px' : '10px 24px',
                        background: activeTab === tab.id
                            ? 'var(--accent-bg)'
                            : 'transparent',
                        border: activeTab === tab.id
                            ? '1px solid var(--accent-border)'
                            : '1px solid transparent',
                        borderRadius: isMobile ? '8px' : '10px',
                        color: activeTab === tab.id ? 'var(--accent)' : 'var(--gray-300)',
                        fontSize: isMobile ? '11px' : '14px',
                        fontWeight: activeTab === tab.id ? '600' : '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: isMobile ? '4px' : '6px',
                        minHeight: isMobile ? '36px' : '40px',
                        whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => {
                        if (activeTab !== tab.id) {
                            e.currentTarget.style.background = 'var(--bg-elevated)';
                            e.currentTarget.style.color = 'var(--gray-100)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (activeTab !== tab.id) {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--gray-300)';
                        }
                    }}
                >
                    {isMobile ? (
                        activeTab === tab.id ? tab.label : tab.shortLabel
                    ) : (
                        tab.label
                    )}
                </button>
            ))}
        </div>
    );
}

