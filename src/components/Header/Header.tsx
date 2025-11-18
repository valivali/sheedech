"use client";

import styles from './Header.module.scss';
import { UserMenu } from '@/components/Auth';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>Sheedech</div>
        <UserMenu />
      </div>
    </header>
  );
};

