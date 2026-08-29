import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { PRESET_AVATARS, AVAILABLE_INTEREST_TAGS, DEFAULT_USER_PROFILE } from '../data/mockData';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onSaveProfile: (updatedProfile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>(userProfile);
  const [activeTab, setActiveTab] = useState<'details' | 'avatar' | 'vibe'>('details');
  const [customTagInput, setCustomTagInput] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isSavedNotice, setIsSavedNotice] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof UserProfile, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be under 5MB.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          avatarUrl: event.target?.result as string,
          avatarPresetId: undefined,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetAvatar = (preset: typeof PRESET_AVATARS[0]) => {
    setFormData((prev) => ({
      ...prev,
      avatarUrl: preset.url,
      avatarPresetId: preset.id,
    }));
  };

  const handleApplyCustomUrl = () => {
    if (customUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        avatarUrl: customUrlInput.trim(),
        avatarPresetId: undefined,
      }));
      setCustomUrlInput('');
      setShowUrlField(false);
    }
  };

  const handleToggleActivity = (tag: string) => {
    setFormData((prev) => {
      const exists = prev.favoriteActivities.includes(tag);
      const updated = exists
        ? prev.favoriteActivities.filter((t) => t !== tag)
        : [...prev.favoriteActivities, tag];
      return { ...prev, favoriteActivities: updated };
    });
  };

  const handleAddCustomTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const tag = customTagInput.trim();
    if (tag && !formData.favoriteActivities.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        favoriteActivities: [...prev.favoriteActivities, tag],
      }));
      setCustomTagInput('');
    }
  };

  const handleSave = () => {
    onSaveProfile(formData);
    setIsSavedNotice(true);
    setTimeout(() => {
      setIsSavedNotice(false);
      onClose();
    }, 900);
  };

  const handleResetDefaults = () => {
    setFormData(DEFAULT_USER_PROFILE);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-[#dee5d8] overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-5 sm:px-7 py-4 bg-[#fcfdf6] border-b border-[#dee5d8] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#15803d]">
              <span className="material-symbols-outlined text-[24px]">badge</span>
            </div>
            <div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#052e16]">
                Edit Student Profile & Sanctuary ID
              </h3>
              <p className="font-body text-xs text-[#52634f]">
                Customize your avatar, bio, and campus comfort preferences
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#72796f] hover:bg-[#eaede6] hover:text-[#1a1c19] transition-colors"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#dee5d8] bg-[#f9faf6] px-5 sm:px-7 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-heading font-semibold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'details'
                ? 'border-[#2e7d32] text-[#1b5e20]'
                : 'border-transparent text-[#72796f] hover:text-[#1a1c19]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            <span>Biodata & Academics</span>
          </button>

          <button
            onClick={() => setActiveTab('avatar')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-heading font-semibold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'avatar'
                ? 'border-[#2e7d32] text-[#1b5e20]'
                : 'border-transparent text-[#72796f] hover:text-[#1a1c19]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">account_circle</span>
            <span>Change Photo / Avatar</span>
          </button>

          <button
            onClick={() => setActiveTab('vibe')}
            className={`pb-2.5 px-3 text-xs sm:text-sm font-heading font-semibold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'vibe'
                ? 'border-[#2e7d32] text-[#1b5e20]'
                : 'border-transparent text-[#72796f] hover:text-[#1a1c19]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">spa</span>
            <span>Comfort Vibes & Tags</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 no-scrollbar">
          {/* Sanctuary ID Live Badge Preview */}
          <div className="bg-gradient-to-br from-[#f0fdf4] to-[#ecfdf5] rounded-2xl p-4.5 border border-[#86efac]/60 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#bbf7d0]/30 rounded-bl-full pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 relative z-10">
              <div className="relative group">
                <img
                  src={formData.avatarUrl}
                  alt={formData.name}
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_USER_PROFILE.avatarUrl;
                  }}
                />
                <button
                  type="button"
                  onClick={() => setActiveTab('avatar')}
                  className="absolute bottom-0 right-0 bg-[#2e7d32] text-white p-1 rounded-full shadow-xs hover:bg-[#1b5e20] transition-colors"
                  title="Change photo"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                </button>
              </div>

              <div className="text-center sm:text-left flex-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                  <h4 className="font-heading text-lg sm:text-xl font-bold text-[#052e16]">
                    {formData.name || 'Anonymous Student'}
                  </h4>
                  {formData.pronouns && (
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] border border-[#86efac]">
                      {formData.pronouns}
                    </span>
                  )}
                  {formData.year && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-white text-[#52634f] border border-[#dee5d8]">
                      {formData.year}
                    </span>
                  )}
                </div>

                <p className="text-xs font-semibold text-[#166534] mb-1.5 flex items-center justify-center sm:justify-start gap-1">
                  <span className="material-symbols-outlined text-[15px]">school</span>
                  <span>{formData.major || 'Undeclared Major'}</span>
                  {formData.campus && <span>• {formData.campus}</span>}
                </p>

                <p className="text-xs text-[#334155] italic leading-relaxed max-w-lg mb-2">
                  "{formData.bio || 'Taking it one breath and one day at a time.'}"
                </p>

                {/* Tags preview */}
                <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {formData.favoriteActivities.slice(0, 4).map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/90 text-[#166534] font-medium border border-[#bbf7d0]"
                    >
                      {tag}
                    </span>
                  ))}
                  {formData.favoriteActivities.length > 4 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] font-semibold">
                      +{formData.favoriteActivities.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* TAB 1: Biodata & Academics */}
          {activeTab === 'details' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#1b5e20] mb-1.5">
                    Your Name / Preferred Nickname *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g. Taylor, Alex, Jordan"
                    className="w-full bg-[#fcfdf6] border border-[#c2c8bd] focus:border-[#2e7d32] focus:bg-white rounded-xl px-3.5 py-2 text-sm text-[#1a1c19] outline-none focus:ring-2 focus:ring-[#b7f397] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#1b5e20] mb-1.5">
                    Pronouns
                  </label>
                  <input
                    type="text"
                    value={formData.pronouns}
                    onChange={(e) => handleInputChange('pronouns', e.target.value)}
                    placeholder="e.g. they/them, she/her, he/him"
                    className="w-full bg-[#fcfdf6] border border-[#c2c8bd] focus:border-[#2e7d32] focus:bg-white rounded-xl px-3.5 py-2 text-sm text-[#1a1c19] outline-none focus:ring-2 focus:ring-[#b7f397] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#1b5e20] mb-1.5">
                    Academic Major & Program
                  </label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                    placeholder="e.g. Biochemistry / Computer Science"
                    className="w-full bg-[#fcfdf6] border border-[#c2c8bd] focus:border-[#2e7d32] focus:bg-white rounded-xl px-3.5 py-2 text-sm text-[#1a1c19] outline-none focus:ring-2 focus:ring-[#b7f397] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#1b5e20] mb-1.5">
                    Academic Year / Grade Level
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => handleInputChange('year', e.target.value)}
                    className="w-full bg-[#fcfdf6] border border-[#c2c8bd] focus:border-[#2e7d32] focus:bg-white rounded-xl px-3.5 py-2 text-sm text-[#1a1c19] outline-none focus:ring-2 focus:ring-[#b7f397] transition-all"
                  >
                    <option value="Freshman (1st Year)">Freshman (1st Year)</option>
                    <option value="Sophomore (2nd Year)">Sophomore (2nd Year)</option>
                    <option value="Junior (3rd Year)">Junior (3rd Year)</option>
                    <option value="Senior (4th Year)">Senior (4th Year)</option>
                    <option value="Graduate / Master's">Graduate / Master's</option>
                    <option value="Ph.D. Candidate">Ph.D. Candidate</option>
                    <option value="High School Senior">High School Senior</option>
                    <option value="Lifelong Learner">Lifelong Learner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#1b5e20] mb-1.5">
                  Campus / Dorm / Residence
                </label>
                <input
                  type="text"
                  value={formData.campus || ''}
                  onChange={(e) => handleInputChange('campus', e.target.value)}
                  placeholder="e.g. North Campus Quad, Off-Campus Apartment, West Hall"
                  className="w-full bg-[#fcfdf6] border border-[#c2c8bd] focus:border-[#2e7d32] focus:bg-white rounded-xl px-3.5 py-2 text-sm text-[#1a1c19] outline-none focus:ring-2 focus:ring-[#b7f397] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#1b5e20] mb-1.5">
                  Personal Sanctuary Bio / Current Motto
                </label>
                <textarea
                  rows={2}
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder="Share a gentle reflection or note about your current mindset..."
                  className="w-full bg-[#fcfdf6] border border-[#c2c8bd] focus:border-[#2e7d32] focus:bg-white rounded-xl p-3 text-sm text-[#1a1c19] outline-none focus:ring-2 focus:ring-[#b7f397] transition-all resize-none"
                />
              </div>

              {/* Optional Emergency Contact */}
              <div className="p-3.5 bg-[#f8faf7] rounded-xl border border-[#dee5d8] space-y-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#347d39] text-[18px]">
                    contact_phone
                  </span>
                  <h5 className="font-heading text-xs font-bold text-[#1b5e20]">
                    Peace-of-Mind Emergency Contact (Optional)
                  </h5>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={formData.emergencyContactName || ''}
                    onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                    placeholder="Contact Name & Relation (e.g. Roommate Sam)"
                    className="w-full bg-white border border-[#c2c8bd] rounded-lg px-3 py-1.5 text-xs text-[#1a1c19] outline-none focus:border-[#2e7d32]"
                  />
                  <input
                    type="text"
                    value={formData.emergencyContactPhone || ''}
                    onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                    placeholder="Phone Number (e.g. 555-0199)"
                    className="w-full bg-white border border-[#c2c8bd] rounded-lg px-3 py-1.5 text-xs text-[#1a1c19] outline-none focus:border-[#2e7d32]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Photo / Avatar Selection */}
          {activeTab === 'avatar' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Upload custom image */}
              <div className="p-4.5 bg-[#f8faf7] rounded-2xl border-2 border-dashed border-[#bbf7d0] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-full bg-[#dcfce7] flex items-center justify-center text-[#15803d] shrink-0">
                    <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
                  </div>
                  <div>
                    <h5 className="font-heading text-sm font-bold text-[#052e16]">
                      Upload Photo From Your Device
                    </h5>
                    <p className="text-xs text-[#52634f]">
                      Choose any profile picture from your phone or laptop (JPG, PNG, WebP)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-semibold rounded-full shadow-xs flex items-center gap-1.5 transition-all"
                  >
                    <span className="material-symbols-outlined text-[16px]">file_upload</span>
                    <span>Browse Image</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUrlField(!showUrlField)}
                    className="px-3 py-2 bg-white border border-[#c2c8bd] hover:bg-[#eaede6] text-[#1b5e20] text-xs font-medium rounded-full transition-all"
                  >
                    Web URL
                  </button>
                </div>
              </div>

              {uploadError && (
                <p className="text-xs text-red-600 font-semibold px-2">{uploadError}</p>
              )}

              {showUrlField && (
                <div className="flex gap-2 p-3 bg-[#f0f2eb] rounded-xl">
                  <input
                    type="url"
                    value={customUrlInput}
                    onChange={(e) => setCustomUrlInput(e.target.value)}
                    placeholder="https://example.com/my-avatar.png"
                    className="flex-1 bg-white border border-[#c2c8bd] rounded-lg px-3 py-1.5 text-xs text-[#1a1c19] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCustomUrl}
                    className="px-4 py-1.5 bg-[#2e7d32] text-white text-xs font-semibold rounded-lg"
                  >
                    Apply
                  </button>
                </div>
              )}

              {/* Preset Gallery */}
              <div>
                <h5 className="font-heading text-xs font-bold text-[#1b5e20] uppercase tracking-wider mb-3">
                  Or Pick a Curated Sanctuary Avatar:
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PRESET_AVATARS.map((preset) => {
                    const isSelected = formData.avatarUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPresetAvatar(preset)}
                        className={`p-2.5 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-[#dcfce7] border-[#15803d] shadow-sm ring-2 ring-[#2e7d32]/20'
                            : 'bg-white border-[#dee5d8] hover:border-[#86efac] hover:bg-[#fcfdf6]'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="w-14 h-14 rounded-full object-cover shadow-2xs"
                        />
                        <div>
                          <div className="text-xs font-semibold text-[#1a1c19]">
                            {preset.label}
                          </div>
                          <span className="text-[10px] text-[#52634f]">{preset.tag}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Comfort Vibes & Tags */}
          {activeTab === 'vibe' && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-heading font-bold text-[#1b5e20] mb-1.5">
                  Favorite Comfort Vibe & Aesthetic
                </label>
                <input
                  type="text"
                  value={formData.comfortVibe}
                  onChange={(e) => handleInputChange('comfortVibe', e.target.value)}
                  placeholder="e.g. Rain on library windows, hot chai & warm blankets..."
                  className="w-full bg-[#fcfdf6] border border-[#c2c8bd] focus:border-[#2e7d32] focus:bg-white rounded-xl px-3.5 py-2 text-sm text-[#1a1c19] outline-none focus:ring-2 focus:ring-[#b7f397] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#1b5e20] mb-2">
                  My Calming Activities & Interests (Select or Add Your Own)
                </label>

                {/* Tag Pills */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {AVAILABLE_INTEREST_TAGS.map((tag) => {
                    const isSelected = formData.favoriteActivities.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleActivity(tag)}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all flex items-center gap-1 ${
                          isSelected
                            ? 'bg-[#2e7d32] text-white shadow-2xs'
                            : 'bg-[#f0f2eb] text-[#43483e] hover:bg-[#dcedc8]'
                        }`}
                      >
                        <span>{tag}</span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Add Custom Tag */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customTagInput}
                    onChange={(e) => setCustomTagInput(e.target.value)}
                    onKeyDown={handleAddCustomTag}
                    placeholder="Add custom interest (e.g. Watercolor painting)"
                    className="flex-1 bg-[#fcfdf6] border border-[#c2c8bd] rounded-xl px-3 py-1.5 text-xs text-[#1a1c19] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTag}
                    className="px-4 py-1.5 bg-[#e8f5e9] hover:bg-[#dcedc8] text-[#1b5e20] font-semibold text-xs rounded-xl border border-[#c8e6c9] transition-colors"
                  >
                    + Add Tag
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="px-5 sm:px-7 py-3.5 bg-[#fcfdf6] border-t border-[#dee5d8] flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs text-[#72796f] hover:text-[#b91c1c] underline transition-colors"
          >
            Reset to Defaults
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#c2c8bd] text-xs font-semibold text-[#43483e] hover:bg-[#f0f2eb] transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 rounded-full bg-[#2e7d32] hover:bg-[#1b5e20] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
            >
              {isSavedNotice ? (
                <>
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
