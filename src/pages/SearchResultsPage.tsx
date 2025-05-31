import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Clock, Filter, RefreshCw } from 'lucide-react';
import Button from '../components/Button';
import { Flight } from '../types';

// Sample data
const flightData: Flight[] = [
  {
    id: '1',
    airline: 'Garuda Indonesia',
    airlineLogo: 'https://upload.wikimedia.org/wikipedia/en/9/9f/Garuda_Indonesia_Logo.svg',
    departureTime: '07:25',
    arrivalTime: '09:30',
    duration: '2h 5m',
    departureAirport: 'CGK',
    arrivalAirport: 'DPS',
    price: 1250000,
    flightNumber: 'GA-401',
  },
  {
    id: '2',
    airline: 'Lion Air',
    airlineLogo: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Lion_Air_logo.svg',
    departureTime: '08:45',
    arrivalTime: '11:15',
    duration: '2h 30m',
    departureAirport: 'CGK',
    arrivalAirport: 'DPS',
    price: 850000,
    flightNumber: 'JT-504',
  },
  {
    id: '3',
    airline: 'Citilink',
    airlineLogo: 'https://upload.wikimedia.org/wikipedia/id/9/9f/Citilink_logo.svg',
    departureTime: '10:15',
    arrivalTime: '12:30',
    duration: '2h 15m',
    departureAirport: 'CGK',
    arrivalAirport: 'DPS',
    price: 920000,
    flightNumber: 'QG-679',
  },
  {
    id: '4',
    airline: 'Batik Air',
    airlineLogo: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Batik_Air.svg',
    departureTime: '14:05',
    arrivalTime: '16:20',
    duration: '2h 15m',
    departureAirport: 'CGK',
    arrivalAirport: 'DPS',
    price: 1150000,
    flightNumber: 'ID-789',
  },
  {
    id: '5',
    airline: 'AirAsia',
    airlineLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/f5/AirAsia_New_Logo.svg',
    departureTime: '16:30',
    arrivalTime: '18:45',
    duration: '2h 15m',
    departureAirport: 'CGK',
    arrivalAirport: 'DPS',
    price: 780000,
    flightNumber: 'QZ-123',
  },
];

const SearchResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'price' | 'departure' | 'duration'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterAirlines, setFilterAirlines] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Format price in IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFlights(flightData);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // Get unique airlines for filtering
  const airlines = [...new Set(flightData.map(flight => flight.airline))];
  
  // Apply sorting and filtering
  const sortedAndFilteredFlights = [...flights]
    .filter(flight => filterAirlines.length === 0 || filterAirlines.includes(flight.airline))
    .sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === 'departure') {
        return sortOrder === 'asc' 
          ? a.departureTime.localeCompare(b.departureTime) 
          : b.departureTime.localeCompare(a.departureTime);
      } else {
        // Sort by duration (simplified version)
        const aDuration = parseInt(a.duration.split('h')[0]);
        const bDuration = parseInt(b.duration.split('h')[0]);
        return sortOrder === 'asc' ? aDuration - bDuration : bDuration - aDuration;
      }
    });
  
  const handleSortChange = (sortType: 'price' | 'departure' | 'duration') => {
    if (sortBy === sortType) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(sortType);
      setSortOrder('asc');
    }
  };
  
  const handleAirlineFilter = (airline: string) => {
    setFilterAirlines(prev => 
      prev.includes(airline) 
        ? prev.filter(a => a !== airline) 
        : [...prev, airline]
    );
  };
  
  const handleBookFlight = (flight: Flight) => {
    // Store selected flight in localStorage (simplified approach)
    localStorage.setItem('selectedFlight', JSON.stringify(flight));
    navigate('/booking');
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Jakarta (CGK) to Bali (DPS)
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Thursday, 15 Jun 2025 • 1 Passenger • Economy
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters panel - Mobile toggle */}
          <div className="md:hidden mb-4">
            <Button 
              variant="outline" 
              icon={<Filter className="h-5 w-5" />}
              onClick={() => setShowFilters(!showFilters)}
              fullWidth
            >
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
          
          {/* Filters panel */}
          <motion.div 
            className={`w-full md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="card sticky top-20">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Filters
              </h2>
              
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">Airlines</h3>
                {airlines.map(airline => (
                  <div key={airline} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`airline-${airline}`}
                      checked={filterAirlines.includes(airline)}
                      onChange={() => handleAirlineFilter(airline)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label 
                      htmlFor={`airline-${airline}`} 
                      className="ml-2 text-gray-700 dark:text-gray-300"
                    >
                      {airline}
                    </label>
                  </div>
                ))}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                icon={<RefreshCw className="h-4 w-4" />}
                onClick={() => setFilterAirlines([])}
                fullWidth
              >
                Reset Filters
              </Button>
            </div>
          </motion.div>
          
          {/* Flight results */}
          <div className="w-full md:w-3/4">
            {/* Sorting options */}
            <div className="bg-white dark:bg-card rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-2">
              <p className="text-gray-600 dark:text-gray-300 mr-2 flex items-center">Sort by:</p>
              
              <Button
                variant={sortBy === 'price' ? 'primary' : 'ghost'}
                size="sm"
                icon={sortBy === 'price' ? (
                  sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                ) : null}
                onClick={() => handleSortChange('price')}
              >
                Price
              </Button>
              
              <Button
                variant={sortBy === 'departure' ? 'primary' : 'ghost'}
                size="sm"
                icon={sortBy === 'departure' ? (
                  sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                ) : null}
                onClick={() => handleSortChange('departure')}
              >
                Departure Time
              </Button>
              
              <Button
                variant={sortBy === 'duration' ? 'primary' : 'ghost'}
                size="sm"
                icon={sortBy === 'duration' ? (
                  sortOrder === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
                ) : null}
                onClick={() => handleSortChange('duration')}
              >
                Duration
              </Button>
            </div>
            
            {/* Loading state */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading flights...</p>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
              >
                {sortedAndFilteredFlights.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      No flights match your current filters.
                    </p>
                    <Button 
                      variant="primary" 
                      className="mt-4"
                      onClick={() => setFilterAirlines([])}
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  sortedAndFilteredFlights.map(flight => (
                    <motion.div
                      key={flight.id}
                      variants={item}
                      className="flight-card"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex items-center mb-4 lg:mb-0">
                          <div className="w-12 h-12 flex-shrink-0 mr-4 bg-white dark:bg-gray-800 rounded-full p-2 flex items-center justify-center">
                            <img 
                              src={flight.airlineLogo} 
                              alt={flight.airline} 
                              className="max-w-full max-h-full"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-white">
                              {flight.airline}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {flight.flightNumber}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex flex-col md:flex-row items-center justify-between lg:w-2/3">
                          <div className="text-center mb-4 md:mb-0">
                            <p className="text-xl font-bold text-gray-800 dark:text-white">
                              {flight.departureTime}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {flight.departureAirport}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-center mb-4 md:mb-0">
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                              <Clock className="h-4 w-4 mr-1" /> {flight.duration}
                            </p>
                            <div className="relative w-32 md:w-40 h-0.5 bg-gray-300 dark:bg-gray-600 my-2">
                              <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-primary transform -translate-y-1/2"></div>
                              <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-primary transform -translate-y-1/2"></div>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Direct
                            </p>
                          </div>
                          
                          <div className="text-center mb-4 md:mb-0">
                            <p className="text-xl font-bold text-gray-800 dark:text-white">
                              {flight.arrivalTime}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {flight.arrivalAirport}
                            </p>
                          </div>
                          
                          <div className="flex flex-col items-end">
                            <p className="text-xl font-bold text-primary dark:text-primary-dark">
                              {formatPrice(flight.price)}
                            </p>
                            <Button
                              variant="primary"
                              size="sm"
                              className="mt-2"
                              onClick={() => handleBookFlight(flight)}
                            >
                              Select
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;