import React from 'react';
import styles from './Partners.module.css';

interface Partner {
  name: string;
  logo: string;
}

const partners: Partner[] = [
  { name: 'Partner 1', logo: '/path/to/partner1.png' },
  { name: 'Partner 2', logo: '/path/to/partner2.png' },
  { name: 'Partner 3', logo: '/path/to/partner3.png' },
  { name: 'Partner 4', logo: '/path/to/partner4.png' },
  { name: 'Partner 5', logo: '/path/to/partner5.png' },
];

const Partners: React.FC = () => {
  // Duplicate the partners array to create a seamless loop
  const duplicatedPartners = [...partners, ...partners];

  return (
    <div className={styles.partnersContainer}>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className={styles.partnersTitle}>Crypthrust's Ecosystem</h2>
        
        <div className={styles.partnersScroll}>
          <div className={styles.partnersList}>
            {duplicatedPartners.map((partner, index) => (
              <div key={`${partner.name}-${index}`} className={styles.partnerItem}>
                <div className={styles.partnerLogo}>
                  {partner.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
