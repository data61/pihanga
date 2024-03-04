import React from 'react';

export type ComponentProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
};

type ComponentT = ComponentProps & {
  // onSomething: (ev: SomeEvent) => void;
};

export const Component = (props: ComponentT) => {
  const {
    title,
    children,
  } = props;


  return (
    <>
      <div className="page-header d-print-none">
        <div className="container-xl">
          <div className="row g-2 align-items-center">
            <div className="col">
              <h2 className="page-title">
                {title}
              </h2>
            </div>
          </div>
        </div>
      </div>
      {/* Page body */}
      <div className="page-body">
        <div className="container-xl">
          <div className="card">
            {children}
          </div>
        </div>
      </div>
    </>


  );
}
