import React, { useState } from 'react';
import bgVideo from '../Path/gym.mp4';

export default function ClientContract({ onAccept, onDecline }) {
  const [accepted, setAccepted] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleAccept = () => {
    setAccepted(true);
    if (onAccept) onAccept();
  };

  const handleDecline = () => {
    if (onDecline) onDecline();
  };

  const handleScroll = (e) => {
    const element = e.target;
    const scrollPercentage = (element.scrollLeft / (element.scrollWidth - element.clientWidth)) * 100;
    setScrollPosition(scrollPercentage);
  };

  const contractSections = [
    {
      title: 'ACCEPTANCE OF TERMS',
      content: [
        'By registering for membership or using the facilities of this gym, you acknowledge that you have read, understood, and agreed to these Terms of Service, including the Safety Rules and Liability Waiver.',
      ],
    },
    {
      title: 'HEALTH & FITNESS',
      content: [
        'You confirm that you are physically fit to participate in exercise activities and have not been advised otherwise by a medical professional.',
        'You understand that participation in physical exercise involves inherent risks, including but not limited to injury, illness, or in rare cases, death.',
        'You voluntarily assume full responsibility for all risks associated with your participation.',
      ],
    },
    {
      title: 'LIABILITY WAIVER',
      content: [
        'The gym, its owners, staff, trainers, and affiliates shall not be held liable for any injuries, accidents, health conditions, or damages sustained while using the facilities.',
        'You hereby release and discharge the gym from any legal claims arising from your participation.',
      ],
    },
    {
      title: 'PERSONAL RESPONSIBILITY',
      content: [
        'Using equipment properly and safely',
        'Following instructions from staff or trainers',
        'Respecting gym rules and other members',
        'Maintaining personal hygiene and appropriate attire',
      ],
    },
  ];

  return (
    <div className='relative min-h-screen overflow-hidden bg-slate-950'>
      {/* Blurred Video Background */}
      <div className='absolute inset-0'>
        <video
          className='h-full w-full object-cover blur-sm'
          src={bgVideo}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className='absolute inset-0 bg-slate-950/75' />
      </div>

      {/* Container */}
      <div className='relative z-10 min-h-screen flex flex-col'>
        {/* Main Contract Layout */}
        <div className='flex-1 flex overflow-hidden'>
          {/* Left Panel - Hero/Title Section (40%) */}
          <div className='w-2/5 bg-black text-white p-8 md:p-12 flex flex-col justify-between overflow-y-auto'>
            <div>
              <p className='text-xs uppercase tracking-[0.35em] text-white/60 mb-4'>CONTRACT AGREEMENT</p>
              <h1 className='text-5xl md:text-6xl font-black leading-tight tracking-tighter'>CLIENT CONTRACT</h1>
            </div>
            <div className='space-y-4 text-sm text-slate-300'>
              <p>
                This Agreement is mutual and binding. By accepting these terms, you confirm your understanding of all conditions, risks, and responsibilities outlined in this contract.
              </p>
              <p className='text-xs text-slate-400'>
                Olympic Fitness Gym • Est. 2024 • Member Agreement & Liability Waiver
              </p>
            </div>
          </div>

          {/* Right Panel - Content Grid (60%) */}
          <div
            className='w-3/5 bg-white overflow-x-auto overflow-y-hidden'
            onScroll={handleScroll}
          >
            <div className='flex h-full min-w-max'>
              {/* Column 1 - Acceptance & Health */}
              <div className='w-1/4 border-r border-slate-300 p-6 overflow-y-auto flex flex-col'>
                <div className='space-y-4 text-xs'>
                  <div className='pb-4 border-b border-slate-300'>
                    <p className='text-[10px] uppercase tracking-[0.3em] font-semibold text-slate-700 mb-2'>1. ACCEPTANCE OF TERMS</p>
                    <p className='text-slate-600 leading-relaxed'>
                      By registering for membership or using the facilities of this gym, you acknowledge that you have read, understood, and agreed to these Terms of Service, including the Safety Rules and Liability Waiver.
                    </p>
                  </div>

                  <div className='pb-4 border-b border-slate-300'>
                    <p className='text-[10px] uppercase tracking-[0.3em] font-semibold text-slate-700 mb-2'>2. HEALTH & FITNESS ACKNOWLEDGMENT</p>
                    <p className='text-slate-600 leading-relaxed mb-3'>
                      You confirm that you are physically fit to participate in exercise activities and have not been advised otherwise by a medical professional.
                    </p>
                    <p className='text-slate-600 leading-relaxed'>
                      You understand that participation in physical exercise involves inherent risks, including but not limited to injury, illness, or in rare cases, death. You voluntarily assume full responsibility for all risks.
                    </p>
                  </div>
                </div>
              </div>

              {/* Column 2 - Liability & Personal Responsibility */}
              <div className='w-1/4 border-r border-slate-300 p-6 overflow-y-auto flex flex-col'>
                <div className='space-y-4 text-xs'>
                  <div className='pb-4 border-b border-slate-300'>
                    <p className='text-[10px] uppercase tracking-[0.3em] font-semibold text-slate-700 mb-2'>3. LIABILITY WAIVER</p>
                    <p className='text-slate-600 leading-relaxed mb-3'>
                      The gym, its owners, staff, trainers, and affiliates shall not be held liable for any injuries, accidents, health conditions, or damages sustained while using the facilities.
                    </p>
                    <p className='text-slate-600 leading-relaxed'>
                      You hereby release and discharge the gym from any legal claims arising from your participation.
                    </p>
                  </div>

                  <div className='pb-4 border-b border-slate-300'>
                    <p className='text-[10px] uppercase tracking-[0.3em] font-semibold text-slate-700 mb-2'>4. PERSONAL RESPONSIBILITY</p>
                    <ul className='text-slate-600 leading-relaxed space-y-1'>
                      <li>• Using equipment properly and safely</li>
                      <li>• Following staff or trainer instructions</li>
                      <li>• Respecting gym rules and members</li>
                      <li>• Maintaining personal hygiene</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Column 3 - Facility Rules */}
              <div className='w-1/4 border-r border-slate-300 p-6 overflow-y-auto flex flex-col'>
                <div className='space-y-4 text-xs'>
                  <div className='pb-4 border-b border-slate-300'>
                    <p className='text-[10px] uppercase tracking-[0.3em] font-semibold text-slate-700 mb-2'>5. FACILITY RULES</p>
                    <p className='text-slate-600 leading-relaxed mb-3'>Members agree to:</p>
                    <ul className='text-slate-600 leading-relaxed space-y-1'>
                      <li>• Wipe and sanitize equipment after use</li>
                      <li>• Return weights to proper storage</li>
                      <li>• Avoid unnecessary noise</li>
                      <li>• Not monopolize equipment</li>
                      <li>• Use proper gym attire</li>
                      <li>• Follow all posted signage</li>
                    </ul>
                  </div>

                  <div className='pb-4'>
                    <p className='text-[10px] uppercase tracking-[0.3em] font-semibold text-slate-700 mb-2'>6. PROHIBITED CONDUCT</p>
                    <ul className='text-slate-600 leading-relaxed space-y-1'>
                      <li>• Alcohol or illegal drugs</li>
                      <li>• Smoking or vaping</li>
                      <li>• Harassment or aggression</li>
                      <li>• Equipment damage</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Column 4 - Additional Terms & Agreement */}
              <div className='w-1/4 p-6 overflow-y-auto flex flex-col'>
                <div className='space-y-4 text-xs'>
                  <div className='pb-4 border-b border-slate-300'>
                    <p className='text-[10px] uppercase tracking-[0.3em] font-semibold text-slate-700 mb-2'>7. EQUIPMENT USAGE</p>
                    <p className='text-slate-600 leading-relaxed'>
                      Members must use equipment only for its intended purpose. Heavy lifting must be performed with proper form and, when necessary, under supervision from gym staff.
                    </p>
                  </div>

                  <div className='pb-4 border-b border-slate-300'>
                    <p className='text-[10px] uppercase tracking-[0.3em] font-semibold text-slate-700 mb-2'>8. MEDICAL EMERGENCIES</p>
                    <p className='text-slate-600 leading-relaxed'>
                      Immediately report any dizziness, chest pain, nausea, or discomfort to gym staff. Emergency contact information must be kept updated.
                    </p>
                  </div>

                  <div className='pb-4'>
                    <p className='text-[10px] uppercase tracking-[0.3em] font-semibold text-slate-700 mb-2'>9. AGREEMENT CONFIRMATION</p>
                    <p className='text-slate-600 leading-relaxed'>
                      By accepting below, you confirm full understanding and acceptance of all terms outlined in this contract.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className='relative bg-black/80 backdrop-blur border-t border-white/20 p-4 md:p-6 flex items-center justify-between'>
          {/* Scroll Indicator */}
          <div className='hidden md:flex items-center gap-2'>
            <p className='text-xs text-white/50'>Scroll to view all terms</p>
            <div className='w-24 h-1 bg-white/20 rounded-full overflow-hidden'>
              <div
                className='h-full bg-white/60 transition-all duration-300'
                style={{ width: `${scrollPosition}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 ml-auto'>
            <button
              onClick={handleDecline}
              className='px-6 py-2 text-sm font-semibold text-white border border-white/20 rounded-full hover:bg-white/10 transition'
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className='px-6 py-2 text-sm font-semibold text-white bg-[#091F5B] rounded-full hover:bg-[#081a4f] shadow-lg transition'
            >
              {accepted ? '✓ Accepted' : 'Accept & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
