import { CiSearch } from 'react-icons/ci';
import { KeyboardEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PerformSearch() {
  const [searchValue, setSearchValue] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchValue.trim() !== '') {
      router.push(`/search?query=${encodeURIComponent(searchValue)}`);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      <span className="input-ghost-primary input flex items-center input-lg input-rounded input-block">
        <input
          placeholder="Naruto: Shipudden"
          className="bg-transparent outline-none"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button className="btn btn-circle btn-ghost" onClick={handleSearch}>
          <CiSearch />
        </button>
      </span>
    </div>
  );
}
