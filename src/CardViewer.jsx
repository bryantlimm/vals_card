import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCardData } from './cardService';

const CardViewer = () => {
  const { id } = useParams();
  const [cardData, setCardData] = useState(null);
  const [flowers, setFlowers] = useState([]); // Store the positions here
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCardData(id);
      
      if (data) {
        setCardData(data);
        
        // Generate positions ONCE here to avoid "impure render" errors
        const generatedFlowers = [];
        data.bouquet.forEach((item) => {
          for (let i = 0; i < item.count; i++) {
            generatedFlowers.push({
              type: item.type,
              // Fan the flowers out: between -45 and 45 degrees
              rotation: Math.floor(Math.random() * 90) - 45,
              // Slight size variation: 0.8 to 1.1
              scale: 0.8 + Math.random() * 0.3,
              // Random height: taller or shorter stems
              heightOffset: Math.floor(Math.random() * 20),
              // Random horizontal jitter so they aren't perfect
              xOffset: Math.floor(Math.random() * 20) - 10,
              // Layering: 1-10
              zIndex: Math.floor(Math.random() * 10)
            });
          }
        });
        setFlowers(generatedFlowers);
      }
      setLoading(false);
    };
    
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!cardData) return <div>Card not found</div>;

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      backgroundColor: '#fff0f5',
      padding: '20px'
    }}>
      
      {/* 1. The Letter */}
      <div style={{ 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px', 
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        textAlign: 'center',
        marginBottom: '40px',
        zIndex: 50
      }}>
        <h1 style={{ color: '#e91e63' }}>Happy Valentine's, {cardData.recipient}!</h1>
        <p style={{ fontSize: '18px', margin: '20px 0' }}>"{cardData.message}"</p>
        <p style={{ fontWeight: 'bold' }}>- Love, {cardData.sender}</p>
      </div>

      {/* 2. The Bouquet Container */}
      <div style={{ 
        position: 'relative', 
        width: '300px', 
        height: '400px', // Tall enough for flowers
        marginTop: 'auto',
        marginBottom: '50px'
      }}>
        
        {/* Render Flowers */}
        {flowers.map((flower, index) => (
          <img 
            key={index}
            src={`/flowers/${flower.type}.png`}
            alt="flower"
            style={{
              position: 'absolute',
              // Center the flower horizontally in the container
              left: '50%',
              // Position it near the vase opening (adjust '20%' if needed)
              bottom: '45%', 
              width: '80px', 
              
              // CRITICAL: Rotate from bottom of stem!
              transformOrigin: 'bottom center',
              
              transform: `
                translateX(-50%) 
                translateX(${flower.xOffset}px)
                translateY(${-flower.heightOffset}px)
                rotate(${flower.rotation}deg) 
                scale(${flower.scale})
              `,
              zIndex: flower.zIndex, // Some behind, some in front
            }}
          />
        ))}

        {/* The Vase */}
        <img 
          src="/flowers/vase.png" 
          alt="vase" 
          style={{ 
            position: 'absolute', 
            bottom: 0, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            width: '120px',
            zIndex: 20 // Vase sits in front of the stems
          }} 
        />
      </div>

      {/* 3. The Copy Link Button */}
      <button 
        onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          alert("Link copied! Send it to your valentine! 💘");
        }}
        style={{
          marginTop: '20px',
          marginBottom: '20px',
          padding: '12px 24px',
          fontSize: '16px',
          backgroundColor: '#ff4d4d', // Red color
          color: 'white',
          border: 'none',
          borderRadius: '30px', // Rounded pill shape
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s',
          zIndex: 100 // Ensure it's clickable
        }}
        onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
      >
        Copy Link to Share
      </button>

    </div>
  );
};

export default CardViewer;