
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, AlertCircle, Globe, Loader2, Info, X, User, Phone, Mail } from 'lucide-react';
import { submitOnboardingRequest } from '@/app/get-started/actions';

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia (Czech Republic)",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini (fmr. Swaziland)", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
  "Haiti", "Holy See", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan",
  "Vanuatu", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

interface GetStartedFormProps {
  settings: Record<string, string>;
}

export function GetStartedForm({ settings }: GetStartedFormProps) {
  const isHighVolume = settings.NEXT_PUBLIC_MORE_REGISTRATION === 'ON';
  const minBirdCapacity = Number(settings.NEXT_PUBLIC_MIN_BIRD_CAPACITY) || 5000;
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    poultryName: '',
    poultryType: 'Broiler',
    capacity: '',
    website: ''
  });

  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assignedSerial, setAssignedSerial] = useState('');

  const capacityNum = Number(formData.capacity);
  const isCapacityTooLow = formData.capacity !== '' && capacityNum < minBirdCapacity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.country) {
      setError("Please select your country.");
      return;
    }

    if (capacityNum < minBirdCapacity) {
      setError(`Minimum bird capacity for international onboarding is ${minBirdCapacity.toLocaleString()}.`);
      return;
    }

    if (!agreedToTerms) {
      setError("Please agree to the Global Terms of Service and Privacy Policy.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const result = await submitOnboardingRequest(formData);

    if (result.success) {
      setAssignedSerial(result.serialNo || '');
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } else {
      setError(result.error || "Submission failed. Please check your internet connection.");
    }
    
    setIsSubmitting(false);
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-12 text-center shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-500 mx-auto mt-20">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4">Application Sent!</h1>
        <p className="text-slate-600 mb-2 leading-relaxed font-medium">
          Registration Serial No:
        </p>
        <div className="bg-slate-50 border border-slate-200 py-3 rounded-xl mb-6 font-mono font-bold text-primary">
          {assignedSerial}
        </div>
        <p className="text-slate-600 mb-8 leading-relaxed font-medium">
          Our global verification team will contact you within 24-48 hours via email or phone.
        </p>
        <Button className="rounded-full px-8 h-12" asChild>
          <a href="/">Return to Home</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      {error && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 max-w-md w-full shadow-2xl border border-slate-200 text-center animate-in zoom-in-95 duration-300 relative">
            <button onClick={() => setError(null)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400">
              <X className="h-5 w-5" />
            </button>
            <div className="w-20 h-20 bg-destructive/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-destructive">
              <AlertCircle className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Registration Alert</h2>
            <p className="text-slate-600 font-medium mb-10">{error}</p>
            <Button onClick={() => setError(null)} className="w-full rounded-2xl h-14 font-bold" variant="destructive">
              Close and Correct
            </Button>
          </div>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Register your poultry business</h1>
        <p className="text-slate-600 max-w-xl mx-auto font-medium">
          Join the world's most versatile poultry ERP. Simple setup for farms of any size, anywhere in the world.
        </p>
      </div>

      <div className="space-y-6">
        {isHighVolume && (
          <div className="bg-amber-50 border border-amber-200 rounded-[2rem] p-6 flex items-start gap-4 shadow-sm">
            <Info className="h-5 w-5 text-amber-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-black text-amber-900 text-sm uppercase tracking-tight">High Demand</h4>
              <p className="text-amber-800 text-sm mt-1 leading-relaxed font-medium">
                We are processing international registrations in order of receipt. Expect a brief delay in account activation.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-8 md:p-12 space-y-12">
          {/* Section 1: Personal Identity */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">First Name *</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold" placeholder="Jane" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Last Name *</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold" placeholder="Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-12 pr-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold" placeholder="jane.doe@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Phone Number (International) *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input required type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full pl-12 pr-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold" placeholder="+1 234 567 8900" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Farm & Scale */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Globe className="h-5 w-5" />
              </div>
              Farm Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Farm Name *</label>
                <input required name="poultryName" value={formData.poultryName} onChange={handleChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold" placeholder="Emerald Valley Farms" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Country *</label>
                <select 
                  required 
                  name="country" 
                  value={formData.country} 
                  onChange={handleChange} 
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold bg-white"
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map(country => <option key={country} value={country}>{country}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Poultry Focus *</label>
                <select name="poultryType" value={formData.poultryType} onChange={handleChange} className="w-full px-5 py-4 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold bg-white">
                  <option value="Broiler">Broiler - Meat Production</option>
                  <option value="Layer">Layer - Egg Production</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Bird Capacity *</label>
                <input required type="number" name="capacity" value={formData.capacity} onChange={handleChange} className={`w-full px-5 py-4 rounded-xl border outline-none focus:ring-4 transition-all font-bold ${isCapacityTooLow ? 'border-rose-500 focus:ring-rose-500/5' : 'border-slate-200 focus:ring-primary/5'}`} placeholder="E.g. 25000" />
                {isCapacityTooLow && <p className="text-[10px] font-black text-rose-500 mt-2 uppercase tracking-tight">Minimum capacity is {minBirdCapacity.toLocaleString()} for international plans.</p>}
              </div>
            </div>
          </div>

          {/* Section 3: Digital Presence */}
          <div>
            <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Globe className="h-5 w-5" />
              </div>
              Digital Setup
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Desired Subdomain *</label>
                <div className="flex items-center">
                  <input required type="text" name="website" value={formData.website} onChange={handleChange} className="flex-grow px-5 py-4 rounded-l-xl border border-slate-200 border-r-0 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-bold" placeholder="emerald-farms" />
                  <div className="px-5 py-4 bg-slate-50 border border-slate-200 rounded-r-xl text-slate-400 font-bold text-sm">
                    .poultrymanager.in
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Consent & Submit */}
          <div className="pt-10 border-t border-slate-100 space-y-8">
            <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
              <input id="consent" type="checkbox" required checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} className="mt-1.5 h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary cursor-pointer" />
              <label htmlFor="consent" className="text-sm text-slate-600 leading-relaxed font-medium cursor-pointer">
                I agree to the <a href="/terms" className="text-primary font-bold hover:underline">Global Terms of Service</a> and <a href="/privacy" className="text-primary font-bold hover:underline">Privacy Policy</a>. I understand that my farm data will be stored securely in the cloud and processed for business management purposes.
              </label>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isCapacityTooLow || isSubmitting || !agreedToTerms} className="rounded-full px-8 h-12 font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all w-full md:w-auto">
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Complete Global Registration'}
                {!isSubmitting && <ArrowRight className="ml-3 h-5 w-5" />}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
