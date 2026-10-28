import React from 'react';
import { useCampusSoko } from '../../context/CampusSokoContext';
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  MapPin,
  PhoneCall,
  ShieldCheck,
  X,
} from 'lucide-react';
import { BackHomeButton } from '../common/BackHomeButton';

import { Accordion } from '../common/Accordion';

export const SafetyModal: React.FC = () => {
  const { language, t, isSafetyModalOpen, setIsSafetyModalOpen, currentUniversity } = useCampusSoko();

  if (!isSafetyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-150 my-4">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <BackHomeButton variant="compact" onClick={() => setIsSafetyModalOpen(false)} />
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hidden sm:flex shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {language === 'sw' ? 'Miongozo ya Usalama Chuoni' : 'Campus Safety & Anti-Scam Guide'}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 block truncate">
                {currentUniversity.shortName} · CampusSoko
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsSafetyModalOpen(false)}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-none shrink-0"
            aria-label="Funga dirisha / Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Pillars of Safety - CareerFoundry Accordion Component */}
        <div className="space-y-3">
          <Accordion
            variant="separated"
            allowMultiple={true}
            items={[
              {
                id: 'safety-spot',
                defaultOpen: true,
                icon: <MapPin className="w-4 h-4 text-emerald-600" />,
                title: language === 'sw' ? 'Kutana Maeneo Rasmi ya Chuo' : 'Meet at Populated Campus Hubs',
                badge: language === 'sw' ? 'Muhimu' : 'Required',
                content: (
                  <p className="text-slate-600 dark:text-slate-300 text-[13px] leading-relaxed">
                    {language === 'sw'
                      ? `Daima chagua maktaba kuu, geti kuu, au cafeteria ya ${currentUniversity.shortName}. Usikubali kukutana vichochoroni, usiku, au maeneo ya nje ya chuo usiyoyajua.`
                      : `Always choose the main library, campus gate, or student cafeteria at ${currentUniversity.shortName}. Avoid off-campus alleys or unlit spots.`}
                  </p>
                ),
              },
              {
                id: 'safety-test',
                defaultOpen: true,
                icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
                title: language === 'sw' ? 'Kagua Kifaa Kabla ya Kulipa' : 'Test & Inspect in Person',
                badge: language === 'sw' ? 'Majaribio' : 'Inspect',
                content: (
                  <p className="text-slate-600 dark:text-slate-300 text-[13px] leading-relaxed">
                    {language === 'sw'
                      ? 'Kama ni simu, laptop, pasi au chaja, chomeka kwenye umeme na ujaribu mbele ya muuzaji kabla ya kutoa fedha.'
                      : 'For laptops, phones, kettles or electronics, plug them in and verify they work fully in front of the seller before paying.'}
                  </p>
                ),
              },
              {
                id: 'safety-deposits',
                icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
                title: language === 'sw' ? 'Usiwahi Kutuma Pesa ya Ahadi / Nauli' : 'Never Send Advance Deposits',
                badge: language === 'sw' ? 'Onyo' : 'Warning',
                content: (
                  <p className="text-slate-600 dark:text-slate-300 text-[13px] leading-relaxed">
                    {language === 'sw'
                      ? 'Utapeli mwingi wa mitandaoni unahusisha muuzaji kukuomba umtumie "nauli ya bodaboda" au "nusu ya pesa kwanza ili asiuze kwa mtu mwingine". Kataa mara moja!'
                      : 'Scammers often ask for "delivery fare" or "advance booking deposits". Never send money prior to meeting in person on campus.'}
                  </p>
                ),
              },
              {
                id: 'safety-pay',
                icon: <Lock className="w-4 h-4 text-emerald-600" />,
                title: language === 'sw' ? 'Lipa kwa M-Pesa au Cash Papo Hapo' : 'Pay via M-Pesa or Cash On-Site',
                badge: language === 'sw' ? 'M-Pesa / TZS' : 'Payment',
                content: (
                  <p className="text-slate-600 dark:text-slate-300 text-[13px] leading-relaxed">
                    {language === 'sw'
                      ? 'Baada ya kuridhika na bidhaa, tuma pesa kwa M-Pesa, Tigo Pesa, Airtel Money au mpe cash ana kwa ana.'
                      : 'Once completely satisfied with the item, initiate direct cash or mobile money transfer to the seller.'}
                  </p>
                ),
              },
            ]}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsSafetyModalOpen(false)}
          className="w-full min-h-[44px] py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-sm focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          {language === 'sw' ? 'Nimeelewa, Endelea' : 'I Understand, Continue'}
        </button>

      </div>
    </div>
  );
};
