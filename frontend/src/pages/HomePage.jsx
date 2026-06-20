import React from 'react';
import Hero from '../components/Hero';
import AboutCollege from '../components/AboutCollege';
import AboutDepartment from '../components/AboutDepartment';
import ConferenceDetails from '../components/ConferenceDetails';
import SubThemes from '../components/SubThemes';
import Committee from '../components/Committee';
import ImportantDates from '../components/ImportantDates';
// import Theme from '../components/Theme';

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutCollege />
      <AboutDepartment />
      <ConferenceDetails />
      <SubThemes />
      {/* <Theme /> */}
      <Committee />
      <ImportantDates />
    </>
  );
}
