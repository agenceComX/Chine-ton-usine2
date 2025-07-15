import React, { useState } from 'react';
import InfluencerSidebar from '../../components/InfluencerSidebar';
import InfluencerTopbar from '../../components/InfluencerTopbar';
import CollaborationsSection from '../../components/influencer/CollaborationsSection';
import ReferralSection from '../../components/influencer/ReferralSection';
import StarsSection from '../../components/influencer/StarsSection';
import SearchSection from '../../components/influencer/SearchSection';
import StatsSection from '../../components/influencer/StatsSection';

const InfluencerDashboard: React.FC = () => {
    const [activeSection, setActiveSection] = useState('collaborations');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'collaborations':
                return <CollaborationsSection />;
            case 'referral':
                return <ReferralSection />;
            case 'stars':
                return <StarsSection />;
            case 'search':
                return <SearchSection />;
            case 'stats':
                return <StatsSection />;
            default:
                return <CollaborationsSection />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar */}
            <InfluencerSidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                isOpen={sidebarOpen}
                setIsOpen={setSidebarOpen}
            />

            {/* Main content */}
            <div className="lg:ml-64">
                {/* Topbar */}
                <InfluencerTopbar setSidebarOpen={setSidebarOpen} />

                {/* Page content */}
                <div className="p-6">
                    {renderActiveSection()}
                </div>
            </div>
        </div>
    );
};

export default InfluencerDashboard;
