import React from "react";
import "./PositionsTable.scss";
import { colors } from "../../../services/theme";
import { Link, navigateTo } from "gatsby";
import { Edit2, Eye, Layers, LogOut, TrendingUp, XCircle } from "react-feather";
import { Box } from "@material-ui/core";
import PositionsTableHead from "./PositionsTableHead";
import PositionsTableBody from "./PositionsTableBody";
import { formatNumber, formatPrice } from "../../../utils/formatters";
import Table from "../../Table";

/**
 * @typedef {import("../../../services/tradeApiClient.types").UserPositionsCollection} UserPositionsCollection
 * @typedef {import("../../../hooks/usePositionsList").PositionsCollectionType} PositionsCollectionType
 * @typedef {Object} PositionsTableProps
 * @property {PositionsCollectionType} type
 * @property {UserPositionsCollection} positions
 */

/**
 * Component that display user positions in table view.
 *
 * @param {PositionsTableProps} props Component properties.
 * @returns {JSX.Element} Positions table element.
 */
const PositionsTable = (props) => {
  const { type, positions } = props;

  /**
   * Compose provider icon column content.
   *
   * @param {PositionEntity} position Position entity to compose icon for.
   * @returns {JSX.Element} Provider icon JSX element.
   */
  const composeProviderIcon = (position) => {
    // Wrap with link to provider provile when available.
    if (position.providerLink) {
      return (
        <Link to={position.providerLink}>
          <img src={position.providerLogo} title={position.providerName} width="30px" />
        </Link>
      );
    }

    return (
      <>
        <img src={position.providerLogo} title={position.providerName} width="30px" />
      </>
    );
  };

  /**
   * Compose trailing stop icon for a given position.
   *
   * @param {PositionEntity} position Position entity to compose icon for.
   * @returns {JSX.Element|null} Provider icon JSX element.
   */
  const composeTrailingStopIcon = (position) => {
    const trailingStopColor = position.trailingStopTriggered ? colors.green : colors.darkGrey;
    if (position.trailingStopTriggerPercentage) {
      return <TrendingUp color={trailingStopColor} />;
    }

    return null;
  };

  const openPositionsTableRows = positions.map((position) => {
    return [
      position.paperTrading ? <Layers color={colors.darkGrey} /> : null,
      position.openDateReadable,
      composeProviderIcon(position),
      position.providerName,
      position.signalId,
      position.pair,
      <>
        <span className="symbol">{position.quote}</span> {formatPrice(position.buyPrice)}
      </>,
      position.leverage,
      <>
        <span className="symbol">{position.quote}</span> {formatPrice(position.sellPrice)}
      </>,
      <>
        {position.status === 1 ? (
          <span>Still entering...</span>
        ) : (
          <>
            <span className="symbol">{position.quote}</span>
            <span className={position.profitStyle}>{formatPrice(position.profit)}</span>
          </>
        )}
      </>,
      <>
        {" "}
        {position.status === 1 ? (
          <span>Still entering...</span>
        ) : (
          <span className={position.profitStyle}>{formatNumber(position.profitPercentage, 2)}</span>
        )}
      </>,
      position.side,
      <>
        {!isNaN(position.stopLossPrice) && <span className="symbol">{position.quote}</span>}
        <span className={position.stopLossStyle}>{formatPrice(position.stopLossPrice)}</span>
      </>,
      <>
        <span className="symbol">{position.base}</span>
        {formatPrice(position.amount)}
      </>,
      <>
        <span className="symbol">{position.base}</span>
        {formatPrice(position.remainAmount)}
      </>,
      <>
        <span className="symbol">{position.quote}</span>
        {formatPrice(position.positionSizeQuote)}
      </>,
      <>{composeTrailingStopIcon(position)}</>,
      <>
        {position.takeProfitTargetsCountFail > 0 && (
          <span className="targetRed" title="Take profits failed.">
            {position.takeProfitTargetsCountFail}
          </span>
        )}
        {position.takeProfitTargetsCountSuccess > 0 && (
          <span className="targetGreen" title="Take profits successfully completed.">
            {position.takeProfitTargetsCountSuccess}
          </span>
        )}
        {position.takeProfitTargetsCountPending > 0 && (
          <span className="targetGray" title="Pending take profits.">
            {position.takeProfitTargetsCountPending}
          </span>
        )}
      </>,
      <>
        {position.reBuyTargetsCountFail > 0 && (
          <span className="targetRed" title="DCAs failed.">
            {position.reBuyTargetsCountFail}
          </span>
        )}
        {position.reBuyTargetsCountSuccess > 0 && (
          <span className="targetGreen" title="DCAs successfully completed.">
            {position.reBuyTargetsCountSuccess}
          </span>
        )}
        {position.reBuyTargetsCountPending > 0 && (
          <span className="targetGray" title="Pending DCAs">
            {position.reBuyTargetsCountPending}
          </span>
        )}
      </>,
      <>
        <span className={position.riskStyle}>{position.risk.toFixed(2)} %</span>
      </>,
      position.age,
      position.openTrigger,
      <>
        {position.isCopyTrading ? (
          <button data-position-id={position.positionId} title="view" type="button">
            <Eye color={colors.purpleLight} />
          </button>
        ) : (
          <button data-position-id={position.positionId} title="edit" type="button">
            <Edit2 color={colors.purpleLight} />
          </button>
        )}
        <button
          data-action={"exit"}
          data-position-id={position.positionId}
          title="exit"
          type="button"
        >
          <LogOut color={colors.purpleLight} />
        </button>
        <button
          data-action={"cancel"}
          data-position-id={position.positionId}
          title="cancel"
          type="button"
        >
          <XCircle color={colors.purpleLight} />
        </button>
      </>,
    ];
  });

  const openPositionTableColumns = [
    {
      name: "paperTrading",
      label: "col.provider.logo",
      options: {
        display: "false",
        viewColumns: false,
      },
    },
    {
      name: "providerLogo",
      label: "col.provider.logo",
      options: {
        display: "false",
        viewColumns: false,
      },
    },
    {
      name: "providerName",
      label: "col.provider.logo",
      options: {
        display: "false",
        viewColumns: false,
      },
    },
    {
      name: "side",
      label: "col.provider.logo",
      options: {
        display: "false",
        viewColumns: false,
      },
    },
  ];

  console.log("Data: ", openPositionsTableRows);
  return (
    <Box
      alignItems="center"
      className="positionsTable"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Table
        columns={openPositionTableColumns}
        data={openPositionsTableRows}
        persistKey="openPositions"
        title={<h2>Open positions</h2>}
      />
      {/* <Table className="table">
          <PositionsTableHead type={type} />
          <PositionsTableBody positions={positions} type={type} />
        </Table> */}
    </Box>
  );
};

export default PositionsTable;
