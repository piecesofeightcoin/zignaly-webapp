import React from "react";
import PositionFilters from "../PositionFilters";
import { Box } from "@material-ui/core";
import PositionsTable from "../PositionsTable";
import usePositionsList from "../../../hooks/usePositionsList";
import NoPositions from "../NoPositions";
import { isEmpty } from "lodash";

/**
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 * @typedef {Object} PositionsTabContentProps
 * @property {PositionsCollectionType} type
 * @property {React.MouseEventHandler} toggleFilters
 * @property {boolean} filtersVisibility
 */

/**
 * Component that display user positions tab content.
 *
 * @param {PositionsTabContentProps} props Component properties.
 * @returns {JSX.Element} Positions tab content element.
 */

const PositionsTabContent = (props) => {
  const { type, filtersVisibility, toggleFilters } = props;
  const { positionsAll, positionsFiltered, setFilters } = usePositionsList(type);
  const showTypesFilter = type === "log";

  return (
    <>
      {filtersVisibility && (
        <PositionFilters
          onChange={setFilters}
          onClose={toggleFilters}
          positions={positionsAll}
          showTypesFilter={showTypesFilter}
        />
      )}
      {type === "open" && (
        <Box className="tabPanel">
          {isEmpty(positionsFiltered) ? (
            <NoPositions />
          ) : (
            <PositionsTable positions={positionsFiltered} type={type} />
          )}
        </Box>
      )}
      {type === "closed" && (
        <Box className="tabPanel">
          {isEmpty(positionsFiltered) ? (
            <NoPositions />
          ) : (
            <PositionsTable positions={positionsFiltered} type={type} />
          )}
        </Box>
      )}
      {type === "log" && (
        <Box className="tabPanel">
          {isEmpty(positionsFiltered) ? (
            <NoPositions />
          ) : (
            <PositionsTable positions={positionsFiltered} type={type} />
          )}
        </Box>
      )}
    </>
  );
};

export default PositionsTabContent;