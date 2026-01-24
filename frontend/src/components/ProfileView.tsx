/**
 * Profile View - Two-column layout with Identity and Controls
 */

'use client';

import { useState, useEffect } from 'react';
import { User, Settings, LogOut, Edit, Save, Shield, BookmarkIcon } from 'lucide-react';

interface ProfileViewProps {
    totalSongs: number;
    totalRemixes: number;
}

export function ProfileView({ totalSongs, totalRemixes }: ProfileViewProps) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            gap: isMobile ? '16px' : '24px',
            padding: isMobile ? '12px' : '20px',
        }}>
            {/* LEFT COLUMN - IDENTITY SECTION */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: isMobile ? '16px' : '20px',
            }}>
                {/* Profile Header */}
                <div style={{
                    background: 'rgba(20, 20, 30, 0.4)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: isMobile ? '16px' : '20px',
                    padding: isMobile ? '24px 20px' : '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: isMobile ? '16px' : '20px',
                }}>
                    {/* Profile Picture */}
                    <div style={{
                        width: isMobile ? '90px' : '120px',
                        height: isMobile ? '90px' : '120px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #4a9eff, #0ea5e9)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '3px solid rgba(74, 158, 255, 0.3)',
                        boxShadow: '0 8px 24px rgba(74, 158, 255, 0.3)',
                    }}>
                        <User size={isMobile ? 42 : 56} color="#fff" />
                    </div>

                    {/* User Name */}
                    <div style={{ textAlign: 'center' }}>
                        <h2 style={{
                            fontSize: isMobile ? '22px' : '28px',
                            fontWeight: '700',
                            color: '#e0e0e0',
                            margin: '0 0 6px 0',
                        }}>
                            DJ Master
                        </h2>
                        <div style={{
                            fontSize: isMobile ? '13px' : '14px',
                            color: '#999',
                            marginBottom: '12px',
                        }}>
                            djmaster@music.com
                        </div>

                        {/* Bio */}
                        <div style={{
                            fontSize: '13px',
                            color: '#aaa',
                            fontStyle: 'italic',
                            maxWidth: '300px',
                            lineHeight: '1.5',
                        }}>
                            Creating energy through sound waves 🎵
                        </div>
                    </div>
                </div>

                {/* Usage Stats */}
                <div style={{
                    background: 'rgba(20, 20, 30, 0.4)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: isMobile ? '12px' : '16px',
                    padding: isMobile ? '16px' : '24px',
                }}>
                    <h3 style={{
                        fontSize: isMobile ? '15px' : '16px',
                        fontWeight: '600',
                        color: '#e0e0e0',
                        margin: '0 0 16px 0',
                    }}>
                        Statistics
                    </h3>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '16px',
                    }}>
                        {/* Total Songs */}
                        <div style={{
                            textAlign: 'center',
                            padding: '16px',
                            background: 'rgba(74, 158, 255, 0.1)',
                            border: '1px solid rgba(74, 158, 255, 0.2)',
                            borderRadius: '12px',
                        }}>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '700',
                                color: '#4a9eff',
                                marginBottom: '4px',
                            }}>
                                {totalSongs}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: '#999',
                                fontWeight: '500',
                            }}>
                                Songs Uploaded
                            </div>
                        </div>

                        {/* Total Remixes */}
                        <div style={{
                            textAlign: 'center',
                            padding: '16px',
                            background: 'rgba(168, 85, 247, 0.1)',
                            border: '1px solid rgba(168, 85, 247, 0.2)',
                            borderRadius: '12px',
                        }}>
                            <div style={{
                                fontSize: '32px',
                                fontWeight: '700',
                                color: '#a855f7',
                                marginBottom: '4px',
                            }}>
                                {totalRemixes}
                            </div>
                            <div style={{
                                fontSize: '12px',
                                color: '#999',
                                fontWeight: '500',
                            }}>
                                Remixes Generated
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN - CONTROLS & SETTINGS */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
            }}>
                <div style={{
                    background: 'rgba(20, 20, 30, 0.4)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                }}>
                    <h3 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#e0e0e0',
                        margin: '0 0 8px 0',
                    }}>
                        Account Settings
                    </h3>

                    {/* Edit Profile */}
                    <button
                        onClick={() => alert('Edit Profile feature coming soon!')}
                        style={{
                            width: '100%',
                            padding: '14px 20px',
                            background: 'rgba(74, 158, 255, 0.12)',
                            border: '1px solid rgba(74, 158, 255, 0.25)',
                            borderRadius: '12px',
                            color: '#60a5fa',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '12px',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(74, 158, 255, 0.2)';
                            e.currentTarget.style.borderColor = 'rgba(74, 158, 255, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(74, 158, 255, 0.12)';
                            e.currentTarget.style.borderColor = 'rgba(74, 158, 255, 0.25)';
                        }}
                    >
                        <Edit size={18} />
                        Edit Profile
                    </button>

                    {/* Saved Items */}
                    <button
                        onClick={() => alert('Saved items feature coming soon!')}
                        style={{
                            width: '100%',
                            padding: '14px 20px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#e0e0e0',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '12px',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        <BookmarkIcon size={18} />
                        Saved
                    </button>

                    {/* Account Settings */}
                    <button
                        onClick={() => alert('Account Settings feature coming soon!')}
                        style={{
                            width: '100%',
                            padding: '14px 20px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#e0e0e0',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '12px',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        <Settings size={18} />
                        Account Settings
                    </button>

                    {/* Privacy & Data */}
                    <button
                        onClick={() => alert('Privacy & Data settings coming soon!')}
                        style={{
                            width: '100%',
                            padding: '14px 20px',
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#e0e0e0',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '12px',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        }}
                    >
                        <Shield size={18} />
                        Privacy & Data
                    </button>

                    {/* Divider */}
                    <div style={{
                        height: '1px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        margin: '8px 0',
                    }} />

                    {/* Logout */}
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to logout?')) {
                                alert('Logout functionality will be implemented with authentication');
                            }
                        }}
                        style={{
                            width: '100%',
                            padding: '14px 20px',
                            background: 'rgba(248, 113, 113, 0.08)',
                            border: '1px solid rgba(248, 113, 113, 0.2)',
                            borderRadius: '12px',
                            color: '#f87171',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-start',
                            gap: '12px',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(248, 113, 113, 0.15)';
                            e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.35)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(248, 113, 113, 0.08)';
                            e.currentTarget.style.borderColor = 'rgba(248, 113, 113, 0.2)';
                        }}
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
