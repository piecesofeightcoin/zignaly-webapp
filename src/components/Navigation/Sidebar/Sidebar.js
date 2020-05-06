import React, { useState } from 'react';
import  './Sidebar.sass';
import { Box, ClickAwayListener } from '@material-ui/core';
import Link from '../../LocalizedLink';
import { useSelector, useDispatch } from 'react-redux';
import SignalWhite from '../../../images/sidebar/signalWhite.svg';
import SignalBlack from '../../../images/sidebar/signalBlack.svg';
import TerminalWhite from '../../../images/sidebar/terminalWhite.svg';
import TerminlBlack from '../../../images/sidebar/terminalBlack.svg';
import CopyWhite from '../../../images/sidebar/copyWhite.svg';
import CopyBlack from '../../../images/sidebar/copyBlack.svg';
import FillWhite from '../../../images/sidebar/fillWhite.svg';
import FillBlack from '../../../images/sidebar/fillBlack.svg';
import OutlineWhite from '../../../images/sidebar/outlineWhite.svg';
import OutlineBlack from '../../../images/sidebar/outlineBlack.svg';
import DashboardWhite from '../../../images/sidebar/dashboardWhite.svg';
import DashboarBlack from '../../../images/sidebar/dashboardBlack.svg';
import {selectDarkTheme} from '../../../store/actions/settings';

const Sidebar = () => {
    const darkStyle = useSelector(state => state.settings.darkStyle)
    const [hover, setHover] = useState(true)
    const dispatch = useDispatch()

    return (
        <ClickAwayListener onClickAway={() => setHover(false)}>
            <Box
                onMouseEnter={() => setHover(true)}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="flex-start"
                bgcolor="grid.main"
                className={"sidebar " + (hover ? "full" : "")}>

                <Link to={"/dashboard"} className={"sideBarLink"} activeClassName={"active"}>
                    <img src={darkStyle ? DashboardWhite : DashboarBlack} alt="zignaly" className={"icon"} />
                    <span className={"text"}>dashboard</span>
                </Link>
                <Link to={"/copyTraders"} className={"sideBarLink"} activeClassName={"active"}>
                    <img src={darkStyle ? CopyWhite : CopyBlack} alt="zignaly" className={"icon"} />
                    <span className={"text"}>copy traders</span>
                </Link>
                <Link to={"/signalProviders"} className={"sideBarLink"} activeClassName={"active"}>
                    <img src={darkStyle ? SignalWhite : SignalBlack} alt="zignaly" className={"icon"} />
                    <span className={"text"}>signal providers</span>
                </Link>
                <Link to={"/tradingTerminal"} className={"sideBarLink"} activeClassName={"active"}>
                    <img src={darkStyle ? TerminalWhite : TerminlBlack} alt="zignaly" className={"icon"} />
                    <span className={"text"}>trading terminal</span>
                </Link>
                <Box className={"themeBox"} display="flex" flexWrap="wrap" flexDirection="row">
                    {hover &&
                        <React.Fragment>
                            <Box display="flex"flexDirection="row" justifyContent="center" className={darkStyle ? "checkedDarkBox" : "darkBox"}>
                                <img onClick={() => dispatch(selectDarkTheme(true))} src={darkStyle ? OutlineWhite : OutlineBlack} alt="zignaly" className={"icon"} />
                            </Box>
                            <Box display="flex" flexDirection="row" justifyContent="center" className={!darkStyle ? "checkedLightBox" : "lightBox"}>
                                <img onClick={() => dispatch(selectDarkTheme(false))} src={darkStyle ? FillWhite : FillBlack} alt="zignaly" className={"icon"} />
                            </Box>
                        </React.Fragment>
                    }
                    {!hover &&
                        <Box display="flex"flexDirection="row" justifyContent="center" className={darkStyle ? "checkedDarkBox" : "checkedLightBox"}>
                            <img onClick={() => dispatch(selectDarkTheme(true))} src={darkStyle ? OutlineWhite : FillBlack} alt="zignaly" className={"icon"} />
                        </Box>
                    }
                </Box>
            </Box>
        </ClickAwayListener>
    )
}

export default Sidebar;