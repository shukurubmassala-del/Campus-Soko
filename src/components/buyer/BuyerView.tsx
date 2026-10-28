import React from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { ListingGrid } from '../listings/ListingGrid';
import { SearchView } from '../search/SearchView';
import { WantedBoard } from '../wanted/WantedBoard';
import { ChatDrawer } from '../chat/ChatDrawer';
import { ProfileView } from '../profile/ProfileView';
import { JijiCategorySidebar } from '../layout/JijiCategorySidebar';
import { JijiRightSidebar } from '../layout/JijiRightSidebar';
import { CategoryChipsBar } from '../common/CategoryChipsBar';

export const BuyerView: React.FC = () => {
  const {
    activeTab,
  } = useCampusSoko();

  return (
    <div className="space-y-5">
      
      {/* Primary Marketplace View: Jiji Tanzania 3-Column Architecture */}
      {activeTab === 'market' && (
        <>
          {/* Main 3-Column Layout (Jiji Category Sidebar + Central Feed + Right Sidebar) */}
          <div className="flex items-start gap-5">
            
            {/* Left Column: Jiji Categories Sidebar (Desktop) */}
            <JijiCategorySidebar />

            {/* Center Column: Hero Carousel + Mobile Categories + Listing Feed */}
            <div className="flex-1 min-w-0 space-y-4">
              
              {/* Horizontal Category Chips Bar - All categories visible */}
              <div id="campus-category-chips">
                <CategoryChipsBar />
              </div>

              {/* Marketplace Listing Grid */}
              <ListingGrid />

            </div>

            {/* Right Column: Jiji Right Sidebar (Post Ad box, Wanted Demands, Verification) */}
            <JijiRightSidebar />

          </div>
        </>
      )}

      {/* Sub-Views for Buyer Tabs */}
      {activeTab === 'search' && <SearchView />}
      {activeTab === 'wanted' && <WantedBoard />}
      {activeTab === 'chats' && <ChatDrawer />}
      {activeTab === 'profile' && <ProfileView />}

    </div>
  );
};
