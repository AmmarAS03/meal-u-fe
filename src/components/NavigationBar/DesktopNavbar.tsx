import React, { useState, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { SearchIcon, ShoppingCartIcon, LogOutIcon, ClipboardListIcon, UserIcon } from 'lucide-react';
import { useAuth } from '../../contexts/authContext';
import { CategoryData, useCategoriesList } from '../../api/categoryApi';

const SHOW_ALL_CATEGORY = {
  id: 0,
  name: "Show All",
  image: "/img/AllFood.png",
};

const DesktopNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const history = useHistory();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { data: fetchedCategories = [], isFetching: isCategoriesFetching } = useCategoriesList();

  const allCategories = useMemo(() => [SHOW_ALL_CATEGORY, ...fetchedCategories], [fetchedCategories]);

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return allCategories;
    return allCategories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allCategories, searchTerm]);

  const handleLogout = () => {
    logout();
    history.push('/login');
  };

  const handleCategoryClick = (categoryName: string) => {
    history.push(`/order/${categoryName}`);
    setIsSearchFocused(false);
    setSearchTerm('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsSearchFocused(true);
  };

  return (
    <nav className="relative flex items-center justify-between px-6 py-4 bg-white shadow-sm">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-[#7862FC] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">mu</span>
          </div>
          <span className="text-xl font-bold text-[#7862FC]">Meal.U</span>
        </Link>
        <div className="space-x-6">
          <Link to="/" className="text-gray-700 hover:text-[#7862FC]">Home</Link>
          <Link to="/community" className="text-gray-700 hover:text-[#7862FC]">Community</Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 w-64 rounded-full bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-[#7862FC]"
            onFocus={() => setIsSearchFocused(true)}
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          
          {isSearchFocused && (
            <div className="absolute z-10 mt-2 w-96 bg-white rounded-md shadow-lg">
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                {isCategoriesFetching ? (
                  <p>Loading categories...</p>
                ) : (
                  <div className='max-h-96 overflow-y-auto'>
                    <div className="grid grid-cols-3 gap-4">
                      {filteredCategories.map((category: CategoryData) => (
                        <div
                          key={category.id}
                          className="flex flex-col items-center cursor-pointer hover:bg-gray-100 rounded-lg p-2 transition duration-300"
                          onClick={() => handleCategoryClick(category.name)}
                        >
                          <img
                            src={category.image}
                            alt={category.name}
                            className="w-16 h-16 object-cover rounded-full mb-2"
                          />
                          <span className="text-sm text-center text-black font-medium">{category.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <Link to="/cart" className="text-gray-700 hover:text-[#7862FC]">
          <ShoppingCartIcon size={24} />
        </Link>
        <Link to="/tab4" className="text-gray-700 hover:text-[#7862FC]">
          <ClipboardListIcon size={24} />
        </Link>
        <Link to="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-[#7862FC]">
          <UserIcon size={24} />
          <span>{user?.first_name || 'User'}</span>
        </Link>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-1 text-[#7862FC] hover:text-purple-600"
        >
          <LogOutIcon size={20} />
          <span>Logout</span>
        </button>
      </div>

      {isSearchFocused && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setIsSearchFocused(false);
            setSearchTerm('');
          }}
        ></div>
      )}
    </nav>
  );
};

export default DesktopNavbar;