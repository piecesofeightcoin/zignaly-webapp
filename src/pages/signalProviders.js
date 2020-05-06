import React from 'react';
import { Box } from '@material-ui/core';
import { compose } from "recompose";
import withLayout from "../layout";
import withPageContext from "../pageContext";

const SignalProviders = () => {
    return (
        <Box bgcolor="grid.main">
            <h1>I will be the SignalProviders</h1>
        </Box>
    )
}

export default compose(
    withPageContext,
    withLayout
)(SignalProviders);