import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import { CATEGORIES } from '../../data/categories';
import { compressImageWithDetails, formatBytes } from '../../services/imageCompressor';
import { checkProhibitedContent } from '../../data/prohibitedKeywords';
import { formatTZS, parseTZS } from '../../utils/currency';
import { CategoryId, Condition } from '../../types';
import { BackHomeButton } from '../common/BackHomeButton';
import { CategoryIcon } from '../common/CategoryIcon';
import {
  AlertTriangle,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  Image as ImageIcon,
  Info,
  Loader2,
  MapPin,
  Plus,
  RotateCcw,
  Save,
  ShieldAlert,
  ShieldCheck,
  Tag,
  Trash2,
  Upload,
  X,
  BookOpen,
  Laptop,
  Home,
  Shirt,
  Coffee,
  Briefcase,
  Armchair,
} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'campus_soko_sell_draft_v2';

interface PhotoItem {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  savedPercentage: number;
  fileName: string;
}

interface ListingDraft {
  title: string;
  category: CategoryId;
  condition: Condition;
  description: string;
  photos: PhotoItem[];
  price: string;
  isNegotiable: boolean;
  campusZone: string;
  safePickupPoint: string;
  customLandmark: string;
  savedAt: number;
}

export const CreateListingModal: React.FC = () => {
  const {
    language,
    t,
    isCreateListingOpen,
    setIsCreateListingOpen,
    currentUniversity,
    currentUser,
    createListing,
    showToast,
    openProhibitedPolicyModal,
  } = useCampusSoko();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('textbooks');
  const [condition, setCondition] = useState<Condition>('good');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState<{ current: number; total: number; percent: number } | null>(null);
  const [price, setPrice] = useState('');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [campusZone, setCampusZone] = useState('');
  const [safePickupPoint, setSafePickupPoint] = useState('');
  const [customLandmark, setCustomLandmark] = useState('');
  const [prohibitedAlert, setProhibitedAlert] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Draft state management
  const [hasExistingDraft, setHasExistingDraft] = useState(false);
  const [draftSavedTimestamp, setDraftSavedTimestamp] = useState<number | null>(null);
  const [showDraftBanner, setShowDraftBanner] = useState(false);

  // Safety confirmation checklist
  const [checkedRules, setCheckedRules] = useState({
    authentic: true,
    safeLocation: true,
    cashOrMpesa: true,
  });

  // Publishing simulation state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgressText, setPublishProgressText] = useState('');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Initialize defaults on university change or modal open
  useEffect(() => {
    if (isCreateListingOpen) {
      if (!campusZone && currentUniversity.zones.length > 0) {
        setCampusZone(currentUniversity.zones[0]);
      }
      if (!safePickupPoint && currentUniversity.safeMeetingPoints.length > 0) {
        setSafePickupPoint(currentUniversity.safeMeetingPoints[0]);
      }

      // Check if a draft exists in localStorage
      try {
        const savedRaw = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (savedRaw) {
          const parsed: ListingDraft = JSON.parse(savedRaw);
          if (parsed.title || parsed.description || parsed.photos.length > 0) {
            setHasExistingDraft(true);
            setDraftSavedTimestamp(parsed.savedAt);
            setShowDraftBanner(true);
          }
        }
      } catch {
        // Ignore localStorage error
      }
    }
  }, [isCreateListingOpen, currentUniversity, campusZone, safePickupPoint]);

  // Restore draft handler
  const handleRestoreDraft = () => {
    try {
      const savedRaw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedRaw) {
        const parsed: ListingDraft = JSON.parse(savedRaw);
        setTitle(parsed.title || '');
        setCategory(parsed.category || 'textbooks');
        setCondition(parsed.condition || 'good');
        setDescription(parsed.description || '');
        setPhotos(parsed.photos || []);
        setPrice(parsed.price || '');
        setIsNegotiable(parsed.isNegotiable ?? true);
        if (parsed.campusZone) setCampusZone(parsed.campusZone);
        if (parsed.safePickupPoint) setSafePickupPoint(parsed.safePickupPoint);
        setCustomLandmark(parsed.customLandmark || '');
        setShowDraftBanner(false);
        showToast(language === 'sw' ? 'Rasimu imerejeshwa kikamilifu' : 'Draft restored successfully');
      }
    } catch {
      showToast(language === 'sw' ? 'Hitilafu kurejesha rasimu' : 'Error restoring draft', 'error');
    }
  };

  // Discard draft handler
  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setHasExistingDraft(false);
      setShowDraftBanner(false);
      setTitle('');
      setCategory('textbooks');
      setCondition('good');
      setDescription('');
      setPhotos([]);
      setPrice('');
      setIsNegotiable(true);
      setCustomLandmark('');
      showToast(language === 'sw' ? 'Rasimu imefutwa' : 'Draft cleared');
    } catch {
      // Ignore
    }
  };

  // Auto-save draft debounced
  const saveDraftToStorage = useCallback(() => {
    if (!title && !description && photos.length === 0 && !price) return;
    try {
      const draft: ListingDraft = {
        title,
        category,
        condition,
        description,
        photos,
        price,
        isNegotiable,
        campusZone,
        safePickupPoint,
        customLandmark,
        savedAt: Date.now(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setDraftSavedTimestamp(Date.now());
    } catch {
      // Ignore
    }
  }, [
    title,
    category,
    condition,
    description,
    photos,
    price,
    isNegotiable,
    campusZone,
    safePickupPoint,
    customLandmark,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveDraftToStorage();
    }, 1000);
    return () => clearTimeout(timer);
  }, [saveDraftToStorage]);

  // Title change with prohibited content check
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (errors.title) setErrors((prev) => ({ ...prev, title: '' }));
    const prohibited = checkProhibitedContent(val + ' ' + description);
    if (prohibited.isProhibited) {
      setProhibitedAlert(language === 'sw' ? (prohibited.reasonSw || 'Maudhui yamezuiliwa') : (prohibited.reasonEn || 'Prohibited content'));
    } else {
      setProhibitedAlert(null);
    }
  };

  // Description change with prohibited content check
  const handleDescriptionChange = (val: string) => {
    setDescription(val);
    if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
    const prohibited = checkProhibitedContent(title + ' ' + val);
    if (prohibited.isProhibited) {
      setProhibitedAlert(language === 'sw' ? (prohibited.reasonSw || 'Maudhui yamezuiliwa') : (prohibited.reasonEn || 'Prohibited content'));
    } else {
      setProhibitedAlert(null);
    }
  };

  // Photo processing & compression
  const processFiles = async (files: FileList | File[]) => {
    const remainingSlots = 5 - photos.length;
    if (remainingSlots <= 0) {
      showToast(language === 'sw' ? 'Upeo ni picha 5 tu' : 'Max 5 photos allowed', 'error');
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    setIsCompressing(true);
    setCompressionProgress({ current: 0, total: filesToProcess.length, percent: 0 });

    const newPhotos: PhotoItem[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      if (!file.type.startsWith('image/')) continue;

      try {
        setCompressionProgress({
          current: i + 1,
          total: filesToProcess.length,
          percent: Math.round(((i + 0.5) / filesToProcess.length) * 100),
        });

        const res = await compressImageWithDetails(file, 1200, 0.8);

        newPhotos.push({
          dataUrl: res.dataUrl,
          originalSize: res.originalSize,
          compressedSize: res.compressedSize,
          savedPercentage: res.savedPercentage,
          fileName: file.name,
        });
      } catch {
        // Fallback file reader
        const fallbackUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string) || '');
          reader.readAsDataURL(file);
        });
        if (fallbackUrl) {
          newPhotos.push({
            dataUrl: fallbackUrl,
            originalSize: file.size,
            compressedSize: file.size,
            savedPercentage: 0,
            fileName: file.name,
          });
        }
      }
    }

    setPhotos((prev) => [...prev, ...newPhotos]);
    setIsCompressing(false);
    setCompressionProgress(null);
    saveDraftToStorage();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== index));
    saveDraftToStorage();
  };

  const setAsCoverPhoto = (index: number) => {
    if (index === 0) return;
    setPhotos((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
    saveDraftToStorage();
  };

  // Helper for quick price increments
  const addPriceAmount = (amount: number) => {
    const current = parseTZS(price) || 0;
    const next = current + amount;
    setPrice(next.toString());
    if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
  };

  // Helper suggestions for description
  const getSuggestionChips = () => {
    switch (category) {
      case 'textbooks':
        return language === 'sw'
          ? ['Toleo la hivi karibuni', 'Haina michoro ndani', 'Inafaa kwa mtihani']
          : ['Latest edition', 'Clean pages, no highlights', 'Exam essential'];
      case 'electronics':
      case 'phones_tablets':
        return language === 'sw'
          ? ['Betri inakaa muda mrefu', 'Inakuja na charger halisi', 'Haina tatizo lolote']
          : ['Strong battery health', 'Original charger included', 'No functional issues'];
      case 'hostel_essentials':
      case 'furniture':
        return language === 'sw'
          ? ['Inafaa sana chumba cha bweni', 'Safi na imetunzwa vizuri', 'Rahisi kubeba']
          : ['Perfect for hostel room', 'Clean and well maintained', 'Easy to transport'];
      default:
        return language === 'sw'
          ? ['Bei inapungua kidogo', 'Kutana maktaba mchana', 'Ipo katika hali nzuri sana']
          : ['Price slightly negotiable', 'Meet at library in daylight', 'Great working condition'];
    }
  };

  // Complete Form Validation
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!title.trim() || title.trim().length < 3) {
      newErrors.title = language === 'sw' ? 'Jina la bidhaa liwe na angalau herufi 3' : 'Title must be at least 3 characters';
    }

    const numericPrice = parseTZS(price);
    if (!numericPrice || numericPrice < 500) {
      newErrors.price = language === 'sw' ? 'Weka bei halali (angalau TZS 500)' : 'Enter valid price (min TZS 500)';
    }

    if (!description.trim() || description.trim().length < 15) {
      newErrors.description = language === 'sw' ? 'Maelezo yawe na angalau herufi 15' : 'Description must be at least 15 characters';
    }

    const prohibited = checkProhibitedContent(title + ' ' + description);
    if (prohibited.isProhibited) {
      const msg = language === 'sw' ? (prohibited.reasonSw || 'Maudhui yamezuiliwa') : (prohibited.reasonEn || 'Prohibited content');
      setProhibitedAlert(msg);
      newErrors.prohibited = msg;
    }

    if (!checkedRules.authentic || !checkedRules.safeLocation || !checkedRules.cashOrMpesa) {
      newErrors.rules = language === 'sw' ? 'Tafadhali kubali kanuni zote za usalama' : 'Please agree to all safety rules';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Final Form Submission
  const handleSubmitListing = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast(language === 'sw' ? 'Tafadhali kamilisha sehemu zenye makosa' : 'Please complete required fields', 'error');
      return;
    }

    setIsPublishing(true);
    setPublishProgressText(language === 'sw' ? 'Inathibitisha maelezo...' : 'Verifying details...');

    await new Promise((r) => setTimeout(r, 400));
    setPublishProgressText(language === 'sw' ? 'Inapakia picha na kuziokoa...' : 'Saving optimized photos...');

    await new Promise((r) => setTimeout(r, 400));
    setPublishProgressText(language === 'sw' ? 'Inachapisha kwenye soko la chuo...' : 'Publishing to campus feed...');

    await new Promise((r) => setTimeout(r, 300));

    const numericPrice = parseTZS(price);
    const photoUrls = photos.length > 0 ? photos.map((p) => p.dataUrl) : [];

    const finalPickup = customLandmark.trim()
      ? `${safePickupPoint || currentUniversity.safeMeetingPoints[0]} (${customLandmark.trim()})`
      : safePickupPoint || currentUniversity.safeMeetingPoints[0] || 'Maktaba Kuu';

    const result = createListing({
      sellerId: currentUser?.id || 'demo_seller',
      sellerName: currentUser?.fullName || 'Campus Student',
      sellerPhone: currentUser?.phone || '0712345678',
      sellerVerified: currentUser?.isVerified ?? false,
      sellerRating: currentUser?.rating || 5.0,
      sellerAvatar: currentUser?.avatarUrl,
      universityId: currentUniversity.id,
      campusZone: campusZone || currentUniversity.zones[0],
      safePickupPoint: finalPickup,
      title: title.trim(),
      description: description.trim(),
      category,
      price: numericPrice,
      isNegotiable,
      condition,
      images: photoUrls,
    });

    setIsPublishing(false);

    if (result.success) {
      setPublishSuccess(true);
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // Ignore
      }
      showToast(language === 'sw' ? 'Tangazo lako limechapishwa chuoni!' : 'Listing published successfully!');
    } else {
      showToast(result.error || 'Error creating listing', 'error');
    }
  };

  const handleCloseModal = () => {
    setIsCreateListingOpen(false);
    setPublishSuccess(false);
  };

  const handleStartAnother = () => {
    setTitle('');
    setCategory('textbooks');
    setCondition('good');
    setDescription('');
    setPhotos([]);
    setPrice('');
    setIsNegotiable(true);
    setCustomLandmark('');
    setPublishSuccess(false);
    setErrors({});
  };

  if (!isCreateListingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-0 sm:p-4 overflow-y-auto overflow-x-hidden">
      {/* Modal Dialog Container - Full screen on mobile, rounded card on tablet/desktop */}
      <div className="w-full sm:max-w-2xl bg-white dark:bg-slate-900 sm:rounded-3xl border-0 sm:border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col min-h-screen sm:min-h-0 sm:max-h-[92vh] overflow-hidden my-0 sm:my-4">
        
        {/* Sticky Header with Title, Campus Badge & Close Button */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm sticky top-0 z-20 gap-2">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <BackHomeButton variant="compact" onClick={handleCloseModal} />
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hidden sm:flex">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-900 dark:text-white leading-tight truncate">
                {language === 'sw' ? 'Weka Tangazo la Kuuza' : 'Create New Listing'}
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentUniversity.shortName}</span>
                <span>•</span>
                <span className="truncate">{language === 'sw' ? 'Weka tangazo bure kwa wanafunzi' : 'Free student ad posting'}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCloseModal}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Funga dirisha / Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Draft Recovery Banner */}
        {showDraftBanner && !publishSuccess && (
          <div className="mx-4 sm:mx-5 mt-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 truncate">
              <Clock className="w-4 h-4 shrink-0 text-amber-600" />
              <span className="truncate">
                {language === 'sw' ? 'Una tangazo lisilomalizika lililohifadhiwa.' : 'You have an unfinished draft.'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] transition-colors"
              >
                {t.restoreDraftBtn}
              </button>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="px-2 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
              >
                {t.discardDraftBtn}
              </button>
            </div>
          </div>
        )}

        {/* Prohibited Keyword Alert Banner */}
        {prohibitedAlert && !publishSuccess && (
          <div className="mx-4 sm:mx-5 mt-3 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 flex items-start gap-3 animate-in fade-in">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
            <div className="flex-1 min-w-0">
              <span className="font-bold text-xs">{t.prohibitedWarning}</span>
              <p className="mt-0.5 text-[11px] leading-relaxed font-medium">{prohibitedAlert}</p>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={openProhibitedPolicyModal}
                  className="text-[11px] font-bold text-red-700 dark:text-red-300 underline hover:text-red-800 flex items-center gap-1 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{language === 'sw' ? 'Soma Sera Kamili ya Vitu Vilivyopigwa Marufuku' : 'Read Full Prohibited Items Policy'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Single Page Form Scroll Container: Scroll Downward or Upward ONLY */}
        <div className="p-4 sm:p-6 overflow-y-auto overflow-x-hidden flex-1 space-y-7">
          
          {/* SUCCESS SCREEN */}
          {publishSuccess ? (
            <div className="py-8 px-4 text-center space-y-5 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center shadow-inner">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {language === 'sw' ? 'Hongera! Tangazo Limesambazwa Chuoni!' : 'Awesome! Your Listing is Live!'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-md mx-auto leading-relaxed">
                  {language === 'sw'
                    ? `Wanafunzi wa ${currentUniversity.name} sasa wanaweza kuona "${title}" na kuwasiliana nawe kwa Chat au WhatsApp.`
                    : `Students at ${currentUniversity.name} can now view "${title}" and message you via in-app chat or WhatsApp.`}
                </p>
              </div>

              {/* Published Highlights Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>{title}</span>
                  <span className="text-emerald-600 dark:text-emerald-400">{formatTZS(parseTZS(price))}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{campusZone} • {safePickupPoint}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    {language === 'sw' ? 'Hali ya Bidhaa:' : 'Condition:'}
                  </span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 uppercase">
                    {condition}
                  </span>
                </div>
              </div>

              {/* Success Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.viewPublishedListing}</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartAnother}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.postAnotherListing}</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitListing} className="space-y-7">
              
              {/* SECTION 1: ITEM DETAILS (ALL ON SAME PAGE) */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">1</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'sw' ? 'Taarifa za Msingi za Bidhaa' : 'Item Details'}
                  </h3>
                </div>

                {/* Title Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {t.itemTitle} <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-[11px] ${title.length > 80 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                      {title.length}/80
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={80}
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder={t.itemTitlePlaceholder}
                    className={`w-full text-sm p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.title ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/30 focus:border-emerald-500'
                    } text-slate-900 dark:text-white transition-all`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.title}</p>
                  )}
                </div>

                {/* Category Selection Grid - Responsive Wrap, NO sliding */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {t.categoryLabel} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = category === cat.id;
                      return (
                        <button
                          type="button"
                          key={cat.id}
                          onClick={() => {
                            setCategory(cat.id);
                            saveDraftToStorage();
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all flex flex-col gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <div className={`p-1.5 w-fit rounded-lg overflow-hidden ${isSelected ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            <CategoryIcon iconName={cat.iconName} iconImage={cat.iconImage} className="w-4 h-4 object-contain" />
                          </div>
                          <span className="text-xs font-semibold leading-tight">
                            {language === 'sw' ? cat.nameSw : cat.nameEn}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Field & Negotiable Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {t.priceTZS} <span className="text-red-500">*</span>
                    </label>
                    {price && (
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatTZS(parseTZS(price))}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      TZS
                    </span>
                    <input
                      type="number"
                      min="500"
                      step="500"
                      value={price}
                      onChange={(e) => {
                        setPrice(e.target.value);
                        if (errors.price) setErrors((prev) => ({ ...prev, price: '' }));
                      }}
                      placeholder={t.pricePlaceholder}
                      className={`w-full pl-16 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border ${
                        errors.price ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/30 focus:border-emerald-500'
                      } text-base font-bold text-slate-900 dark:text-white transition-all`}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.price}</p>
                  )}

                  {/* Quick Price Increment Buttons (Wrap Flex, NO sliding) */}
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-semibold text-slate-400 mr-1">
                      {t.quickPriceSuggestions}
                    </span>
                    {[5000, 10000, 25000, 50000].map((amt) => (
                      <button
                        type="button"
                        key={amt}
                        onClick={() => addPriceAmount(amt)}
                        className="text-[10px] px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-400 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                      >
                        +{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  {/* Negotiable Checkbox */}
                  <div className="mt-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="sell-negotiable"
                      checked={isNegotiable}
                      onChange={(e) => setIsNegotiable(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500 border-slate-300 dark:border-slate-600"
                    />
                    <label htmlFor="sell-negotiable" className="text-xs text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                      <span className="font-semibold block">{t.negotiableCheckbox}</span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400">
                        {language === 'sw'
                          ? 'Wanunuzi wataona kuwa bei inaweza kupunguzwa kidogo baada ya maongezi.'
                          : 'Buyers will know you are open to reasonable student offers.'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Condition Selection Grid - Responsive Wrap */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                    {t.conditionSelect} <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      {
                        id: 'new' as Condition,
                        label: t.conditionNew,
                        desc: language === 'sw' ? 'Mpya kabisa' : 'Brand new in box',
                      },
                      {
                        id: 'like_new' as Condition,
                        label: t.conditionLikeNew,
                        desc: language === 'sw' ? 'Ikatumika kidogo' : 'Gently used',
                      },
                      {
                        id: 'good' as Condition,
                        label: t.conditionGood,
                        desc: language === 'sw' ? 'Inafanya kazi vizuri' : 'Works fine',
                      },
                      {
                        id: 'fair' as Condition,
                        label: t.conditionFair,
                        desc: language === 'sw' ? 'Ina alama za kutumika' : 'Visible wear',
                      },
                    ].map((c) => {
                      const isSelected = condition === c.id;
                      return (
                        <button
                          type="button"
                          key={c.id}
                          onClick={() => {
                            setCondition(c.id);
                            saveDraftToStorage();
                          }}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <span className="block text-xs font-bold">{c.label}</span>
                          <span className="block text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {c.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {t.itemDescription} <span className="text-red-500">*</span>
                    </label>
                    <span className={`text-[11px] ${description.length < 15 ? 'text-slate-400' : 'text-emerald-600 dark:text-emerald-400 font-medium'}`}>
                      {description.length}/1000 ({language === 'sw' ? 'angalau herufi 15' : 'min 15 chars'})
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={description}
                    onChange={(e) => handleDescriptionChange(e.target.value)}
                    placeholder={t.itemDescPlaceholder}
                    className={`w-full text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border ${
                      errors.description ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 dark:border-slate-700 focus:ring-emerald-500/30 focus:border-emerald-500'
                    } text-slate-900 dark:text-white transition-all`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-[11px] text-red-500 font-medium">{errors.description}</p>
                  )}

                  {/* Quick Suggestion Chips (Wrap, NO sliding) */}
                  <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-semibold text-slate-400 mr-1">
                      {language === 'sw' ? 'Vidokezo vya haraka:' : 'Helpful prompts:'}
                    </span>
                    {getSuggestionChips().map((chip, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          const updated = description
                            ? `${description.trim()}. ${chip}`
                            : chip;
                          handleDescriptionChange(updated);
                        }}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-800 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 transition-colors"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 2: PHOTOS (ALL ON SAME PAGE) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">2</span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {language === 'sw' ? 'Picha za Bidhaa' : 'Product Photos'}
                    </h3>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {photos.length}/5 {language === 'sw' ? 'picha' : 'photos'}
                  </span>
                </div>

                {/* Photo Dropzone / Upload Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`p-5 border-2 border-dashed rounded-3xl text-center transition-all ${
                    isDragging
                      ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                      : 'border-slate-300 dark:border-slate-700 hover:border-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="sell-photo-upload"
                    multiple
                    accept="image/*"
                    onChange={handleFileInputChange}
                    disabled={isCompressing || photos.length >= 5}
                    className="hidden"
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    id="sell-photo-camera"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileInputChange}
                    disabled={isCompressing || photos.length >= 5}
                    className="hidden"
                  />

                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                      {isCompressing ? (
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
                      ) : (
                        <Upload className="w-6 h-6" />
                      )}
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        {isCompressing
                          ? t.compressingImages
                          : language === 'sw'
                          ? 'Pakia picha za bidhaa yako'
                          : 'Upload photos of your item'}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {t.uploadPhotoPrompt}
                      </p>
                    </div>

                    {/* Both action buttons side-by-side on same page */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap justify-center">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isCompressing || photos.length >= 5}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{language === 'sw' ? 'Chagua Picha' : 'Choose Photos'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        disabled={isCompressing || photos.length >= 5}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all"
                      >
                        <Camera className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{language === 'sw' ? 'Piga Picha' : 'Take Photo'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Compression Progress */}
                {compressionProgress && (
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-emerald-900 dark:text-emerald-200 font-semibold text-[11px]">
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        {language === 'sw'
                          ? `Inabana picha ${compressionProgress.current} kati ya ${compressionProgress.total}...`
                          : `Compressing photo ${compressionProgress.current} of ${compressionProgress.total}...`}
                      </span>
                      <span>{compressionProgress.percent}%</span>
                    </div>
                    <div className="w-full bg-emerald-200 dark:bg-emerald-900/60 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full transition-all duration-200"
                        style={{ width: `${compressionProgress.percent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Photos Grid Thumbnails - Responsive Wrap Grid */}
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-1">
                    {photos.map((item, index) => (
                      <div
                        key={index}
                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                          index === 0
                            ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {item.dataUrl && item.dataUrl.trim().length > 0 && (
                          <img
                            src={item.dataUrl}
                            alt={`Upload preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Cover photo badge */}
                        {index === 0 ? (
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[9px] font-bold shadow-xs">
                            {t.coverPhotoBadge}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setAsCoverPhoto(index)}
                            className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-slate-900/80 text-white text-[9px] font-medium"
                          >
                            {t.makeCoverPhoto}
                          </button>
                        )}

                        {/* Delete Photo Button */}
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-full bg-red-600 text-white shadow-xs hover:scale-110 transition-transform"
                          aria-label={t.removePhoto}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Compression Stats Badge */}
                        <div className="absolute bottom-1.5 inset-x-1.5 px-1.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-xs text-[9px] text-white flex items-center justify-between">
                          <span>{formatBytes(item.compressedSize)}</span>
                          {item.savedPercentage > 0 && (
                            <span className="text-emerald-400 font-bold">-{item.savedPercentage}%</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 3: CAMPUS PICKUP LOCATION (ALL ON SAME PAGE) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">3</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'sw' ? 'Mahali pa Kukutana Chuoni' : 'Campus Pickup Spot'}
                  </h3>
                </div>

                {/* Campus Zone Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t.campusZone} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={campusZone || currentUniversity.zones[0]}
                    onChange={(e) => setCampusZone(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {currentUniversity.zones.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Safe Campus Pickup Spot Select */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t.selectPickupSpot} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={safePickupPoint || currentUniversity.safeMeetingPoints[0]}
                    onChange={(e) => setSafePickupPoint(e.target.value)}
                    className="w-full text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {currentUniversity.safeMeetingPoints.map((spot) => (
                      <option key={spot} value={spot}>
                        {spot}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Landmark Details Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                    {t.customLandmarkLabel}
                  </label>
                  <input
                    type="text"
                    value={customLandmark}
                    onChange={(e) => setCustomLandmark(e.target.value)}
                    placeholder={t.customLandmarkPlaceholder}
                    className="w-full text-xs p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                {/* Safe Points Trust Notice */}
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 flex items-start gap-2.5 text-xs text-emerald-900 dark:text-emerald-200">
                  <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                  <div>
                    <span className="font-bold">{t.whySafePointsTitle}</span>
                    <p className="mt-0.5 text-[11px] text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      {t.whySafePointsDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: SAFETY CONFIRMATION & PUBLISH (ALL ON SAME PAGE) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">4</span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {language === 'sw' ? 'Ukaguzi wa Usalama & Chapisha' : 'Safety Check & Publish'}
                  </h3>
                </div>

                {/* Safety Pre-Publishing Checklist */}
                <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2.5">
                  <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block">
                    {t.publishConfirmTitle}
                  </span>

                  <label className="flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedRules.authentic}
                      onChange={(e) => setCheckedRules((prev) => ({ ...prev, authentic: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded-sm mt-0.5 border-amber-300"
                    />
                    <span>{t.publishConfirmCheck1}</span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedRules.safeLocation}
                      onChange={(e) => setCheckedRules((prev) => ({ ...prev, safeLocation: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded-sm mt-0.5 border-amber-300"
                    />
                    <span>{t.publishConfirmCheck2}</span>
                  </label>

                  <label className="flex items-start gap-2.5 text-xs text-amber-950 dark:text-amber-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedRules.cashOrMpesa}
                      onChange={(e) => setCheckedRules((prev) => ({ ...prev, cashOrMpesa: e.target.checked }))}
                      className="w-4 h-4 text-emerald-600 rounded-sm mt-0.5 border-amber-300"
                    />
                    <span>{t.publishConfirmCheck3}</span>
                  </label>
                </div>

                {errors.rules && (
                  <p className="text-[11px] text-red-500 font-medium">{errors.rules}</p>
                )}

                {/* Publishing In-Progress State */}
                {isPublishing && (
                  <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center gap-3 text-xs font-bold text-emerald-900 dark:text-emerald-200 animate-pulse">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                    <span>{publishProgressText}</span>
                  </div>
                )}

                {/* ALL ACTION BUTTONS ON SAME PAGE */}
                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 sm:flex-none px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {t.cancel}
                    </button>
                    {hasExistingDraft && (
                      <button
                        type="button"
                        onClick={handleDiscardDraft}
                        className="flex-1 sm:flex-none px-4 py-3 rounded-2xl border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        {t.discardDraftBtn}
                      </button>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isPublishing ||
                      !checkedRules.authentic ||
                      !checkedRules.safeLocation ||
                      !checkedRules.cashOrMpesa
                    }
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-[#00b53f] hover:bg-[#00872e] disabled:opacity-50 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    {isPublishing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{t.publishingListingStatus}</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>{t.publishListing}</span>
                        {price && <span>({formatTZS(parseTZS(price))})</span>}
                      </>
                    )}
                  </button>
                </div>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
