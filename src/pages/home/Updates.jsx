// src/pages/home/Updates.jsx
import React from 'react';
import withLayout from '../../hoc/withLayout.jsx';
import BlogFeed   from '../../components/BlogFeed.jsx';

function Updates() {
    return (
        <article className="mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-semibold">Updates</h1>
            {/* Show all posts: pass a very large limit so none are sliced off */}
            <BlogFeed limit={1000} />
        </article>
    );
}

export default withLayout(Updates);
