import React, { useState, useEffect } from "react";
import "./ExpandedRow.scss";
import { TableRow, TableCell, Checkbox, CircularProgress } from "@material-ui/core";
import useStoreSettingsSelector from "../../../../hooks/useStoreSettingsSelector";
import { composeManagementPositionsDataTable } from "../../../../utils/composePositionsDataTable";
// @ts-ignore
import { FixedSizeList } from "react-window";

/**
 *
 * @typedef {import('../../../../services/tradeApiClient.types').ManagementPositionsEntity} ManagementPositionsEntity
 * @typedef {Object} TransformedObject
 * @property {String} id
 * @property {String|Number|JSX.Element} data
 *
 * @typedef {Object} DefaultProps
 * @property {Array<ManagementPositionsEntity>} values
 * @property {String} persistKey
 * @property {React.MouseEventHandler} confirmAction
 * @property {Number} rowIndex Index of parent row.
 * @property {Function} onSelectionChange
 * @property {Function} onAllSelection
 * @property {Array<String>} selectedRows
 */

/**
 * Expanded rows component for management table.
 *
 * @param {DefaultProps} props Default component props.
 * @returns {JSX.Element} JSX component.
 */
const ExpandedRow = ({
  values,
  persistKey,
  confirmAction,
  rowIndex,
  onSelectionChange,
  selectedRows,
  onAllSelection,
}) => {
  const [list, setList] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const storeSettings = useStoreSettingsSelector();

  const prepareList = () => {
    if (values.length) {
      let positions = values[rowIndex] ? values[rowIndex].subPositions : [];
      let newList = [];
      let transformed = composeManagementPositionsDataTable(positions, confirmAction);
      let { data, columns } = transformed;
      for (let a = 0; a < positions.length; a++) {
        let transformedRow = [];
        for (let b = 0; b < columns.length; b++) {
          /**
           * @type {TransformedObject}
           */
          let obj = { id: "", data: "" };
          obj.id = columns[b].name;
          obj.data = data[a][b];
          transformedRow.push(obj);
        }
        newList[a] = transformedRow;
      }

      setList([...newList]);
    }
  };

  useEffect(prepareList, [values]);

  const checkIfAllChecked = () => {
    if (selectedRows.length) {
      let allSelected = true;
      const subPositions = values[rowIndex] ? values[rowIndex].subPositions : [];
      subPositions.forEach((position) => {
        if (!selectedRows.includes(position.positionId)) {
          allSelected = false;
        }
      });
      if (allSelected) {
        setCheckedAll(true);
      } else {
        setCheckedAll(false);
      }
    }
  };

  useEffect(checkIfAllChecked, [selectedRows]);

  /**
   *
   * @param {React.ChangeEvent<*>} e Change Event.
   * @param {Array<TransformedObject>} rowData Position Entity.
   * @returns {Void} None.
   */
  const handleChange = (e, rowData) => {
    const obj = rowData.find((item) => item.id === "positionId");
    onSelectionChange(rowIndex, obj.data);
  };

  /**
   *
   * @param {React.ChangeEvent<*>} e Change Event.
   * @returns {Void} None.
   */
  const handleChangeAll = (e) => {
    setCheckedAll(e.target.checked);
    onAllSelection(rowIndex, e.target.checked);
  };

  /**
   *
   * @param {Array<TransformedObject>} rowData Position Entity.
   * @returns {Boolean} Whether input is checked or not.
   */
  const checkedStatus = (rowData) => {
    const obj = rowData.find((item) => item.id === "positionId");
    if (selectedRows.includes(obj.data.toString())) {
      return true;
    }
    return false;
  };

  /**
   *
   * @param {Array<TransformedObject>} rowData Position Entity.
   * @returns {Boolean} Whether input is checked or not.
   */
  const updating = (rowData) => {
    const obj = rowData.find((item) => item.id === "positionId");
    const subPositions = values[rowIndex] ? values[rowIndex].subPositions : [];
    const position = subPositions.find((item) => item.positionId === obj.data.toString());
    if (position && position.updating) {
      return true;
    }
    return false;
  };

  const showCheckAllButton = () => {
    const subPositions = values[rowIndex] ? values[rowIndex].subPositions : [];
    const updatingPositions = subPositions.filter((item) => item.updating);
    if (subPositions.length === updatingPositions.length) {
      return false;
    }
    return true;
  };

  /**
   *
   * @typedef {Object} DefaultRowProps
   * @property {Number} index Row index.
    Index of the row rendered in react-window.
   */

  /**
   *
   * @param {DefaultRowProps} props Row props.
   * @returns {JSX.Element} JSx component.
   */
  const Row = ({ index }) => {
    const row = list[index];
    return (
      <TableRow className="expandedRows">
        {index === 0 && showCheckAllButton() ? (
          <TableCell className="checkboxCell">
            <Checkbox
              checked={checkedAll}
              className="checkbox"
              onChange={(e) => handleChangeAll(e)}
            />
          </TableCell>
        ) : (
          <TableCell>&nbsp;</TableCell>
        )}
        {!updating(row) ? (
          <TableCell className="checkboxCell">
            <Checkbox
              checked={checkedStatus(row)}
              className="checkbox"
              onChange={(e) => handleChange(e, row)}
            />
          </TableCell>
        ) : (
          <TableCell className="checkboxCell">
            <CircularProgress color="primary" size={30} />
          </TableCell>
        )}
        {row.map(
          /* @ts-ignore */
          (cell, i2) =>
            cell.id !== "subPositions" &&
            storeSettings.displayColumns[persistKey].includes(cell.id) && (
              <TableCell key={i2}> {cell.data} </TableCell>
            ),
        )}
      </TableRow>
    );
  };

  return (
    <TableRow className="rowsParent">
      <TableCell colSpan={24}>
        <FixedSizeList height={300} itemCount={list.length} itemSize={30}>
          {Row}
        </FixedSizeList>
      </TableCell>
    </TableRow>
  );
};

export default ExpandedRow;
