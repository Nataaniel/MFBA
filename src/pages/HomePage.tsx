import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Calendar, Users, MapPin, ArrowRight, RefreshCw } from 'lucide-react';
import Button from '../components/Button';
import InputField from '../components/InputField';

const airports = [
  { code: 'CGK', name: 'Soekarno-Hatta International Airport', city: 'Jakarta' },
  { code: 'DPS', name: 'Ngurah Rai International Airport', city: 'Bali' },
  { code: 'SUB', name: 'Juanda International Airport', city: 'Surabaya' },
  { code: 'SIN', name: 'Changi Airport', city: 'Singapore' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [cabinClass, setCabinClass] = useState('Economy');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);
  
  const handleSwapAirports = () => {
    setOrigin(destination);
    setDestination(origin);
  };
  
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!origin) newErrors.origin = 'Please select origin airport';
    if (!destination) newErrors.destination = 'Please select destination airport';
    if (origin === destination && origin) newErrors.destination = 'Destination cannot be the same as origin';
    if (!departureDate) newErrors.departureDate = 'Please select departure date';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      
      // Simulate API call and redirect to search results
      setTimeout(() => {
        setIsLoading(false);
        navigate('/search-results');
      }, 1500);
    }
  };
  
  const filteredOriginAirports = airports.filter(airport => 
    airport.city.toLowerCase().includes(origin.toLowerCase()) || 
    airport.code.toLowerCase().includes(origin.toLowerCase()) ||
    airport.name.toLowerCase().includes(origin.toLowerCase())
  );
  
  const filteredDestinationAirports = airports.filter(airport => 
    airport.city.toLowerCase().includes(destination.toLowerCase()) || 
    airport.code.toLowerCase().includes(destination.toLowerCase()) ||
    airport.name.toLowerCase().includes(destination.toLowerCase())
  );

  // Today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-background">
      {/* Hero section */}
      <div className="relative bg-primary text-white py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-90"></div>
        </div>
        
        <div className="relative container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover Your Next Adventure</h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Find and book the best flight deals to your favorite destinations
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto bg-white dark:bg-card rounded-lg shadow-lg p-6"
          >
            <form onSubmit={handleSearch}>
              <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
                <div className="w-full md:w-1/2 relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    From <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className={`input-field pl-10 ${errors.origin ? 'border-error' : ''}`}
                      placeholder="Search cities or airports"
                      value={origin}
                      onChange={(e) => {
                        setOrigin(e.target.value);
                        setShowOriginDropdown(true);
                      }}
                      onFocus={() => setShowOriginDropdown(true)}
                    />
                  </div>
                  {errors.origin && (
                    <p className="mt-1 text-sm text-error">{errors.origin}</p>
                  )}
                  
                  {/* Dropdown for origin airports */}
                  {showOriginDropdown && filteredOriginAirports.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-card shadow-lg rounded-md py-1 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                      {filteredOriginAirports.map(airport => (
                        <div
                          key={airport.code}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => {
                            setOrigin(`${airport.city} (${airport.code})`);
                            setShowOriginDropdown(false);
                          }}
                        >
                          <div className="font-medium">{airport.city} ({airport.code})</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{airport.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-center mt-4 md:mt-0">
                  <button
                    type="button"
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
                    onClick={handleSwapAirports}
                    aria-label="Swap airports"
                  >
                    <RefreshCw className="h-5 w-5 text-primary" />
                  </button>
                </div>
                
                <div className="w-full md:w-1/2 relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    To <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className={`input-field pl-10 ${errors.destination ? 'border-error' : ''}`}
                      placeholder="Search cities or airports"
                      value={destination}
                      onChange={(e) => {
                        setDestination(e.target.value);
                        setShowDestinationDropdown(true);
                      }}
                      onFocus={() => setShowDestinationDropdown(true)}
                    />
                  </div>
                  {errors.destination && (
                    <p className="mt-1 text-sm text-error">{errors.destination}</p>
                  )}
                  
                  {/* Dropdown for destination airports */}
                  {showDestinationDropdown && filteredDestinationAirports.length > 0 && (
                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-card shadow-lg rounded-md py-1 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
                      {filteredDestinationAirports.map(airport => (
                        <div
                          key={airport.code}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                          onClick={() => {
                            setDestination(`${airport.city} (${airport.code})`);
                            setShowDestinationDropdown(false);
                          }}
                        >
                          <div className="font-medium">{airport.city} ({airport.code})</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{airport.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-wrap md:flex-nowrap gap-4 mb-6">
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Departure Date <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      className={`input-field pl-10 ${errors.departureDate ? 'border-error' : ''}`}
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      min={today}
                    />
                  </div>
                  {errors.departureDate && (
                    <p className="mt-1 text-sm text-error">{errors.departureDate}</p>
                  )}
                </div>
                
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Passengers
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="input-field pl-10"
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Passenger' : 'Passengers'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cabin Class
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Plane className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      className="input-field pl-10"
                      value={cabinClass}
                      onChange={(e) => setCabinClass(e.target.value)}
                    >
                      {['Economy', 'Premium Economy', 'Business', 'First'].map(cls => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                icon={<ArrowRight className="h-5 w-5" />}
              >
                Search Flights
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
      
      {/* Features section */}
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          Why Choose SkyTicket?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Best Price Guarantee',
              description: 'Find the lowest prices on flights with our best price guarantee.',
              icon: '💰'
            },
            {
              title: 'No Hidden Fees',
              description: 'Transparent pricing with no hidden charges or booking fees.',
              icon: '✓'
            },
            {
              title: 'Customer Support',
              description: '24/7 customer support for hassle-free booking and travel.',
              icon: '🛎️'
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              className="card text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Popular destinations */}
      <div className="py-16 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Popular Destinations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { city: 'Bali', image: 'https://images.pexels.com/photos/1000445/pexels-photo-1000445.jpeg', price: 'from $120' },
              { city: 'Singapore', image: 'https://images.pexels.com/photos/1141853/pexels-photo-1141853.jpeg', price: 'from $150' },
              { city: 'Tokyo', image: 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg', price: 'from $320' }
            ].map((destination, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer"
              >
                <img 
                  src={destination.image} 
                  alt={destination.city} 
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white">{destination.city}</h3>
                  <p className="text-white/90">{destination.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;