const SideNavbarSearch = ({ navbarSearch }) => {
  return (
    <div className='search-body'>
      <div className='search-top'>
        <div className='search-header-div'>
          <h2>Search</h2>
        </div>
      </div>
      {navbarSearch}
    </div>
  );
};

export default SideNavbarSearch;
