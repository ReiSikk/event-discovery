import { SearchIcon } from 'lucide-react'
import React from 'react'

function SearchBar({ handleSearchQuery }) {
  return (
    <div className='searchBar'>
        <input 
        type='text'
        placeholder='Search events...' 
        className='searchBar__input' 
        onChange={handleSearchQuery}
        onBlur={handleSearchQuery}
        />
        <div className='searchBar__btn' onClick={handleSearchQuery}>
          <SearchIcon size={16} className='searchBar__icon' /></div>
    </div>
  )
}

export default SearchBar