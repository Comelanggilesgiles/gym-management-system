import React, { useState, useEffect } from 'react';
import logoImg from '../Path/logo.png';
import bgVideo from '../Path/gym.mp4';

const API_URL = typeof window !== 'undefined'
  ? `${window.location.protocol}//${window.location.hostname}:5000`
  : 'http://localhost:5000';

export default function Sign({ onBack, onSignupComplete, onSignupSuccess }) {
  const [isSignInPressed, setIsSignInPressed] = useState(false);
  // Form States
  const [step, setStep] = useState('signup'); // 'signup' | 'registration' | 'contract'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Registration Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleInitial, setMiddleInitial] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [cellPhone, setCellPhone] = useState('');
  const [civilStatus, setCivilStatus] = useState('Single');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  // Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation States
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailAvailable, setEmailAvailable] = useState(null);
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });
  const [passwordMatchError, setPasswordMatchError] = useState('');
  const [registrationErrors, setRegistrationErrors] = useState({});

  // Response States
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [signupData, setSignupData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const agreementDate = new Date().toLocaleDateString();

  // Validation Functions
  const validateName = (value) => {
    if (!value.trim()) {
      setNameError('Full name is required');
      return false;
    }
    if (value.trim().length < 2) {
      setNameError('Name must be at least 2 characters');
      return false;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      setNameError('Name can only contain letters, spaces, hyphens, and apostrophes');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = async (value) => {
    if (!value) {
      setEmailError('Email is required');
      setEmailAvailable(null);
      return false;
    }

    const trimmedEmail = value.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setEmailError('Please enter a valid email address');
      setEmailAvailable(null);
      return false;
    }

    // Skip availability check for Gmail addresses
    if (trimmedEmail.endsWith('@gmail.com')) {
      setEmailError('');
      setEmailAvailable(true);
      return true;
    }

    setEmailChecking(true);
    try {
      const response = await fetch(`${API_URL}/api/check-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.exists) {
        setEmailError('📧 This email is already registered');
        setEmailAvailable(false);
        setEmailChecking(false);
        return false;
      }

      setEmailError('');
      setEmailAvailable(true);
      setEmailChecking(false);
      return true;
    } catch (err) {
      console.error('Email verification error:', err);
      setEmailError('Unable to verify email. Please check your network or try again.');
      setEmailAvailable(null);
      setEmailChecking(false);
      return false;
    }
  };

  const validatePassword = (value) => {
    const newErrors = {
      length: value.length >= 8,
      uppercase: /[A-Z]/.test(value),
      lowercase: /[a-z]/.test(value),
      number: /\d/.test(value),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value),
    };
    setPasswordErrors(newErrors);
    return Object.values(newErrors).every(v => v);
  };

  const validatePasswordMatch = (pwd, confirmPwd) => {
    if (pwd && confirmPwd && pwd !== confirmPwd) {
      setPasswordMatchError('Passwords do not match');
      return false;
    }
    setPasswordMatchError('');
    return true;
  };

  const validateRegistrationForm = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!age || age < 13 || age > 120) newErrors.age = 'Please enter a valid age (13-120)';
    if (!address.trim()) newErrors.address = 'Address is required';
    if (!cellPhone.trim()) newErrors.cellPhone = 'Phone number is required';
    if (!civilStatus) newErrors.civilStatus = 'Civil status is required';
    if (!emergencyContactName.trim()) newErrors.emergencyContactName = 'Emergency contact name is required';
    if (!emergencyContactPhone.trim()) newErrors.emergencyContactPhone = 'Emergency contact phone is required';

    setRegistrationErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Debounced Email Check
  useEffect(() => {
    if (!email.trim()) {
      setEmailAvailable(null);
      setEmailError('');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      setEmailAvailable(null);
      return;
    }

    // Skip availability check for Gmail addresses
    if (email.toLowerCase().trim().endsWith('@gmail.com')) {
      setEmailError('');
      setEmailAvailable(true);
      return;
    }

    setEmailError('');
    const timer = setTimeout(() => {
      validateEmail(email);
    }, 600);

    return () => clearTimeout(timer);
  }, [email]);

  // Check password match whenever either password changes
  useEffect(() => {
    if (password && confirmPassword) {
      validatePasswordMatch(password, confirmPassword);
    }
  }, [password, confirmPassword]);

  const handleNameChange = (value) => {
    setName(value);
    validateName(value);
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    validatePassword(value);
    if (confirmPassword) {
      validatePasswordMatch(value, confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (password) {
      validatePasswordMatch(password, value);
    }
  };

  const isSignupFormValid = () => {
    return (
      name.trim() &&
      nameError === '' &&
      email.trim() &&
      !emailChecking &&
      emailAvailable === true &&
      emailError === '' &&
      Object.values(passwordErrors).every(v => v) &&
      password === confirmPassword &&
      passwordMatchError === '' &&
      agreeToTerms
    );
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!isSignupFormValid()) {
      setError('Please fix all errors before submitting.');
      return;
    }

    setStep('registration');
  };

  const handleRegistrationSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!validateRegistrationForm()) {
      setError('Please fix all errors before submitting.');
      return;
    }

    setSignupData({
      name,
      email: email.toLowerCase().trim(),
      password,
      firstName,
      lastName,
      middleInitial,
      age,
      address,
      cellPhone,
      civilStatus,
      emergencyContactName,
      emergencyContactPhone,
    });
    setStep('contract');
  };

  const handleContractAccept = async () => {
    setIsSubmitting(true);
    setError('');
    setMessage('');

    try {
      // Step 1: Create account
      const signupResponse = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const signupResult = await signupResponse.json();
      if (!signupResponse.ok) {
        setError(signupResult.message || 'Unable to create account.');
        return;
      }

      const token = signupResult.token;

      // Step 2: Save member registration
      const registrationResponse = await fetch(`${API_URL}/api/member-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          middleInitial: signupData.middleInitial,
          age: signupData.age,
          address: signupData.address,
          cellPhone: signupData.cellPhone,
          civilStatus: signupData.civilStatus,
          emergencyContactName: signupData.emergencyContactName,
          emergencyContactPhone: signupData.emergencyContactPhone,
        }),
      });

      const registrationResult = await registrationResponse.json();
      if (!registrationResponse.ok) {
        setError(registrationResult.message || 'Unable to save registration.');
        return;
      }

      const authUser = {
        token,
        email: signupResult.email,
        name: signupResult.name,
        role: signupResult.role || 'client',
      };

      if (onSignupSuccess) {
        onSignupSuccess();
        return;
      }

      setMessage('Account created and registration completed successfully!');
      setTimeout(() => {
        setStep('signup');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAgreeToTerms(false);
        setFirstName('');
        setLastName('');
        setMiddleInitial('');
        setAge('');
        setAddress('');
        setCellPhone('');
        setCivilStatus('Single');
        setEmergencyContactName('');
        setEmergencyContactPhone('');
        setMessage('');
        setSignupData(null);
        if (onBack) {
          onBack();
        }
      }, 1500);
    } catch (err) {
      console.error('Signup contract error:', err);
      setError('Unable to connect to the backend. Redirecting you back to the homepage.');

      if (onSignupSuccess && signupData) {
        onSignupSuccess();
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContractDecline = () => {
    setStep('registration');
    setError('');
    setMessage('Your member registration has not been saved. Please review the information and accept the agreement to continue.');
  };

  const handleBackFromRegistration = () => {
    setStep('signup');
    setRegistrationErrors({});
  };

  return (
    <div className='relative min-h-screen overflow-hidden bg-slate-950'>
      {step === 'contract' ? (
        // CONTRACT STEP
        <div className='relative min-h-screen overflow-hidden animate-fade-in'>
          <div className='absolute inset-0'>
            <video
              className='h-full w-full object-cover'
              src={bgVideo}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className='absolute inset-0 bg-slate-950/85' />
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(9,31,91,0.24),18%,transparent_35%),radial-gradient(circle_at_bottom_right,rgba(2,132,199,0.18),22%,transparent_40%)]' />
          </div>

          <div className='relative z-10 flex min-h-screen items-center justify-center px-4 py-8'>
            <div className='w-full max-w-4xl overflow-hidden rounded-none border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl'>
              <div className='grid grid-cols-1 lg:grid-cols-[1fr_1.35fr]'>
                <div className='bg-slate-950/95 p-6 md:p-8 text-white flex flex-col justify-between'>
                  <div>
                    <p className='text-xs uppercase tracking-[0.35em] text-slate-400 mb-4'>CONTRACT AGREEMENT</p>
                    <h1 className='text-3xl md:text-4xl font-black leading-tight tracking-tighter'>CLIENT CONTRACT</h1>
                  </div>
                  <div className='mt-6 space-y-4 text-sm text-slate-300'>
                    <p>Welcome {signupData?.name}! Review and accept the waiver to continue to your client dashboard.</p>
                    <p className='text-[11px] text-slate-500'>Olympic Fitness Gym • Est. 2024 • Member Agreement & Liability Waiver</p>
                    <p className='text-[11px] text-slate-500'>Agreement date: {agreementDate}</p>
                  </div>
                </div>

                <div className='bg-white p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-10rem)]'>
                  <div className='prose prose-sm max-w-none text-slate-700 leading-relaxed'>
                    <h3 className='text-lg font-bold text-slate-900 mb-6 text-center'>MEMBER AGREEMENT & LIABILITY WAIVER</h3>

                    <div className='space-y-6'>
                      <div>
                        <h4 className='font-bold text-slate-900 mb-2'>1. ACCEPTANCE OF TERMS</h4>
                        <p className='text-sm'>By registering for membership or using the facilities of this gym, you acknowledge that you have read, understood, and agreed to these Terms of Service, including the Safety Rules and Liability Waiver.</p>
                      </div>

                      <div>
                        <h4 className='font-bold text-slate-900 mb-2'>2. HEALTH & FITNESS ACKNOWLEDGMENT</h4>
                        <p className='text-sm mb-2'>You confirm that you are physically fit to participate in exercise activities and have not been advised otherwise by a medical professional.</p>
                        <p className='text-sm'>You understand that participation involves inherent risks. You voluntarily assume full responsibility for all risks.</p>
                      </div>

                      <div>
                        <h4 className='font-bold text-slate-900 mb-2'>3. LIABILITY WAIVER</h4>
                        <p className='text-sm mb-2'>The gym shall not be held liable for any injuries, accidents, health conditions, or damages sustained while using the facilities.</p>
                        <p className='text-sm'>You release the gym from any legal claims arising from your participation.</p>
                      </div>

                      <div>
                        <h4 className='font-bold text-slate-900 mb-2'>4. PERSONAL RESPONSIBILITY</h4>
                        <ul className='text-sm space-y-1 ml-4'>
                          <li>• Use equipment safely</li>
                          <li>• Follow staff instructions</li>
                          <li>• Respect gym rules</li>
                          <li>• Maintain hygiene</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className='font-bold text-slate-900 mb-2'>5. FACILITY RULES</h4>
                        <ul className='text-sm space-y-1 ml-4'>
                          <li>• Sanitize equipment after use</li>
                          <li>• Return weights to storage</li>
                          <li>• Avoid unnecessary noise</li>
                          <li>• Don't monopolize equipment</li>
                          <li>• Use proper gym attire</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className='font-bold text-slate-900 mb-2'>6. PROHIBITED CONDUCT</h4>
                        <ul className='text-sm space-y-1 ml-4'>
                          <li>• No alcohol or drugs</li>
                          <li>• No smoking</li>
                          <li>• No harassment</li>
                          <li>• No equipment damage</li>
                        </ul>
                      </div>

                      <div>
                        <h4 className='font-bold text-slate-900 mb-2'>7. EQUIPMENT USAGE</h4>
                        <p className='text-sm'>Use equipment only for its intended purpose. Heavy lifting must be performed with proper form and supervision.</p>
                      </div>

                      <div>
                        <h4 className='font-bold text-slate-900 mb-2'>8. MEDICAL EMERGENCIES</h4>
                        <p className='text-sm'>Report any dizziness, chest pain, or discomfort immediately. Keep emergency contact updated.</p>
                      </div>

                      <div>
                        <h4 className='font-bold text-slate-900 mb-2'>9. AGREEMENT CONFIRMATION</h4>
                        <p className='text-sm'>By accepting below, you confirm full understanding of all terms outlined in this contract.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='bg-slate-950/90 border-t border-white/10 p-4 md:p-5 flex flex-col sm:flex-row items-center justify-end gap-3'>
                {error && (
                  <div className='w-full bg-red-500/20 text-red-200 text-xs md:text-sm px-3 py-2 rounded-lg'>{error}</div>
                )}
                {message && (
                  <div className='w-full bg-emerald-500/20 text-emerald-200 text-xs md:text-sm px-3 py-2 rounded-lg'>{message}</div>
                )}
                {!message && (
                  <>
                    <button
                      onClick={handleContractDecline}
                      disabled={isSubmitting}
                      className='w-full sm:w-auto px-4 md:px-6 py-2 text-xs md:text-sm font-semibold text-white border border-white/20 rounded-full hover:bg-white/10 transition disabled:opacity-50'
                    >
                      Decline
                    </button>
                    <button
                      onClick={handleContractAccept}
                      disabled={isSubmitting}
                      className='w-full sm:w-auto px-4 md:px-6 py-2 text-xs md:text-sm font-semibold text-white bg-[#091F5B] rounded-full hover:bg-[#081a4f] shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2'
                    >
                      {isSubmitting ? (
                        <>
                          <div className='animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full'></div>
                          Processing...
                        </>
                      ) : (
                        'Accept & Continue'
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : step === 'registration' ? (
        // REGISTRATION FORM STEP
        <div className='animate-fade-in'>
          <div className='absolute inset-0 bg-slate-950' />
          <div className='absolute inset-0'>
            <video
              className='h-full w-full object-cover'
              src={bgVideo}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className='absolute inset-0 bg-slate-950/70' />
          </div>

          <div className='relative z-10 flex min-h-screen w-full justify-center items-center px-4 py-8'>
            <div className='w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 md:p-10 overflow-y-auto max-h-[95vh]'>
              <div className='space-y-6'>
                {/* Header */}
                <div className='text-center space-y-2'>
                  <p className='text-sm uppercase tracking-[0.35em] text-[#091F5B] font-semibold'>MEMBER REGISTRATION</p>
                  <h2 className='text-3xl md:text-4xl font-bold text-slate-900'>Complete Your Profile</h2>
                  <p className='text-sm text-slate-600'>Please provide your personal information to complete registration</p>
                </div>

                {error && (
                  <div className='p-4 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm'>{error}</div>
                )}

                {/* Form */}
                <form onSubmit={handleRegistrationSubmit} className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {/* First Name */}
                    <div>
                      <label className='block text-sm font-semibold text-slate-900 mb-1'>First Name *</label>
                      <input
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        type='text'
                        placeholder='First name'
                        className={`w-full h-10 rounded-lg px-3 bg-slate-50 border-2 text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          registrationErrors.firstName
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-slate-300 focus:border-[#091F5B] focus:ring-2 focus:ring-[#091F5B]/20'
                        }`}
                      />
                      {registrationErrors.firstName && <p className='text-red-500 text-xs mt-1'>{registrationErrors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className='block text-sm font-semibold text-slate-900 mb-1'>Last Name *</label>
                      <input
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        type='text'
                        placeholder='Last name'
                        className={`w-full h-10 rounded-lg px-3 bg-slate-50 border-2 text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          registrationErrors.lastName
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-slate-300 focus:border-[#091F5B] focus:ring-2 focus:ring-[#091F5B]/20'
                        }`}
                      />
                      {registrationErrors.lastName && <p className='text-red-500 text-xs mt-1'>{registrationErrors.lastName}</p>}
                    </div>

                    {/* Middle Initial */}
                    <div>
                      <label className='block text-sm font-semibold text-slate-900 mb-1'>M.I.</label>
                      <input
                        value={middleInitial}
                        onChange={(e) => setMiddleInitial(e.target.value.slice(0, 1))}
                        type='text'
                        placeholder='M'
                        maxLength='1'
                        className='w-full h-10 rounded-lg px-3 bg-slate-50 border-2 border-slate-300 focus:border-[#091F5B] focus:ring-2 focus:ring-[#091F5B]/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all'
                      />
                    </div>

                    {/* Age */}
                    <div>
                      <label className='block text-sm font-semibold text-slate-900 mb-1'>Age *</label>
                      <input
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        type='number'
                        min='13'
                        max='120'
                        placeholder='Age'
                        className={`w-full h-10 rounded-lg px-3 bg-slate-50 border-2 text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          registrationErrors.age
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-slate-300 focus:border-[#091F5B] focus:ring-2 focus:ring-[#091F5B]/20'
                        }`}
                      />
                      {registrationErrors.age && <p className='text-red-500 text-xs mt-1'>{registrationErrors.age}</p>}
                    </div>

                    {/* Address */}
                    <div className='md:col-span-2'>
                      <label className='block text-sm font-semibold text-slate-900 mb-1'>Address *</label>
                      <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        type='text'
                        placeholder='Street address'
                        className={`w-full h-10 rounded-lg px-3 bg-slate-50 border-2 text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          registrationErrors.address
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-slate-300 focus:border-[#091F5B] focus:ring-2 focus:ring-[#091F5B]/20'
                        }`}
                      />
                      {registrationErrors.address && <p className='text-red-500 text-xs mt-1'>{registrationErrors.address}</p>}
                    </div>

                    {/* Cell Phone */}
                    <div className='md:col-span-1'>
                      <label className='block text-sm font-semibold text-slate-900 mb-1'>Cell Phone *</label>
                      <input
                        value={cellPhone}
                        onChange={(e) => setCellPhone(e.target.value)}
                        type='tel'
                        placeholder='+1 (555) 000-0000'
                        className={`w-full h-10 rounded-lg px-3 bg-slate-50 border-2 text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          registrationErrors.cellPhone
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-slate-300 focus:border-[#091F5B] focus:ring-2 focus:ring-[#091F5B]/20'
                        }`}
                      />
                      {registrationErrors.cellPhone && <p className='text-red-500 text-xs mt-1'>{registrationErrors.cellPhone}</p>}
                    </div>

                    {/* Civil Status */}
                    <div>
                      <label className='block text-sm font-semibold text-slate-900 mb-1'>Civil Status *</label>
                      <select
                        value={civilStatus}
                        onChange={(e) => setCivilStatus(e.target.value)}
                        className={`w-full h-10 rounded-lg px-3 bg-slate-50 border-2 text-slate-900 outline-none transition-all ${
                          registrationErrors.civilStatus
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-slate-300 focus:border-[#091F5B] focus:ring-2 focus:ring-[#091F5B]/20'
                        }`}
                      >
                        <option>Single</option>
                        <option>Married</option>
                        <option>Divorced</option>
                        <option>Widowed</option>
                      </select>
                      {registrationErrors.civilStatus && <p className='text-red-500 text-xs mt-1'>{registrationErrors.civilStatus}</p>}
                    </div>

                    {/* Emergency Contact Name */}
                    <div>
                      <label className='block text-sm font-semibold text-slate-900 mb-1'>Emergency Contact Name *</label>
                      <input
                        value={emergencyContactName}
                        onChange={(e) => setEmergencyContactName(e.target.value)}
                        type='text'
                        placeholder='Full name'
                        className={`w-full h-10 rounded-lg px-3 bg-slate-50 border-2 text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          registrationErrors.emergencyContactName
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-slate-300 focus:border-[#091F5B] focus:ring-2 focus:ring-[#091F5B]/20'
                        }`}
                      />
                      {registrationErrors.emergencyContactName && <p className='text-red-500 text-xs mt-1'>{registrationErrors.emergencyContactName}</p>}
                    </div>

                    {/* Emergency Contact Phone */}
                    <div>
                      <label className='block text-sm font-semibold text-slate-900 mb-1'>Emergency Contact Phone *</label>
                      <input
                        value={emergencyContactPhone}
                        onChange={(e) => setEmergencyContactPhone(e.target.value)}
                        type='tel'
                        placeholder='+1 (555) 000-0000'
                        className={`w-full h-10 rounded-lg px-3 bg-slate-50 border-2 text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          registrationErrors.emergencyContactPhone
                            ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                            : 'border-slate-300 focus:border-[#091F5B] focus:ring-2 focus:ring-[#091F5B]/20'
                        }`}
                      />
                      {registrationErrors.emergencyContactPhone && <p className='text-red-500 text-xs mt-1'>{registrationErrors.emergencyContactPhone}</p>}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className='flex gap-3 pt-4'>
                    <button
                      type='button'
                      onClick={handleBackFromRegistration}
                      className='flex-1 h-11 rounded-lg font-semibold text-slate-900 border-2 border-slate-300 hover:bg-slate-50 transition'
                    >
                      Back
                    </button>
                    <button
                      type='submit'
                      className='flex-1 h-11 rounded-lg font-semibold text-white bg-[#091F5B] hover:bg-[#081a4f] transition'
                    >
                      Review Agreement
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // SIGNUP FORM STEP
        <>
          <div className='absolute inset-0 bg-slate-950' />
          <div className='absolute inset-0'>
            <video
              className='h-full w-full object-cover'
              src={bgVideo}
              autoPlay
              muted
              loop
              playsInline
            />
            <div className='absolute inset-0 bg-slate-950/70' />
          </div>

          <div className='relative z-10 flex h-screen w-full justify-between overflow-hidden'>
            <button
              type='button'
              onClick={() => {
                setIsSignInPressed(true);
                window.setTimeout(() => {
                  setIsSignInPressed(false);
                  onBack();
                }, 120);
              }}
              className={`absolute left-6 top-6 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-slate-950/80 text-white shadow-lg backdrop-blur transition hover:bg-slate-950 ${isSignInPressed ? 'scale-95' : 'scale-100'}`}
              aria-label='Go back to sign in'
            >
              <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>

            {/* Left Side */}
            <div className='hidden md:flex md:w-[66%] min-w-0 items-center justify-center px-12'>
              <div className='max-w-[620px] text-center text-white animate-slide-in-left'>
                <p className='text-sm uppercase tracking-[0.35em] text-white/70'>START YOUR JOURNEY</p>
                <h1 className='mt-6 text-5xl font-semibold leading-tight sm:text-6xl'>
                  Transform Your Body, Elevate Your Strength.
                </h1>
                <p className='mt-6 text-base leading-8 text-slate-200/85'>
                  Join thousands of members achieving their fitness goals with our premium gym facilities and expert guidance.
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className='relative flex w-full flex-col justify-center bg-white px-8 py-8 md:w-[34%] xl:w-[30%] md:pl-14 md:pr-10 md:py-10 h-full max-h-screen min-w-[360px] md:min-w-[420px] lg:min-w-[460px] overflow-y-auto animate-slide-in-right'>
              <div className='relative mx-auto flex w-full max-w-[360px] flex-col justify-between gap-5 h-full'>

                {/* Branding */}
                <div className='flex items-center gap-3'>
                  <img
                    src={logoImg}
                    alt='Olympic Fitness Gym'
                    className='h-11 w-11 rounded-2xl object-cover shadow-lg'
                  />
                  <div>
                    <p className='text-xs uppercase tracking-[0.35em] text-slate-400'>Olympic Fitness Gym</p>
                  </div>
                </div>

                {/* Heading */}
                <div className='space-y-4'>
                  <p className='text-sm uppercase tracking-[0.35em] text-[#091F5B] font-semibold'>CREATE ACCOUNT</p>
                  <h2 className='text-4xl font-semibold tracking-tight text-[#091F5B]'>Create Your Account</h2>
                  <p className='text-sm leading-7 text-slate-500'>Join now to start tracking your workouts and progress.</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSignupSubmit} className='space-y-4'>

                  {/* Full Name */}
                  <div>
                    <label className='block text-sm font-semibold text-slate-900 mb-2'>Full Name</label>
                    <input
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      onBlur={() => validateName(name)}
                      type='text'
                      placeholder='Enter your full name'
                      className={`w-full h-11 rounded-lg px-4 bg-slate-50 border-2 text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                        nameError
                          ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                          : 'border-slate-300 focus:border-[#091F5B] focus:ring-2 focus:ring-[#091F5B]/20'
                      }`}
                    />
                    {nameError && <p className='text-red-500 text-xs mt-1'>{nameError}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className='block text-sm font-semibold text-slate-900 mb-2'>Email Address</label>
                    <div className='relative'>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => email && validateEmail(email)}
                        type='email'
                        placeholder='Enter your email address'
                        className={`w-full h-11 rounded-lg px-4 pr-12 bg-slate-50 border-2 text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          emailChecking
                            ? 'border-blue-400'
                            : emailError
                            ? 'border-red-500'
                            : emailAvailable === true
                            ? 'border-emerald-500'
                            : 'border-slate-300 focus:border-[#091F5B]'
                        }`}
                        autoComplete='email'
                      />
                      {emailChecking && (
                        <div className='absolute right-4 top-1/2 -translate-y-1/2'>
                          <div className='animate-spin h-4 w-4 border-2 border-slate-300 border-t-blue-500 rounded-full'></div>
                        </div>
                      )}
                      {!emailChecking && emailAvailable === true && (
                        <div className='absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500'>✓</div>
                      )}
                    </div>
                    {emailError && <p className='text-red-500 text-xs mt-1'>{emailError}</p>}
                    {!emailChecking && emailAvailable === true && email && (
                      <p className='text-emerald-500 text-xs mt-1'>✓ Email verified and available</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className='block text-sm font-semibold text-slate-900 mb-2'>Password</label>
                    <div className='relative'>
                      <input
                        value={password}
                        onChange={(e) => handlePasswordChange(e.target.value)}
                        type={showPassword ? 'text' : 'password'}
                        placeholder='Create a strong password'
                        className='w-full h-11 rounded-lg px-4 pr-12 bg-slate-50 border-2 border-slate-300 focus:border-[#091F5B] focus:ring-2 focus:ring-[#091F5B]/20 text-slate-900 placeholder:text-slate-400 outline-none transition-all'
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900'
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>

                    {password && (
                      <div className='mt-3 space-y-2'>
                        <div className='grid grid-cols-2 gap-2 text-xs'>
                          {[
                            { label: '8+ characters', key: 'length' },
                            { label: 'Uppercase', key: 'uppercase' },
                            { label: 'Lowercase', key: 'lowercase' },
                            { label: 'Number', key: 'number' },
                          ].map(({ label, key }) => (
                            <div key={key} className='flex items-center gap-2'>
                              <span className={`w-2 h-2 rounded-full ${passwordErrors[key] ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                              <span className={passwordErrors[key] ? 'text-emerald-500 font-semibold' : 'text-slate-500'}>{label}</span>
                            </div>
                          ))}
                          <div className='col-span-2 flex items-center gap-2'>
                            <span className={`w-2 h-2 rounded-full ${passwordErrors.special ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                            <span className={passwordErrors.special ? 'text-emerald-500 font-semibold' : 'text-slate-500'}>Special char (!@#$%)</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className='block text-sm font-semibold text-slate-900 mb-2'>Confirm Password</label>
                    <div className='relative'>
                      <input
                        value={confirmPassword}
                        onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder='Re-enter your password'
                        className={`w-full h-11 rounded-lg px-4 pr-12 bg-slate-50 border-2 text-slate-900 placeholder:text-slate-400 outline-none transition-all ${
                          passwordMatchError
                            ? 'border-red-500'
                            : confirmPassword && password === confirmPassword
                            ? 'border-emerald-500'
                            : 'border-slate-300 focus:border-[#091F5B]'
                        }`}
                      />
                      <button
                        type='button'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className='absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-900'
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    {passwordMatchError && <p className='text-red-500 text-xs mt-1'>{passwordMatchError}</p>}
                    {confirmPassword && password === confirmPassword && !passwordMatchError && (
                      <p className='text-emerald-500 text-xs mt-1'>Passwords match ✓</p>
                    )}
                  </div>

                  {/* Terms Checkbox */}
                  <div className='flex items-start gap-3 pt-2'>
                    <input
                      type='checkbox'
                      id='terms'
                      checked={agreeToTerms}
                      onChange={(e) => setAgreeToTerms(e.target.checked)}
                      className='w-5 h-5 rounded border-2 border-slate-300 bg-white accent-[#091F5B] cursor-pointer mt-1'
                    />
                    <label htmlFor='terms' className='text-sm text-slate-600 cursor-pointer'>
                      I agree to the{' '}
                      <a href='#' className='text-[#091F5B] hover:text-[#091F5B]/80 font-semibold'>
                        Terms and Conditions
                      </a>
                      {' '}and{' '}
                      <a href='#' className='text-[#091F5B] hover:text-[#081a4f] font-semibold'>
                        Privacy Policy
                      </a>
                    </label>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className='p-3 rounded-lg bg-red-50 border border-red-300 text-red-700 text-sm'>{error}</div>
                  )}

                  {/* Sign Up Button */}
                  <button
                    type='submit'
                    disabled={!isSignupFormValid()}
                    className={`w-full h-11 rounded-lg font-semibold text-white transition-all ${
                      isSignupFormValid()
                        ? 'bg-[#091F5B] hover:bg-[#081a4f] shadow-lg'
                        : 'bg-slate-400 cursor-not-allowed opacity-60'
                    }`}
                  >
                    Continue to Registration
                  </button>
                </form>

                {/* Sign In Link */}
                <div className='text-center text-sm text-slate-600'>
                  Already have an account?{' '}
                  <button
                    type='button'
                    onClick={() => {
                      setIsSignInPressed(true);
                      window.setTimeout(() => {
                        setIsSignInPressed(false);
                        onBack();
                      }, 120);
                    }}
                    className={`font-semibold text-[#091F5B] hover:text-[#081a4f] transition-transform duration-150 ${isSignInPressed ? 'scale-95' : 'scale-100'}`}
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; opacity: 0; }
        .animate-slide-in-right { animation: slide-in-right 0.7s ease-out; }
        .animate-slide-in-left { animation: slide-in-left 0.5s ease-out; }
      `}</style>
    </div>
  );
}
