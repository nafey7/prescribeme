/* eslint-disable react-refresh/only-export-components -- route helpers, not route modules */
import { Suspense, type LazyExoticComponent, type ComponentType } from "react";

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
  </div>
);

export const withSuspense = (Component: LazyExoticComponent<ComponentType>) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);
