import { PropTypes } from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllData } from '../redux/countries/countries';
import CountryCard from './CountryCard';
import LoadingTimer from './LoadingTimer';

function CountriesList({ searchTerm = '' }) {
  const { status, data } = useSelector((state) => state.countries);
  const [visibleCountries, setVisibleCountries] = useState(data);

  const dispatch = useDispatch();

  useEffect(() => {
    if (status === 'not fetched') dispatch(fetchAllData());
  }, []);

  useEffect(() => {
    setVisibleCountries(data);
  }, [data]);

  useEffect(() => {
    const cleanSearchTerm = searchTerm.toLowerCase().trim();
    setVisibleCountries(data.filter((d) => {
      const countryName = d.name.toLowerCase();
      return countryName.includes(cleanSearchTerm);
    }));
  }, [searchTerm]);

  return (
    <>
      {status !== 'fetched' && (
        <div className="p-8 grid place-content-center">
          {status === 'not fetched' && <>No data fetched yet!</>}
          {status === 'fetching' && <LoadingTimer />}

          {status === 'failed' && (
            <>Failed in fetching data!</>
          )}

        </div>
      )}

      {status === 'fetched' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 pl-8 pr-8">
          {visibleCountries.map((countryData, index) => (
            <CountryCard
              key={countryData.id}
              data={countryData}
              index={index}
            />
          ))}
        </div>
      )}
      {status === 'failed' && <div>Failed in fetching data!</div>}
    </>
  );
}

CountriesList.propTypes = {
  searchTerm: PropTypes.string.isRequired,
};

export default CountriesList;
