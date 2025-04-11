import { useState } from 'react';

const options = {
  travelStyle: ['Luxury', 'Family', 'Budget', 'Adventure', 'Business'],
  interests: ['Hiking', 'Beaches', 'Food', 'History', 'Wildlife', 'Shopping', 'Nightlife'],
  companions: ['Solo', 'Couple', 'Group', 'Family', 'Friends']
};

const TravelPreferenceForm=()=> {
  const [form, setForm] = useState({
    travelStyle: new Set(options.travelStyle),
    interests: new Set(options.interests),
    companions: new Set(options.companions),
    medical: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const toggleCheckbox = (group, value) => {
    const updatedSet = new Set(form[group]);
    updatedSet.has(value) ? updatedSet.delete(value) : updatedSet.add(value);
    setForm({ ...form, [group]: updatedSet });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    
    const payload = {
      travelStyle: Array.from(form.travelStyle),
      interests: Array.from(form.interests),
      companions: Array.from(form.companions),
      medical: form.medical
    };

    try {
      const res = await fetch('/api/travel-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        throw new Error('Failed to update');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving your preferences.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCheckboxGroup = (label, groupKey, groupOptions) => (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full mr-3">
          {groupKey === 'travelStyle' ? '✈️' : groupKey === 'interests' ? '❤️' : '👥'}
        </span>
        {label}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {groupOptions.map(option => (
          <div 
            key={option} 
            onClick={() => toggleCheckbox(groupKey, option)}
            className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ${form[groupKey].has(option) 
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={form[groupKey].has(option)}
                onChange={() => {}}
                className="hidden"
              />
              <span className="flex-1 text-center font-medium">{option}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 sm:p-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Your Travel Preferences</h1>
            <p className="text-blue-100 max-w-lg mx-auto">
              Customize your travel experience by selecting your preferences below
            </p>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 md:p-10">
            {submitSuccess && (
              <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                Preferences updated successfully!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {renderCheckboxGroup('Travel Style', 'travelStyle', options.travelStyle)}
              {renderCheckboxGroup('Your Interests', 'interests', options.interests)}
              {renderCheckboxGroup('Travel Companions', 'companions', options.companions)}

              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-2 rounded-full mr-3">
                    ⚕️
                  </span>
                  Special Requirements
                </h3>
                <div className="relative">
                  <textarea
                    rows="3"
                    placeholder="Any allergies, medical conditions, or special requirements we should know about?"
                    value={form.medical}
                    onChange={e => setForm({ ...form, medical: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  />
                </div>
              </div>

              <div className="flex justify-center mt-10">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Save Preferences'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TravelPreferenceForm