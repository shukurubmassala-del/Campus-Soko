import React from 'react';
import { CampusSokoProvider, useCampusSoko } from './context/CampusSokoContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { BuyerView } from './components/buyer/BuyerView';
import { SellerView } from './components/seller/SellerView';
import { AdminView } from './components/admin/AdminView';
import { ListingDetailModal } from './components/listings/ListingDetailModal';
import { CreateListingModal } from './components/listings/CreateListingModal';
import { AuthModal } from './components/auth/AuthModal';
import { VerificationModal } from './components/trust/VerificationModal';
import { SafetyModal } from './components/trust/SafetyModal';
import { ReportModal } from './components/trust/ReportModal';
import { ReviewModal } from './components/trust/ReviewModal';
import { OnboardingModal } from './components/layout/OnboardingModal';
import { ProhibitedItemsPolicyModal } from './components/trust/ProhibitedItemsPolicyModal';
import { NotificationCenterModal } from './components/notifications/NotificationCenterModal';
import { NotificationSettingsModal } from './components/notifications/NotificationSettingsModal';
import { AppUpdatePrompt } from './components/common/AppUpdatePrompt';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    roleView,
    toasts,
    isProhibitedPolicyOpen,
    closeProhibitedPolicyModal,
  } = useCampusSoko();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Bar Contract Compliant Header with 3-View Segmenter */}
      <Navbar />


      {/* Main Container hosting the segmented active view */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-28 md:pb-16 space-y-6 overflow-x-hidden">
        
        {/* VIEW 1: Buyer View & Log In Protocol */}
        {roleView === 'buyer' && <BuyerView />}

        {/* VIEW 2: Seller View & Registration Protocol */}
        {roleView === 'seller' && <SellerView />}

        {/* VIEW 3: Creator / Admin View & Log In Protocol */}
        {roleView === 'admin' && <AdminView />}

      </main>

      {/* Mobile Sticky Bottom Navigation (Role-Adaptive) */}
      <BottomNav />

      {/* Global Modals */}
      <ListingDetailModal />
      <CreateListingModal />
      <AuthModal />
      <VerificationModal />
      <SafetyModal />
      <ReportModal />
      <ReviewModal />
      <OnboardingModal />
      <ProhibitedItemsPolicyModal
        isOpen={isProhibitedPolicyOpen}
        onClose={closeProhibitedPolicyModal}
      />
      <NotificationCenterModal />
      <NotificationSettingsModal />

      {/* Feature Amendment & Browser Refresh Notification Prompt */}
      <AppUpdatePrompt />

      {/* Toast Feedback Notifications */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-70 space-y-2 pointer-events-none max-w-sm w-full px-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom-2 duration-200 ${
              toast.type === 'error'
                ? 'bg-red-900/95 text-white border-red-700'
                : toast.type === 'info'
                ? 'bg-blue-900/95 text-white border-blue-700'
                : 'bg-emerald-900/95 text-white border-emerald-700'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-blue-300 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            )}
            <p className="flex-1">{toast.message}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CampusSokoProvider>
        <MainContent />
      </CampusSokoProvider>
    </AuthProvider>
  );
}
