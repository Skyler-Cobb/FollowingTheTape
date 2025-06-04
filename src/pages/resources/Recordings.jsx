import React from 'react';
import withLayout from '../../hoc/withLayout.jsx';
import PagePlaceholder from "../../components/PagePlaceholder.jsx";

const PAGE_TITLE = 'Recordings';

function Recordings() {
    return <PagePlaceholder title={PAGE_TITLE} />;
}

export default withLayout(Recordings);