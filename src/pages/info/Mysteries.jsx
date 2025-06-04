import React from 'react';
import withLayout from '../../hoc/withLayout.jsx';
import PagePlaceholder from "../../components/PagePlaceholder.jsx";

const PAGE_TITLE = 'Mysteries';

function Mysteries() {
    return <PagePlaceholder title={PAGE_TITLE} />;
}

export default withLayout(Mysteries);
