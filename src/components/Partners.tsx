import React from 'react';
import styles from './Partners.module.css';

// Import ecosystem logos
import bittimeLogo from '../assets/partners/bittime.png';
import blockdevLogo from '../assets/partners/blockdev.png';
import coinvestasiLogo from '../assets/partners/coinvestasi.png';
import drcLogo from '../assets/partners/drc.png';
import mexcLogo from '../assets/partners/mexc.png';

interface Partner {
  name: string;
  logo: string;
  width?: string;
}

const partners: Partner[] = [
  { 
    name: 'Bittime', 
    logo: bittimeLogo,
    width: '250px'
  },
  { 
    name: 'Blockdev', 
    logo: blockdevLogo,
    width: '250px'
  },
  { 
    name: 'Coinvestasi', 
    logo: coinvestasiLogo,
    width: '250px'
  },
  { 
    name: 'DRC', 
    logo: drcLogo,
    width: '250px' 
  },
  { 
    name: 'MEXC', 
    logo: mexcLogo,
    width: '250px' 
  },
];

const Partners: React.FC = () => {
  // Duplicate the partners array to create a seamless loop
  const duplicatedPartners = [...partners, ...partners];
  // Create a copy of partners for media partners (you can replace these with actual media partners)
  const mediaPartners = [...partners];
  const duplicatedMediaPartners = [...mediaPartners, ...mediaPartners];

  return (
    <div className={styles.partnersContainer}>
      {/* Ecosystem Partners Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-normal text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-text-light via-text-light via-40% to-primary">
            Crypthrust's Ecosystem
          </h2>
          
          <div className={styles.partnersScroll}>
            <div className={styles.partnersList}>
              {duplicatedPartners.map((partner, index) => (
                <div key={`eco-${partner.name}-${index}`} className={styles.partnerItem}>
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className={styles.partnerLogo}
                    style={{ width: partner.width }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Media Partners Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-normal text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-primary via-text-light via-60% to-text-light">
            Crypthrust's Media Partner
          </h2>
          
          <div className={styles.partnersScroll}>
            <div className={`${styles.partnersList} ${styles.mediaPartnersList}`}>
              {duplicatedMediaPartners.map((partner, index) => (
                <div key={`media-${partner.name}-${index}`} className={styles.partnerItem}>
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className={styles.partnerLogo}
                    style={{ width: partner.width }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
