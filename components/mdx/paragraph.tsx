import React, { HTMLAttributes } from 'react';
import UrlPreviewer from './url-previewer';

type ChildType = {
  type: {
    render: {
      displayName: string;
    };
  };
};

const Paragraph = (props: HTMLAttributes<HTMLParagraphElement>) => {
  const { children, ...rest } = props;

  // Find anchor href url in children
  const links = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return null;
    if (typeof child.type !== 'object') return null;
    const childType = child.type as ChildType;
    if (!childType?.type) return null;
    // if (!child.props?.href) return null;
    const props = child.props as { href: string };
    return props.href;
  });

  return (
    <>
      <p {...rest}>{children}</p>

      {!!links?.length && (
        <div>
          {links?.map((url, i) => (
            <UrlPreviewer className="mb-4 last:mb-0" key={i} url={url} />
          ))}
        </div>
      )}
    </>
  );
};

export default Paragraph;
