// src/Creator.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCard } from './cardService'; // Import our helper

// Define your available flowers here
// make sure the 'image' path matches your filenames in /public/flowers/
const FLOWER_TYPES = [
  { id: 'rose', name: 'Red Rose', image: '/flowers/rose.png' },
  { id: 'tulip', name: 'Tulip', image: '/flowers/tulip.png' },
  { id: 'lily', name: 'Lily', image: '/flowers/lily.png' },
  { id: 'gerbera', name: 'Gerbera', image: '/flowers/gerbera.png' },
];

const Creator = () => {
  const navigate = useNavigate();
  
  // State for the form text
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  // State for the bouquet (using a simple object to track counts)
  // Example: { rose: 2, tulip: 1 }
  const [bouquet, setBouquet] = useState({});
  
  const [loading, setLoading] = useState(false);

  // Helper to change flower counts
  const updateFlower = (flowerId, change) => {
    setBouquet(prev => {
      const currentCount = prev[flowerId] || 0;
      const newCount = Math.max(0, currentCount + change); // Prevent negative numbers
      return { ...prev, [flowerId]: newCount };
    });
  };

  const handleGenerate = async () => {
    if (!sender || !recipient || !message) {
      alert("Please fill in all the text fields!");
      return;
    }
    
    // Transform our simple bouquet object into a list for saving
    // From { rose: 2 } to [{ type: 'rose', count: 2 }]
    const bouquetArray = Object.entries(bouquet)
      .filter(([_, count]) => count > 0) // Remove flowers with 0 count
      .map(([id, count]) => ({ type: id, count }));

    if (bouquetArray.length === 0) {
      alert("Please pick at least one flower!");
      return;
    }

    setLoading(true);
    // Save to Firebase
    const cardId = await createCard(sender, recipient, message, bouquetArray);
    setLoading(false);

    if (cardId) {
      // If successful, go to the card page!
      navigate(`/card/${cardId}`);
    } else {
      alert("Something went wrong saving your card.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Make ur Vals Card</h1>
      
      {/* 1. Text Inputs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input 
          placeholder="To (Recipient Name)" 
          value={recipient} 
          onChange={e => setRecipient(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <input 
          placeholder="From (Your Name)" 
          value={sender} 
          onChange={e => setSender(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <textarea 
          placeholder="Your heartfelt message..." 
          value={message} 
          onChange={e => setMessage(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', height: '100px' }}
        />
      </div>

      {/* 2. Flower Picker */}
      <h3>Pick ur Flowers</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '15px' }}>
        {FLOWER_TYPES.map(flower => (
          <div key={flower.id} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
            <img src={flower.image} alt={flower.name} style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            <p style={{ margin: '5px 0' }}>{flower.name}</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
              <button onClick={() => updateFlower(flower.id, -1)}>-</button>
              <span style={{ fontWeight: 'bold' }}>{bouquet[flower.id] || 0}</span>
              <button onClick={() => updateFlower(flower.id, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Generate Button */}
      <button 
        onClick={handleGenerate} 
        disabled={loading}
        style={{ 
          marginTop: '30px', 
          width: '100%', 
          padding: '15px', 
          backgroundColor: '#ff4d4d', 
          color: 'white', 
          border: 'none', 
          borderRadius: '8px', 
          fontSize: '18px', 
          cursor: 'pointer' 
        }}
      >
        {loading ? "Creating Magic..." : "Generate Link"}
      </button>
    </div>
  );
};

export default Creator;