import React from 'react';
import withLayout from '../../hoc/withLayout.jsx';

const PAGE_TITLE = 'What We Know';

function KnowledgeBank() {
  return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
        <h1 className="text-4xl font-bold tracking-tight">{PAGE_TITLE}</h1>
        <p className="text-gray-600 text-lg">
          This page is still under construction. Check back later!
        </p>
      </main>
  );
}

export default withLayout(KnowledgeBank);