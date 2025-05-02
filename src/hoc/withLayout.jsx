import React from 'react'
import Layout from '../components/Layout'

/**
 * Pages can export:
 *   MyPage.layoutOpts = { fullWidth: true, flex: true }
 */
const withLayout = (Wrapped) => {
    return function LayoutWrapper(props) {
        const layoutOpts = Wrapped.layoutOpts || {}
        return (
            <Layout title={props.title} layoutOpts={layoutOpts}>
                <Wrapped {...props} />
            </Layout>
        )
    }
}

export default withLayout
