import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, CreditCard, Calendar, CheckCircle } from 'lucide-react';
import './App.css';

const ScratchClubWebsite = () => {
  const [currentPage, setCurrentPage] = useState('main');
  const [selectedMembership, setSelectedMembership] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    email: '',
    paymentType: 'monthly'
  });
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [enrollmentCount, setEnrollmentCount] = useState(1); // Starting at 1 for demo
  const [userType, setUserType] = useState(''); // 'paid' or 'reservation'

  const memberships = [
    {
      id: 'scratch1',
      name: 'Scratch 1',
      description: '10 hours per month off-peak members. Can buy more time.',
      price: 175,
      monthly: true
    },
    {
      id: 'scratch2',
      name: 'Scratch 2',
      description: '12 hours/month with 1 hour weekly of peak time. Can buy more time.',
      price: 300,
      monthly: true
    },
    {
      id: 'scratch3',
      name: 'Scratch 3',
      description: 'Priority booking, unlimited practice, 2 coaching hours per month, bring in up to 3 guests. Can buy more time.',
      price: 550,
      monthly: true
    },
    {
      id: 'scratch4',
      name: 'Scratch 4',
      description: 'Priority booking, unlimited practice, 2 PGA coaching hours per month, ability to bring up to 3 guests. Can buy more time.',
      price: 650,
      monthly: true
    },
    {
      id: 'founder',
      name: 'Founder',
      description: 'Lifetime Sim membership with up to 4 guest players on peak or non-peak hours with 2 hours max / day. Limited to 10 founder spots.',
      price: 7500,
      monthly: false,
      oneTime: true
    }
  ];

  const generateConfirmationNumber = (isReservation = false) => {
    const number = Math.floor(Math.random() * 100000);
    return isReservation ? `RES${String(number).padStart(5, '0')}` : String(Math.floor(Math.random() * 100000000)).padStart(8, '0');
  };

  const calculatePrice = (membership) => {
    if (membership.id === 'founder') return membership.price;
    
    const discount = enrollmentCount <= 50 ? 0.8 : 1; // 20% discount for first 50
    const basePrice = membership.price * discount;
    
    return formData.paymentType === 'yearly' ? basePrice * 12 * 0.9 : basePrice; // 10% discount for yearly
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEnrollment = (isPaid = true) => {
    if (!selectedMembership) {
      alert('Please select a membership level.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const confirmation = generateConfirmationNumber(!isPaid);
    setConfirmationNumber(confirmation);
    setUserType(isPaid ? 'paid' : 'reservation');
    
    if (isPaid) {
      setEnrollmentCount(prev => prev + 1);
    }
    
    setCurrentPage('confirmation');
  };

  const MembershipTable = ({ showCheckboxes = false, showPayment = false }) => (
    <div className="membership-table">
      <table>
        <thead>
          <tr>
            {showCheckboxes && <th>Select</th>}
            <th>Membership Level</th>
            <th>Description</th>
            <th>Subscription</th>
          </tr>
        </thead>
        <tbody>
          {memberships.map((membership, index) => (
            <tr key={membership.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
              {showCheckboxes && (
                <td className="checkbox-cell">
                  <input
                    type="radio"
                    name="membership"
                    value={membership.id}
                    checked={selectedMembership === membership.id}
                    onChange={(e) => setSelectedMembership(e.target.value)}
                  />
                </td>
              )}
              <td className="membership-name">{membership.name}</td>
              <td>{membership.description}</td>
              <td className="price-cell">
                {membership.oneTime ? (
                  `$${membership.price.toLocaleString()} - one-time enrollment for lifetime membership`
                ) : (
                  `$${membership.price}/month`
                )}
                {showPayment && selectedMembership === membership.id && (
                  <div className="pricing-details">
                    {enrollmentCount <= 50 && membership.id !== 'founder' && (
                      <div className="discount-text">Early Bird Discount: 20% OFF!</div>
                    )}
                    <div className="total-price">
                      Total: ${calculatePrice(membership).toLocaleString()}
                      {!membership.oneTime && ` ${formData.paymentType}`}
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const UserForm = ({ showPayment = false, isReservation = false }) => (
    <div className="user-form">
      <h3>{isReservation ? 'Reserve Your Spot' : 'Complete Your Enrollment'}</h3>
      
      <div className="form-grid">
        <div>
          <label>First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Username *</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password *</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Confirm Password *</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Street Address *</label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>City *</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>State *</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>ZIP Code *</label>
          <input
            type="text"
            name="zip"
            value={formData.zip}
            onChange={handleInputChange}
            required
          />
        </div>
      </div>

      {showPayment && (
        <div className="payment-section">
          <h4>Payment Information</h4>
          
          {selectedMembership !== 'founder' && (
            <div className="payment-type">
              <label>Payment Type</label>
              <select
                name="paymentType"
                value={formData.paymentType}
                onChange={handleInputChange}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly (10% discount)</option>
              </select>
            </div>
          )}

          <div className="payment-info">
            <p><strong>Payment Details:</strong></p>
            <p>Secure payment processing would be integrated here (Stripe, PayPal, etc.)</p>
            <div className="payment-placeholder">
              <CreditCard style={{display: 'inline', marginRight: '8px'}} size={20} />
              Credit Card / PayPal Integration Placeholder
            </div>
          </div>

          <div className="refund-policy">
            <p>
              <strong>Refund Policy:</strong> All registrations are refundable until the company opens the location.
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const MainPage = () => (
    <div className="main-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Scratch Club USA</h1>
          <p className="hero-subtitle">Premium Golf Simulators & Training</p>
          <div className="hero-location">
            <p>Coming Soon to Howell-Brighton-Wixom Michigan Area</p>
          </div>
        </div>
        <div className="video-placeholder">
          Beautiful Golf Course → TrackMan IO Simulator Transition
        </div>
      </div>

      {/* Questions Section */}
      <div className="content-container">
        <div className="questions-section">
          <div className="question-item">
            <div className="question-number">1</div>
            <p>Do you aspire to be the best golfer you can be?</p>
          </div>
          <div className="question-item">
            <div className="question-number">2</div>
            <p>Do you love to golf and want to year-round instead of just in the warm months?</p>
          </div>
          <div className="question-item">
            <div className="question-number">3</div>
            <p>Would you find value in a coach that helps you elevate your golf dramatically?</p>
          </div>

          <div className="welcome-section">
            <p className="welcome-text">
              If you said yes to any of these questions, you're in the right place. Welcome to Scratch Club USA.
            </p>
            <p>For the cost of a round of golf per week you can:</p>
            <ul>
              <li>• Train at your pace</li>
              <li>• Grow your potential toward a scratch-level golfer</li>
              <li>• TrackMan golf simulators and training facilities with optional coaching</li>
              <li>• Coming soon to the Howell-Brighton-Wixom Michigan area</li>
              <li>• Limited to members and guests only</li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="cta-section">
          <p className="cta-text">
            To save your spot, you have two options:
          </p>
          <div className="cta-buttons">
            <button
              onClick={() => setCurrentPage('enroll')}
              className="cta-button primary"
            >
              Select a membership level and enroll now with a discount!
            </button>
            <button
              onClick={() => setCurrentPage('reserve')}
              className="cta-button primary"
            >
              Hold my spot for later!
            </button>
          </div>
        </div>

        {/* Membership Table */}
        <MembershipTable />

        {/* Coach Image Placeholder */}
        <div className="coach-section">
          <div className="coach-placeholder">
            <User size={48} />
            <p><strong>Beautiful PGA Coach & TrackMan IO Simulator</strong></p>
            <p>Professional instruction in premium facilities</p>
          </div>
        </div>
      </div>
    </div>
  );

  const EnrollmentPage = () => (
    <div className="enrollment-page">
      <div className="page-container">
        <div className="back-button">
          <button onClick={() => setCurrentPage('main')}>
            ← Back to Main Page
          </button>
        </div>
        
        <h2>Enroll with Early Bird Discount!</h2>

        <MembershipTable showCheckboxes={true} showPayment={true} />
        <UserForm showPayment={true} />

        <div className="form-buttons">
          <button
            onClick={() => setCurrentPage('main')}
            className="button secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => handleEnrollment(true)}
            className="button primary"
          >
            Submit Payment
          </button>
        </div>
      </div>
    </div>
  );

  const ReservationPage = () => (
    <div className="reservation-page">
      <div className="page-container">
        <div className="back-button">
          <button onClick={() => setCurrentPage('main')}>
            ← Back to Main Page
          </button>
        </div>
        
        <h2>Reserve Your Spot</h2>

        <MembershipTable showCheckboxes={true} />
        <UserForm isReservation={true} />

        <div className="form-buttons">
          <button
            onClick={() => {
              if (window.confirm('Do you wish to go back to the Main Page without saving your reservation?')) {
                setCurrentPage('main');
              }
            }}
            className="button secondary"
          >
            Cancel
          </button>
          <button
            onClick={() => handleEnrollment(false)}
            className="button primary"
          >
            Submit My Reservation
          </button>
          <button
            onClick={() => handleEnrollment(true)}
            className="button warning"
          >
            Buy a Membership
          </button>
        </div>
      </div>
    </div>
  );

  const ConfirmationPage = () => (
    <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-content">
          <CheckCircle className="success-icon" size={64} />
          
          <h2>
            Congratulations {formData.firstName} {formData.lastName}!
          </h2>
          
          <div className="confirmation-details">
            {userType === 'paid' ? (
              <div>
                <p>
                  Thank you for starting your quest to become a Scratch-level golfer and golfing year-round with us.
                </p>
                <p className="confirmation-number">
                  Your confirmation number is: #{confirmationNumber}
                </p>
                <p>
                  An email has been sent to you with this information and instructions.
                </p>
              </div>
            ) : (
              <div>
                <p>
                  Thank you for reserving your spot for a membership at Scratch Club USA to work your way to a Scratch-level golfer.
                </p>
                <p className="confirmation-number">
                  Your reservation number is: #{confirmationNumber}
                </p>
                <p>
                  An email has been sent to you with this information and instructions.
                </p>
                <p className="withdrawal-info">
                  To reverse the reservation, please email your withdrawal request to info@scratchclubUSA.com and we'll make that happen.
                </p>
              </div>
            )}
          </div>

          <div className="contact-info">
            <p>
              <strong>Contact Us:</strong><br />
              Email: info@scratchclubUSA.com<br />
              Phone: (801) 830-3401
            </p>
            {userType === 'paid' && (
              <p>
                To reverse the submission, please contact us at (801) 830-3401.
              </p>
            )}
          </div>

          <button
            onClick={() => setCurrentPage('main')}
            className="button primary"
          >
            Continue to Main Page
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="scratch-club-app">
      {currentPage === 'main' && <MainPage />}
      {currentPage === 'enroll' && <EnrollmentPage />}
      {currentPage === 'reserve' && <ReservationPage />}
      {currentPage === 'confirmation' && <ConfirmationPage />}
    </div>
  );
};

export default ScratchClubWebsite;