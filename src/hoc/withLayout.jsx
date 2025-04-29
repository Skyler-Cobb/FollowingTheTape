// src/hoc/withLayout.jsx
import React from 'react';
import Layout from '../components/Layout';

// eslint-disable-next-line no-unused-vars
const withLayout = (WrappedComponent) => {
    return function LayoutWrapper(props) { // Named function for ESLint
        return (
            <Layout title={props.title}>
                <WrappedComponent {...props} />
            </Layout>
        );
    };
};

export default withLayout;