import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Download, Share, Printer, ArrowRight, Mail, Copy } from 'lucide-react';
import Button from '../components/Button';
import { BookingDetails } from '../types';

const ConfirmationPage: React.FC = () => {
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  
  // Format price in IDR
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };
  
  useEffect(() => {
    // Retrieve booking details from localStorage
    const details = localStorage.getItem('bookingDetails');
    if (details) {
      setBookingDetails(JSON.parse(details));
    }
    
    // Confetti effect when component mounts
    const confetti = () => {
      const canvas = document.createElement('canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '1000';
      document.body.appendChild(canvas);
      
      const ctx = canvas.getContext('2d');
      const particles: any[] = [];
      const particleCount = 100;
      const colors = ['#3B82F6', '#60A5FA', '#93C5FD', '#38BDF8', '#0EA5E9'];
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: 0,
          size: Math.random() * 8 + 2,
          weight: Math.random() * 1 + 0.1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      
      let frame = 0;
      const animate = () => {
        if (frame < 120) { // Run for 120 frames (about 2 seconds)
          requestAnimationFrame(animate);
          frame++;
          
          ctx!.clearRect(0, 0, canvas.width, canvas.height);
          
          for (let i = 0; i < particles.length; i++) {
            particles[i].y += particles[i].weight;
            particles[i].x += Math.random() * 2 - 1;
            
            ctx!.fillStyle = particles[i].color;
            ctx!.beginPath();
            ctx!.arc(particles[i].x, particles[i].y, particles[i].size, 0, Math.PI * 2);
            ctx!.closePath();
            ctx!.fill();
            
            if (particles[i].y > canvas.height) {
              particles[i].y = 0;
              particles[i].x = Math.random() * canvas.width;
            }
          }
        } else {
          // Remove canvas after animation completes
          document.body.removeChild(canvas);
        }
      };
      
      animate();
    };
    
    confetti();
    
    // Clean up localStorage after 5 minutes
    const cleanup = setTimeout(() => {
      localStorage.removeItem('selectedFlight');
      localStorage.removeItem('bookingDetails');
    }, 300000);
    
    return () => clearTimeout(cleanup);
  }, []);
  
  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex justify-center items-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Loading booking confirmation...</p>
        </div>
      </div>
    );
  }
  
  const { flight, passengers, contactEmail, bookingCode } = bookingDetails;
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2
              }}
              className="mx-auto bg-success/10 w-24 h-24 rounded-full flex items-center justify-center mb-6"
            >
              <Check className="w-12 h-12 text-success" />
            </motion.div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
              Your flight has been successfully booked
            </p>
            <p className="text-primary dark:text-primary-dark font-semibold text-lg">
              Booking Code: {bookingCode}
            </p>
          </div>
          
          <div className="card mb-8">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Flight Details
              </h2>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors">
                  <Printer className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors">
                  <Download className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-dark transition-colors">
                  <Share className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 flex-shrink-0 mr-4 bg-white dark:bg-gray-700 rounded-full p-2 flex items-center justify-center">
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
                    {flight.flightNumber} • Thu, 15 Jun 2025
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div className="mb-4 md:mb-0">
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {flight.departureTime}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {flight.departureAirport}
                  </p>
                </div>
                
                <div className="flex flex-col items-center mb-4 md:mb-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {flight.duration}
                  </p>
                  <div className="relative w-32 md:w-48 h-0.5 bg-gray-300 dark:bg-gray-600 my-2">
                    <div className="absolute top-1/2 right-0 w-2 h-2 rounded-full bg-primary transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-primary transform -translate-y-1/2"></div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Direct Flight
                  </p>
                </div>
                
                <div>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">
                    {flight.arrivalTime}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {flight.arrivalAirport}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
                Passenger Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="grid grid-cols-3 p-3 border-b border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400">
                  <div>Passenger</div>
                  <div>Type</div>
                  <div>ID/Passport</div>
                </div>
                {passengers.map((passenger, index) => (
                  <div key={index} className="grid grid-cols-3 p-3 border-b last:border-0 border-gray-200 dark:border-gray-700">
                    <div className="text-gray-800 dark:text-white">
                      {passenger.firstName} {passenger.lastName}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300 capitalize">
                      {passenger.type}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">
                      {passenger.idNumber}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">
                Payment Information
              </h3>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600 dark:text-gray-300">Base fare</p>
                  <p className="text-gray-800 dark:text-white">{formatPrice(flight.price)}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600 dark:text-gray-300">Tax & fees</p>
                  <p className="text-gray-800 dark:text-white">{formatPrice(flight.price * 0.1)}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600 dark:text-gray-300">Passenger(s)</p>
                  <p className="text-gray-800 dark:text-white">{passengers.length}</p>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 mt-3 pt-3">
                  <div className="flex justify-between">
                    <p className="font-semibold text-gray-800 dark:text-white">Total</p>
                    <p className="font-bold text-primary dark:text-primary-dark">
                      {formatPrice(flight.price * 1.1 * passengers.length)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Ticket Delivery
            </h2>
            
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Mail className="h-5 w-5 text-gray-400 mr-3" />
              <div className="flex-1">
                <p className="text-gray-800 dark:text-white">
                  E-ticket has been sent to
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {contactEmail}
                </p>
              </div>
              <button 
                className="flex items-center text-primary hover:text-primary-dark transition-colors"
              >
                <Copy className="h-4 w-4 mr-1" /> Copy
              </button>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/">
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="h-5 w-5" />}
              >
                Return to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConfirmationPage;