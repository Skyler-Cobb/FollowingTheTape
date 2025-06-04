import React from 'react';
import withLayout from '../../hoc/withLayout.jsx';
import PagePlaceholder from "../../components/PagePlaceholder.jsx";

const PAGE_TITLE = 'Sightings';

function Sightings() {
    return <PagePlaceholder title={PAGE_TITLE} />;
}

export default withLayout(Sightings);