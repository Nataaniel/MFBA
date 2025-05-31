import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, User, CreditCard, Check, ArrowLeft } from 'lucide-react';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { Flight, Passenger } from '../types';

const BookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [passengers, setPassengers] = useState<Passenger[]>([{
    firstName: '',
    lastName: '',
    email: '',
    idNumber: '',
    type: 'adult'
  }]);
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Format price in IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  useEffect(() => {
    // Retrieve selected flight from localStorage
    const flightData = localStorage.getItem('selectedFlight');
    if (flightData) {
      setSelectedFlight(JSON.parse(flightData));
    } else {
      // Redirect back to search if no flight selected
      navigate('/search-results');
    }
  }, [navigate]);
  
  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index] = {
      ...updatedPassengers[index],
      [field]: value
    };
    setPassengers(updatedPassengers);
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    
    if (!contactEmail) newErrors.contactEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(contactEmail)) newErrors.contactEmail = 'Email is invalid';
    
    if (!contactPhone) newErrors.contactPhone = 'Phone number is required';
    
    // Validate passenger info
    passengers.forEach((passenger, index) => {
      if (!passenger.firstName) newErrors[`passenger${index}FirstName`] = 'First name is required';
      if (!passenger.lastName) newErrors[`passenger${index}LastName`] = 'Last name is required';
      if (!passenger.idNumber) newErrors[`passenger${index}IdNumber`] = 'ID/Passport number is required';
    });
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0 && selectedFlight) {
      setIsLoading(true);
      
      // Simulate API call for booking
      setTimeout(() => {
        setIsLoading(false);
        
        // Store booking details in localStorage
        const bookingDetails = {
          flight: selectedFlight,
          passengers,
          contactEmail,
          contactPhone,
          bookingCode: 'SKYB' + Math.floor(100000 + Math.random() * 900000)
        };
        localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
        
        // Navigate to confirmation page
        navigate('/confirmation');
      }, 2000);
    }
  };
  
  if (!selectedFlight) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Loading booking details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <button 
            onClick={() => navigate('/search-results')}
            className="flex items-center text-primary hover:text-primary-dark transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to search results
          </button>
          
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Please fill in the passenger details to complete your booking
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Booking form */}
          <motion.div 
            className="w-full lg:w-2/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <form onSubmit={handleSubmit}>
              <div className="card mb-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    id="contactEmail"
                    label="Email Address"
                    type="email"
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    placeholder="Enter your email address"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    error={errors.contactEmail}
                  />
                  
                  <InputField
                    id="contactPhone"
                    label="Phone Number"
                    type="tel"
                    icon={<Phone className="h-5 w-5 text-gray-400" />}
                    placeholder="Enter your phone number"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                    error={errors.contactPhone}
                  />
                </div>
              </div>
              
              <div className="card mb-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Passenger Details
                </h2>
                
                {passengers.map((passenger, index) => (
                  <div key={index} className="mb-8">
                    <h3 className="font-medium mb-4 text-gray-700 dark:text-gray-300">
                      Passenger {index + 1}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField
                        id={`passenger${index}FirstName`}
                        label="First Name"
                        icon={<User className="h-5 w-5 text-gray-400" />}
                        placeholder="Enter first name"
                        value={passenger.firstName}
                        onChange={(e) => handlePassengerChange(index, 'firstName', e.target.value)}
                        required
                        error={errors[`passenger${index}FirstName`]}
                      />
                      
                      <InputField
                        id={`passenger${index}LastName`}
                        label="Last Name"
                        placeholder="Enter last name"
                        value={passenger.lastName}
                        onChange={(e) => handlePassengerChange(index, 'lastName', e.target.value)}
                        required
                        error={errors[`passenger${index}LastName`]}
                      />
                      
                      <InputField
                        id={`passenger${index}Email`}
                        label="Email Address"
                        type="email"
                        icon={<Mail className="h-5 w-5 text-gray-400" />}
                        placeholder="Enter email address"
                        value={passenger.email}
                        onChange={(e) => handlePassengerChange(index, 'email', e.target.value)}
                        error={errors[`passenger${index}Email`]}
                      />
                      
                      <InputField
                        id={`passenger${index}IdNumber`}
                        label="ID/Passport Number"
                        placeholder="Enter ID or passport number"
                        value={passenger.idNumber}
                        onChange={(e) => handlePassengerChange(index, 'idNumber', e.target.value)}
                        required
                        error={errors[`passenger${index}IdNumber`]}
                      />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="card mb-8">
                <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                  Payment Method
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <input
                      id="credit_card"
                      name="paymentMethod"
                      type="radio"
                      value="credit_card"
                      checked={paymentMethod === 'credit_card'}
                      onChange={() => setPaymentMethod('credit_card')}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor="credit_card" className="ml-3 flex items-center">
                      <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">Credit/Debit Card</span>
                    </label>
                  </div>
                  
                  <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <input
                      id="bank_transfer"
                      name="paymentMethod"
                      type="radio"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={() => setPaymentMethod('bank_transfer')}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor="bank_transfer" className="ml-3 text-gray-700 dark:text-gray-300">
                      Bank Transfer
                    </label>
                  </div>
                  
                  <div className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <input
                      id="ewallet"
                      name="paymentMethod"
                      type="radio"
                      value="ewallet"
                      checked={paymentMethod === 'ewallet'}
                      onChange={() => setPaymentMethod('ewallet')}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <label htmlFor="ewallet" className="ml-3 text-gray-700 dark:text-gray-300">
                      E-Wallet
                    </label>
                  </div>
                </div>
              </div>
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                icon={<Check className="h-5 w-5" />}
              >
                Complete Booking
              </Button>
            </form>
          </motion.div>
          
          {/* Booking summary */}
          <motion.div 
            className="w-full lg:w-1/3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="card sticky top-20">
              <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">
                Booking Summary
              </h2>
              
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 flex-shrink-0 mr-3 bg-white dark:bg-gray-800 rounded-full p-2 flex items-center justify-center">
                    <img 
                      src={selectedFlight.airlineLogo} 
                      alt={selectedFlight.airline} 
                      className="max-w-full max-h-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      {selectedFlight.airline}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedFlight.flightNumber}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <div>
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        {selectedFlight.departureTime}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedFlight.departureAirport}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-800 dark:text-white">
                        {selectedFlight.arrivalTime}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedFlight.arrivalAirport}
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Thu, 15 Jun 2025
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Duration: {selectedFlight.duration}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <p className="text-gray-600 dark:text-gray-300">Base fare</p>
                    <p className="text-gray-800 dark:text-white">{formatPrice(selectedFlight.price)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600 dark:text-gray-300">Tax & fees</p>
                    <p className="text-gray-800 dark:text-white">{formatPrice(selectedFlight.price * 0.1)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600 dark:text-gray-300">Passenger(s)</p>
                    <p className="text-gray-800 dark:text-white">{passengers.length}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-between">
                    <p className="text-lg font-semibold text-gray-800 dark:text-white">Total</p>
                    <p className="text-xl font-bold text-primary dark:text-primary-dark">
                      {formatPrice(selectedFlight.price * 1.1 * passengers.length)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;