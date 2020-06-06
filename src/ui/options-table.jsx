import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

const OptionsTable = ({
  numColumns,
  rows,
  title,
}) => {
  const columns = _.times(
    numColumns,
    (index) => (
      <React.Fragment key={index}>
        <col className="text-col" />
        <col className="slider-col" />
      </React.Fragment>
    ),
  );

  const optionRows = _.map(
    rows,
    (rowElements, index) => (
      <tr key={index}>{rowElements}</tr>
    ),
  );

  return (
    <fieldset>
      <legend>{title}</legend>
      <table>
        <colgroup>
          {columns}
        </colgroup>
        <tbody>
          {optionRows}
        </tbody>
      </table>
    </fieldset>
  );
};

OptionsTable.propTypes = {
  numColumns: PropTypes.number.isRequired,
  rows: PropTypes.arrayOf(
    PropTypes.arrayOf(PropTypes.object),
  ).isRequired,
  title: PropTypes.string.isRequired,
};

export default OptionsTable;