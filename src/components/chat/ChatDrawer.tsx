import React, { useState } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { formatTZS } from '../../utils/currency';
import {
  ArrowLeft,
  Calendar,
  CheckCheck,
  MapPin,
  MessageSquare,
  Send,
  ShieldCheck,
  ShieldAlert,
  User,
} from 'lucide-react';
import { BackHomeButton } from '../common/BackHomeButton';
import { ColorPreferencePicker } from '../common/ColorPreferencePicker';

export const ChatDrawer: React.FC = () => {
  const {
    language,
    t,
    conversations,
    activeConversation,
    setActiveConversation,
    sendMessage,
    currentUser,
    currentUniversity,
    openReviewModal,
    openReportModal,
    colorTheme,
    userColorPreference,
    setActiveListingDetail,
    listings,
  } = useCampusSoko();

  const [messageText, setMessageText] = useState('');
  const [showMeetupPicker, setShowMeetupPicker] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConversation) return;
    sendMessage(activeConversation.id, messageText.trim());
    setMessageText('');
  };

  const handleProposeMeeting = (spot: string) => {
    if (!activeConversation) return;
    const text = language === 'sw'
      ? `Napendekeza tukutane hapa: ${spot} kwa ajili ya kukagua bidhaa na kufanya malipo.`
      : `I propose we meet here: ${spot} for item inspection and payment.`;
    sendMessage(activeConversation.id, text, { isMeetingProposal: true, meetingPoint: spot });
    setShowMeetupPicker(false);
  };

  // If inside an active conversation
  if (activeConversation) {
    const isSeller = activeConversation.sellerId === currentUser?.id;
    const otherParticipantName = isSeller ? activeConversation.buyerName : activeConversation.sellerName;
    const otherParticipantId = isSeller ? activeConversation.buyerId : activeConversation.sellerId;

    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[75vh] max-w-3xl mx-auto overflow-hidden animate-in fade-in duration-150">
        
        {/* Chat Header */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <button
              type="button"
              onClick={() => setActiveConversation(null)}
              className="min-w-[40px] min-h-[40px] p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center shrink-0 focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none"
              aria-label="Rudi nyuma kwenye orodha ya jumbe / Back to conversation list"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="min-w-0 flex-1 overflow-hidden">
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-[15px] sm:text-[17px] font-semibold text-slate-900 dark:text-white truncate block">
                  {otherParticipantName}
                </span>
                <span title={t.verifiedStudent} className="shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const relatedListing = listings.find((l) => l.id === activeConversation.listingId);
                  if (relatedListing) {
                    setActiveListingDetail(relatedListing);
                  }
                }}
                className="text-left text-[12px] sm:text-[13px] text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 block truncate max-w-full font-normal transition-colors cursor-pointer hover:underline"
                title={language === 'sw' ? 'Bofya kutazama tangazo hili' : 'Tap to view item details'}
              >
                {activeConversation.listingTitle} ({formatTZS(activeConversation.listingPrice)})
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <ColorPreferencePicker variant="compact" />
            <BackHomeButton variant="compact" />

            {/* Review Button */}
            <button
              type="button"
              onClick={() =>
                openReviewModal({
                  userId: otherParticipantId,
                  userName: otherParticipantName,
                  listingTitle: activeConversation.listingTitle,
                })
              }
              className={`min-h-[44px] px-3 py-2 text-[13px] sm:text-[14px] font-semibold rounded-xl transition-colors flex items-center gap-1 focus-visible:ring-2 ${colorTheme.ringFocus} focus-visible:outline-none ${colorTheme.secondaryBtn}`}
            >
              <span>{language === 'sw' ? 'Maoni' : 'Review'}</span>
            </button>

            {/* Report / Block User Button */}
            <button
              type="button"
              onClick={() =>
                openReportModal({
                  type: 'user',
                  id: otherParticipantId,
                  title: otherParticipantName,
                  sellerId: otherParticipantId,
                })
              }
              className="min-h-[44px] px-3 py-2 text-[13px] sm:text-[14px] font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none"
              title={language === 'sw' ? 'Ripoti au mzuie mtumiaji huyu' : 'Report or block this user'}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{language === 'sw' ? 'Ripoti' : 'Report'}</span>
            </button>
          </div>
        </div>

        {/* Safe Meetup Proposal Bar */}
        <div className="px-4 py-2 bg-slate-100/70 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between text-[12px] sm:text-[13px] text-slate-800 dark:text-slate-200">
          <div className="flex items-center gap-1.5 truncate font-normal">
            <MapPin className={`w-3.5 h-3.5 ${colorTheme.iconColor} shrink-0`} />
            <span className="truncate">{t.safetyFirstReminder}</span>
          </div>

          <button
            type="button"
            onClick={() => setShowMeetupPicker(!showMeetupPicker)}
            className={`min-h-[44px] px-2 py-1 flex items-center text-[13px] font-semibold underline whitespace-nowrap ml-2 focus-visible:ring-2 ${colorTheme.ringFocus} focus-visible:outline-none ${colorTheme.accentText}`}
          >
            {t.proposeMeeting}
          </button>
        </div>

        {/* Dropdown for Safe Meeting Points */}
        {showMeetupPicker && (
          <div className="p-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 space-y-2 animate-in fade-in duration-100">
            <span className="text-[12px] font-medium text-slate-500 dark:text-slate-400 block">
              {language === 'sw' ? 'Chagua eneo rasmi la kukutana:' : 'Select official safe meeting point:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {currentUniversity.safeMeetingPoints.map((spot) => (
                <button
                  key={spot}
                  type="button"
                  onClick={() => handleProposeMeeting(spot)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-[13px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors focus-visible:outline-hidden focus-visible:ring-2 ${colorTheme.ringFocus}`}
                >
                  {spot}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages Scroll Area - Body text: 14–16 px, Regular (400) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeConversation.messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-[14px] leading-relaxed font-normal space-y-1.5 ${
                    isMe
                      ? `${colorTheme.chatBubble} rounded-br-xs shadow-xs`
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-xs'
                  }`}
                >
                  {msg.isMeetingProposal && (
                    <div className="p-2 rounded-xl bg-white/20 dark:bg-black/20 flex items-center gap-1.5 font-semibold text-[13px] mb-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{msg.meetingPoint}</span>
                    </div>
                  )}
                  <p>{msg.text}</p>
                  <div
                    className={`flex items-center justify-end gap-1 text-[11px] font-normal ${
                      isMe ? 'opacity-80' : 'text-slate-400'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSend} className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <input
            id="chat-message-input"
            aria-label={t.typeMessagePlaceholder}
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={t.typeMessagePlaceholder}
            className={`flex-1 text-[14px] px-3.5 py-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-normal focus:outline-hidden focus:ring-2 ${colorTheme.ringFocus}`}
          />
          <button
            type="submit"
            disabled={!messageText.trim()}
            className={`min-w-[48px] h-12 rounded-xl disabled:opacity-50 flex items-center justify-center transition-all ${colorTheme.primaryBtn}`}
            aria-label="Tuma ujumbe / Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    );
  }

  // Conversation List View
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Top Back Home Bar */}
      <div className="flex items-center justify-between">
        <BackHomeButton />
        <ColorPreferencePicker variant="compact" />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <h2 className="text-[18px] sm:text-[20px] font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className={`w-5 h-5 ${colorTheme.iconColor}`} />
          <span>{t.navChats}</span>
        </h2>
        <span className="text-[12px] sm:text-[13px] font-normal text-slate-400">
          {conversations.length} {language === 'sw' ? 'mazungumzo' : 'conversations'}
        </span>
      </div>

      {conversations.length > 0 ? (
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {conversations.map((conv) => {
            const isSeller = conv.sellerId === currentUser?.id;
            const otherName = isSeller ? conv.buyerName : conv.sellerName;
            const lastMsg = conv.messages[conv.messages.length - 1];

            return (
              <div
                key={conv.id}
                role="button"
                tabIndex={0}
                onClick={() => setActiveConversation(conv)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveConversation(conv);
                  }
                }}
                className={`py-3.5 flex items-center gap-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2.5 rounded-2xl cursor-pointer transition-colors focus-visible:ring-2 ${colorTheme.ringFocus} focus-visible:outline-hidden`}
                aria-label={`Mazungumzo na ${otherName} kuhusu ${conv.listingTitle}`}
              >
                <div className="relative">
                  <div className={`w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold ${colorTheme.accentText}`}>
                    {otherName.charAt(0)}
                  </div>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 absolute bottom-0 right-0 bg-white dark:bg-slate-900 rounded-full" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[14px] sm:text-[15px] font-semibold text-slate-900 dark:text-white truncate">
                      {otherName}
                    </h4>
                    <span className="text-[11px] font-normal text-slate-400">
                      {conv.updatedAt}
                    </span>
                  </div>

                  <p className={`text-[13px] sm:text-[14px] font-medium truncate ${colorTheme.accentText}`}>
                    {conv.listingTitle}
                  </p>

                  {lastMsg && (
                    <p className="text-[12px] sm:text-[13px] font-normal text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {lastMsg.text}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Actionable Empty State */
        <div className="p-8 text-center space-y-4 max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <MessageSquare className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-[16px] sm:text-[18px] font-semibold text-slate-900 dark:text-white">
              {t.noChatsYet}
            </h3>
            <p className="text-[14px] font-normal text-slate-500 dark:text-slate-400 leading-relaxed">
              {language === 'sw'
                ? 'Unapobonyeza kitufe cha "Tuma Ujumbe" kwenye tangazo lolote, mazungumzo yako na muuzaji yataonekana hapa.'
                : 'When you tap "In-App Chat" on any campus listing, your conversation with the seller will appear here.'}
            </p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
