import React from 'react';
import withLayout from '../../hoc/withLayout.jsx';
import PagePlaceholder from "../../components/PagePlaceholder.jsx";

const PAGE_TITLE = 'About The Creator';

function AboutTheCreator() {
    return <PagePlaceholder title={PAGE_TITLE} />;
}

export default withLayout(AboutTheCreator);