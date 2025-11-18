import { FooterProps } from './Footer.types';
import { Title, Text } from '@/components/UI/Text';
import styles from './Footer.module.scss';

const defaultSections = [
  {
    title: 'Community',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Our Values', href: '#' },
      { label: 'Success Stories', href: '#' },
    ],
  },
  {
    title: 'Get Involved',
    links: [
      { label: 'Host an Event', href: '#' },
      { label: 'Join a Gathering', href: '#' },
      { label: 'Guidelines', href: '#' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '#' },
      { label: 'Contact Us', href: '#' },
      { label: 'Privacy Policy', href: '#' },
    ],
  },
];

export const Footer = ({ sections = defaultSections }: FooterProps) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <Title level={3}>Sheedech</Title>
            <Text variant="div">Bringing our community together, one meal at a time.</Text>
          </div>
          
          {sections.map((section) => (
            <div key={section.title} className={styles.footerSection}>
              <Title level={4}>{section.title}</Title>
              <ul>
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className={styles.footerBottom}>
          <Text variant="div">&copy; 2025 Sheedech. All rights reserved.</Text>
        </div>
      </div>
    </footer>
  );
};

