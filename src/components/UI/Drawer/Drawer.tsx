"use client"

import { useEffect } from 'react'
import { Title } from '../Text'
import { DrawerProps } from './Drawer.types'
import styles from './Drawer.module.scss'

export const Drawer = ({ 
  isOpen, 
  onClose, 
  title, 
  children,
  className,
  width 
}: DrawerProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('drawer-open')
    } else {
      document.body.classList.remove('drawer-open')
    }

    return () => {
      document.body.classList.remove('drawer-open')
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <>
      <div 
        className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
        onClick={onClose}
      />
      <div 
        className={`${styles.drawer} ${isOpen ? styles.open : ''} ${className || ''}`}
        style={width ? { width } : undefined}
      >
        <div className={styles.header}>
          {title && (
            <Title level={2} className={styles.title}>
              {title}
            </Title>
          )}
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close drawer"
            type="button"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path 
                d="M18 6L6 18M6 6l12 12" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
              />
            </svg>
          </button>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </>
  )
}

