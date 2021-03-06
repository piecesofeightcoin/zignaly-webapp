import React from "react";
import { Box } from "@material-ui/core";
import PositionsTable from "../PositionsTable";

/**
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 * @typedef {Object} PositionsTabContentProps
 * @property {PositionsCollectionType} type
 * @property {Boolean} [isProfile]
 */

/**
 * Component that display user positions tab content.
 *
 * @param {PositionsTabContentProps} props Component properties.
 * @returns {JSX.Element} Positions tab content element.
 */

const PositionsTabContent = (props) => {
  const { type, isProfile } = props;

  return (
    <Box className="tabPanel">
      <PositionsTable isProfile={isProfile} type={type} />
    </Box>
  );
};

export default PositionsTabContent;
