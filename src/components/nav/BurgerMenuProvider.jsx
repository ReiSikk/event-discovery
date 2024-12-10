// BurgerMenuContext.js
import React, { createContext, useContext, useState } from 'react'

const BurgerMenuContext = createContext()

export const BurgerMenuProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(prevState => !prevState)
  }

  return (
    <BurgerMenuContext.Provider value={{ isMenuOpen, toggleMenu }}>
      {children}
    </BurgerMenuContext.Provider>
  )
}

export const useBurgerMenu = () => useContext(BurgerMenuContext)