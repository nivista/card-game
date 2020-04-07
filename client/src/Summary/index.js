import React from 'react';

import SummaryTable from './SummaryTable';
export default function Summary(props) {
  return (
    <>
      <h2>Summary</h2>
      <SummaryTable {...props} />
    </>
  );
}
